/** 面向切面的编程 */
import { getConstructorName, getFunctionName, getType, assignType, propertyCopy, buildTransparentProxyObject } from '../reflect/reflect';
import { log, getGlobalValue, IAnyType, setGlobalValue, IType, newGuid, EventHandler, EventFunction } from '../base/base';
import { syncLoadJson } from '../base/base';
import { inherits } from 'util';

// --------------以下是全局插件列表--------------
/**
 * 全局插件列表
 */
const globalAddonStorageName = '__global_addons__';
/**
 * 类型名称属性名
 */
export const typeNamePropertyName: string = '$type';

/**
 * 获取全局插件
 * @param name 插件名
 * @returns 插件
 */
export function getGlobalAddon(name: string): IAnyType {
    let globalAddons = getGlobalValue(globalAddonStorageName);
    if (globalAddons) {
        return globalAddons[name];
    }
    return undefined;
}

/**
 * 设置全局插件
 * @param name 设置全局插件
 * @param type 插件 
 */
export function setGlobalAddon(name: string, type: IAnyType) {
    let globalAddons = getGlobalValue(globalAddonStorageName);
    if (!globalAddons) {
        globalAddons = {};
    }
    globalAddons[name] = type;
    setGlobalValue(globalAddonStorageName, globalAddons);
}
// --------------以下是插件框架--------------
/**
 * 插件装饰器：用此装饰过的插件会将构造函数添加到插件类型列表中，便于检索
 * @param name 插件名称
 * @param description 插件描述
 */
export function addon(typeName?: string, name: string = undefined, description: string = undefined) {
    return function (target: any) {
        if (!typeName) { typeName = getConstructorName(target); }

        target.prototype.$typeName = typeName;
        target.prototype.$addonName = (name) ? name : typeName;
        target.prototype.$addonDescription = description;

        log('aop', `插件注册成功: ${typeName}`);
        setGlobalAddon(typeName, target);
    };
}

@addon('BaseAddon', '基础插件', '所有插件类型的基类')
export class BaseAddon {
    /** 类型名称 */
    $type?: string;
    /** 插件名称 */
    $addonName?: string;
    /** 插件描述 */
    $addonDescription?: string;
    /** 扩展属性 */
    [ext: string]: any;
    /** 资产ID */
    id?: string;
    /** 
     * 基础插件
     * @param id 唯一标识
     */
    constructor(id?: string) {
        // 添加事件机制
        this.id = id ? id : newGuid();
    }
    /** 事件：指定类型后 */
    onAssignedType?(): void;

    /**
     * 从origion生成
     * @param origin 原始对象
     */
    from?(origin: any) {
        propertyCopy(origin, this);
    }
    /** 字符串转换 */
    toString(): string {
        return addonSerialize(this);
    }
    /** 设置ID */
    setID?(id: string) {
        this.id = id;
        return this;
    }
    /** 添加事件 */
    addEventHandler?<T>(event: string, eventHandler: EventFunction<T>): this;
    /** 移除事件 */
    removeEventHandler?<T>(event: string, eventHandler: EventFunction<T>): this;
    /** 清空事件 */
    clearEventHandler?(event: string): this;
    /** 触发事件 */
    fire?(event: string, sender: any, eventArgs: any): void;
}
// TODO: 绑定插件事件监听器功能
// 所有由基础插件派生的子类都可以具有事件监听器方法
inherits(BaseAddon, EventHandler);

/**
 * 工厂
 */
export interface IFactory {
    /**
     * 获取值
     */
    getValue?(): any;
}

/**
 * 工厂
 */
export interface IFactory_T<T> extends IFactory {
    /**
     * 获取值
     */
    getValue?(): T;
}

/**
 * 引用类型（可以是类型本身，也可以是工厂类型）
 */
export type Ref<T> = T | IFactory_T<T>;

// --------------以下是插件辅助函数--------------
/**
 * 获取插件类型名称
 * @param type 类型
 * @returns 类型名称
 */
export function getAddonTypeName(type: IAnyType): string {
    let typeObj: any = type;
    if (!typeObj) { return undefined; }
    if (typeObj.$typeName) { return typeObj.$typeName; }
    if (typeObj.prototype.$typeName) { return typeObj.prototype.$typeName; }

    return getFunctionName(type);
}

/**
 * 根据插件名称获取类型
 * @param name 类型名称
 * @returns 类型
 */
export function getAddonTypeByName(name: string): IAnyType {
    return getGlobalAddon(name);
}

/**
 * 从对象获取插件类型名称
 * @param obj 对象
 * @returns 类型名称
 */
export function getAddonTypeNameFromObject(obj: Object): string {
    let type = getType(obj);
    if (!type) { return undefined; }

    return getAddonTypeName(type);
}

/**
 * 测试对象是否为IFactory
 * @param obj 要测试的对象
 */
export function isFactory(obj: any): obj is IFactory {
    if (!obj) { return false; }
    return (<IFactory>obj).getValue !== undefined;
}

/**
 * 获取对象
 * @param obj 对象，可能是实例或工厂
 */
export function getObject<T>(obj: Ref<T>): T {
    if (isFactory(obj)) {
        return obj.getValue();
    } else {
        return obj;
    }
}

/**
 * 根据插件ID查找插件
 * @param rootObject 根对象
 * @param addonID 插件ID
 */
