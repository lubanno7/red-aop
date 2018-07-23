/** 反射 */
import { IAnyType, IType } from '../base';

/** proto属性名称 */
const protoPropName = '__proto__';

/**
 * 判断某个类型是否从基类型派生
 * @param childType 子类型
 * @param baseType 基类型
 */
export function subTypeOf(childType: IAnyType, baseType: IAnyType): boolean {
    if (childType === baseType) { return true; }

    if (!childType[protoPropName]) { return false; }

    return subTypeOf(childType[protoPropName], baseType);
}

/**
 * 判断对象是否属于某个类型
 * @param obj 要判断的对象
 * @param type 类型构造函数
 * @returns 如果对象是某个类型，返回ture，否则返回false
 */
export function instanceOf(obj: any, type: IAnyType): boolean {
    if (!obj.__proto__ || !obj.__proto__.constructor) {
        return false;
    }

    if (obj.__proto__.constructor === type) {
        return true;
    }

    return instanceOf(obj.__proto__, type);
}

/**
 * 根据类型创建实例
 * @param type 类型
 * @returns 实例
 */
export function createObject<T>(type: new () => T, initObject: T = undefined): T {
    return createAnyObject(type, initObject);
}

/**
 * 根据类型创建实例
 * @param type 类型
 * @returns 实例
 */
export function createAnyObject<T>(type: new () => T, initObject: any = undefined): T {
    let newObject = new type();
    if (initObject) {
        propertyCopy(newObject, initObject, true);
    }
    return newObject;
}

/** 获取对象类型
 * @param obj 对象
 * @returns 类型
 */
export function getType(obj: Object): IAnyType {
    return <IAnyType>obj.constructor;
}

/**
 * 获取函数名称
 * @param func 函数
 * @return 函数名称
 */
export function getFunctionName(func: Function): string {
    if (func) {
        let strFun = func.toString();
        let className = strFun.substr(0, strFun.indexOf('('));
        className = className.replace('function', '');
        className = className.replace(/(^\s*)|(\s*$)/ig, '');
        return className;
    }

    return undefined;
}
/**
 * 获取构造函数名称
 * @param obj 对象
 * @return 构造函数名称
 */
export function getConstructorName(obj: Object): string {
    return getFunctionName(obj.constructor);
}

/**
 * 属性复制，将源对象的所有属性复制到目标对象
 * @param destObject 目标对象
 * @param srcObject 源对象
 * @param coverDefinedField 覆盖已经有数值的字段
 */
export function propertyCopy(destObject: Object, srcObject: Object, coverDefinedField: boolean = false): void {
    for (let property in srcObject) {
        // 只复制没有设置的属性
        if (coverDefinedField || !destObject[property]) {
            destObject[property] = srcObject[property];
        }
    }
}

/**
 * 指定类型
 * @param originObject 要指定类型的原始对象
 * @param targetType 目标类型
 */
export function assignType(originObject: any, targetType: Function) {
    let newMethod: any = targetType;
    originObject.__proto__ = newMethod.prototype;
    originObject.__proto__.constructor = newMethod;

    // 调用构造方法，并复制数据到原始对象，这种方法相对call来说，会复制装饰器修饰的方法
    let newObj = new newMethod();
    propertyCopy(originObject, newObj);

    // 调用事件
    if (originObject.onAssignedType) {
        originObject.onAssignedType();
    }
}

/**
 * 在原对象上创建透明代理方法
 * @param originObject 原始对象
 * @param methodHandler 代理方法
 */
export function buildTransparentProxyObject(destObject: Object, originObject: IType<any>, methodHandler: (methodName: string, args: any[]) => any) {
    let proxyType = originObject.prototype;
    let funcNameList: string[] = [];

    // 将函数名赋值到数组，进行闭包处理
    for (let func in proxyType) {
        if (proxyType.hasOwnProperty(func)) {
            let prop = proxyType[func];
            if (prop instanceof Function) {
                funcNameList.push(func);
            }
        }
    }

    // 通过函数名数组定义代理的方法
    for (let funcName of funcNameList) {
        destObject[funcName] = (...proxyArgs: any[]): any => {
            return methodHandler(funcName, proxyArgs);
        };
    }
}

/**
 * 创建透明代理对象
 * @param originObject 原始对象
 * @param methodHandler 代理方法
 */
export function createTransparentProxy(originObject: new () => any, methodHandler: (methodName: string, args: any[]) => any): any {
    let proxyObject = {};
    buildTransparentProxyObject(proxyObject, originObject, methodHandler);
    return proxyObject;
}