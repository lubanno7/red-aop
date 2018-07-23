import * as React from 'react';
import { SFC, ComponentClass } from 'react';
import { addon, BaseAddon } from '../aop';

export type ReactElementType = string | SFC<BaseReactElementControl> | ComponentClass<BaseReactElementControl>;
/**
 * React元素控制器
 * @param element 元素函数/类
 */
export function reactControl(element: ReactElementType) {
    return function (target: any) {
        target.prototype.$reactElement = element;
    };
}

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