export function findAddonByID(rootObject: any, addonID: string): any {
    if (rootObject.ID === addonID) {
        return rootObject;
    }

    // 查找子属性
    for (let property in rootObject) {
        if (rootObject.hasOwnProperty(property)) {
            let childAddon = findAddonByID(rootObject[property], addonID);
            if (childAddon) { return childAddon; }
        }
    }

    return undefined;
}

// --------------以下是插件序列化和反序列化--------------
/**
 * 将对象中的类型信息取出并更改对象的类型
 * @param rootObject 待获取类型的对象
 */
export function fetchAddonProtoType(rootObject: Object): void {
    // 获取子属性的类型信息
    for (let property in rootObject) {
        if (rootObject.hasOwnProperty(property)) {
            let properyValue = rootObject[property];
            if (properyValue instanceof Object && !(properyValue instanceof Function)) {
                fetchAddonProtoType(properyValue);
            }
        }
    }

    // 先通过$constructor获取类型
    let classType = rootObject.constructor;
    if (!classType || classType === Object) {
        // 然后通过$type获取类型
        let typeName = rootObject[typeNamePropertyName];
        if (typeName) {
            classType = getAddonTypeByName(typeName);
        }
    }
    if (classType) {
        assignType(rootObject, classType);
    }
}

/**
 * 设置类型信息到对象中
 * @param rootObject 待设置类型的对象
 */
export function setAddonTypeInfo(addonObject: Object): void {
    // 设置子属性的类型信息
    for (let property in addonObject) {
        if (addonObject.hasOwnProperty(property)) {
            let properyValue = addonObject[property];
            if (properyValue instanceof Object) {
                setAddonTypeInfo(properyValue);
            }
        }
    }
    let typeName = getAddonTypeNameFromObject(addonObject);
    if (typeName !== 'Object' && typeName !== 'String') {
        addonObject[typeNamePropertyName] = typeName;
    }
}

/**
 * 序列化对象
 * @param obj 对象
 * 序列化后的文本
 */
export function addonSerialize(obj: Object): string {
    setAddonTypeInfo(obj);
    return JSON.stringify(obj);
}

/**
 * 插件反序列化
 * @param jsonString json字符串
 */
export function addonDeserialize(jsonString: string): any {
    let result = JSON.parse(jsonString);
    fetchAddonProtoType(result);
    return result;
}

/**
 * 指定类型的插件反序列化
 * @param classType 类型
 * @param jsonString json字符串
 */
export function addonDeserializeToType<T>(classType: IType<T>, jsonString: string): T {
    let result: any = JSON.parse(jsonString);
    assignType(result, classType);
    return result;
}

/**
 * 同步加载Json
 * @param url JsonUrl
 */
export function syncLoadAddon(url: string) {
    let obj = syncLoadJson(url);
    fetchAddonProtoType(obj);
    return obj;
}

// --------------以下是工厂的定义--------------

/**
 * 代理工厂: 通过代理方式实现的工厂
 */
@addon('ProxyFactory', '代理工厂', '通过代理方式实现的工厂')
export class ProxyFactory extends BaseAddon implements IFactory {
    /**
     * 内部对象
     */
    protected innerObject?: any = {};

    constructor(public destObject?: IType<any> | Object) {
        super();

        if (typeof this.destObject === 'function') {
            let destFunc = <IType<any>>destObject;
            this.destObject = new destFunc();
        }
    }

    proxyMethod?(methodName: any, args: any): any {
        return this.innerObject[methodName].apply(args);
    }

    getValue?(): any {
        if (!this.innerObject) {
            this.innerObject = {};
        }

        /** 指定类型后建立代理对象 */
        buildTransparentProxyObject(this.innerObject, getType(this.destObject), (methodName: any, args: any) => {
            return this.proxyMethod(methodName, args);
        });
        return this.innerObject;
    }
}

/**
 * 对象工厂: 对象的直接引用
 */
@addon('ObjectFactory', '对象工厂', '对象的直接引用')
export class ObjectFactory extends BaseAddon implements IFactory {
    constructor(public objectReference?: any) {
        super();
    }

    getValue?(): any {
        return this.objectReference;
    }
}

/**
 * Json工厂: 通过JSONP字符串创建对象
 */
@addon('JsonFactory', 'Json工厂', '通过JSONP字符串创建对象')
export class JsonFactory extends BaseAddon implements IFactory {
    constructor(public jsonString?: string) {
        super();
    }

    getValue?(): any {
        if (this.jsonString) {
            return addonDeserialize(this.jsonString);
        }
        return undefined;
    }
}

/**
 * 插件工厂：根据插件ID获取插件
 */
@addon('AddonFactory', '插件工厂', '根据插件ID加载插件的工厂')
export class AddonFactory extends BaseAddon implements IFactory {
    constructor(public rootObject?: any, public addonID?: string) {
        super();
    }

    getValue?(): any {
        if (!this.rootObject && !this.addonID) {
            return findAddonByID(this.rootObject, this.addonID);
        }
        return undefined;
    }
}

/**
 * 懒工厂
 */
@addon('LazyFactory', '懒工厂', '延迟加载工厂')
export class LazyFactory<T> extends BaseAddon implements IFactory {
    /**
     * 构造方法
     * @param url url地址
     * @param objectName 对象名称 
     */
    constructor(public url?: string, public objectName?: string) {
        super();
    }

    getValue?(): T {
        let mod = require(`../${this.url}`);
        return <T>mod[this.objectName];
    }
}