import * as React from 'react';
import { SFC, ComponentClass } from 'react';
import { addon, BaseAddon } from '../aop';
import { connect } from "react-redux";
import { getGlobalValue, setGlobalValue, log } from '../base';

export type ReactElementType = SFC<BaseReactElementControl> | ComponentClass<BaseReactElementControl>;

const globalStateStoreName = "__global_StateStore__";

/**
 * 设置全局State
 * @param name 名称
 * @param state 待设置state
 */
export function setGlobalStateStore(name: string, state: any) {
    let globalStateStore = getGlobalValue(globalStateStoreName);
    if (!globalStateStore) {
        globalStateStore = {};
    }
    globalStateStore[name] = state;
    setGlobalValue(globalStateStoreName, globalStateStore);
}

/**
 * 获取state
 * @param name 带获取state名称
 */
export function getGlobalStateStore<T>(name: string): T {
    let globalStateStore = getGlobalValue(globalStateStoreName);
    if (!globalStateStore) return undefined;
    return globalStateStore[name] as T;
}

/**
 * 获取全局State
 */
export function getAllGlobalStateStore<T>() {
    let globalStateStore = getGlobalValue(globalStateStoreName);
    return globalStateStore as T;
}

/**
 * React元素控制器
 * @param element 元素函数/类
 * @param mapStateToProps 映射的状态属性
 * @param mapDispatchToProps 映射的行为属性
 */
export function reactControl(element: ReactElementType, mapStateToProps?: any, mapDispatchToProps?: any) {
    return function (target: any) {
        target.prototype.$reactElement = connect(mapStateToProps, mapDispatchToProps)(element);
    };
}

/**
 * 全局Reducer装饰器
 * @param key 待设置key
 * @param reducer 待设置的reducer
 * @description key 属性对应需要映射的状态的key
 * @example const mapStateToProps = (state:any)=> ({key:state[key]})
 */
export function rootReducer(key: string, reducer: any) {
    return function (_: any) {
        // 添加reducer到全局
        log('redux', `Reducer注册成功: ${key}`);
        setGlobalStateStore(key, reducer);
    };
}

/**
 * 元素控制器基类
 */
@addon('BaseReactElementControl', '元素控制器基类', '所有React元素控制器的基类')
export class BaseReactElementControl extends BaseAddon {
    /**
     * ReactFunc
     */
    $reactElement?: ReactElementType;
    /**
     * 当前控制器
     * @description 
     * 1. 在React的Props中只能存在方法类型的属性
     * 2. 但是new实例的时候，方法类型的属性必须赋值
     * 3. 为了解决冲突，在Props中时候控制器的方法时，可以用该属性获取控制器的方法
     */
    $self?: BaseReactElementControl;
    /**
     * 子控件列表
     */
    children?: ReactElementType[];

    createElement?(): any {
        if (!this.$reactElement) {
            return undefined;
        }
        this.$self = this;
        return React.createElement(this.$reactElement, this);
    }
}