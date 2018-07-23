/// <reference path='index.d.ts' />
import { EventEmitter } from "events";
import { isError } from "util";

/** 类型 */
export interface IType<T> {
    new(): T;
}

/** 任意类型 */
export interface IAnyType extends IType<any> {

}

/**
 * 合并Error类型定义
 */
declare interface Error {
    /**
     * 错误状态吗
     */
    status?: number;
}

/**
 * 合并String类型定义
 */
declare interface String {
    /** 
     * 格式化
     * @description 根据{0-9}里面数字进行匹配
     */
    format(...args: any[]): string;
    /**
     * 区分大小写匹配
     * @param str 匹配字符串
     */
    compare(str: string): boolean;
}

/**
 * 字符串格式化
 * @param str 字符串
 * @param args 参数
 */
if (!String.prototype.format) {
    String.prototype.format = function (...args: any[]) {
        return this.replace(/\{([1-9]\d*|0)\}/g, function (_, i: number) {
            return args[i];
        });
    };
}

// 为string增加startWith方法
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        return this.substr(position || 0, searchString.length) === searchString;
    };
}

// 为string增加endsWith方法
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (searchString, position) {
        return this.substr(this.length - position || 0 - searchString.length, searchString.length) === searchString;
    };
}

// 为string增加 compare方法,不区分大小写匹配
if (!String.prototype.compare) {
    String.prototype.compare = function (str: string) {
        if (!this || !str) {
            return false;
        }
        // 不区分大小写
        if (this.toLocaleUpperCase() === str.toLocaleUpperCase()) {
            return true; // 正确
        } else {
            return false; // 错误
        }
    };
}

export { Error, String };

/**
 * 新建Guid
 */
export function newGuid(): string {
    let guid = '{';
    for (let i = 1; i <= 32; i++) {
        let n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        if ((i === 8) || (i === 12) || (i === 16) || (i === 20)) { guid += '-'; }
    }
    return guid + '}';
}

/**
 * 获取当前日期字符串（精确到日）
 */
export function getCurrentDateString(): string {
    let today = new Date();
    let timeString = today.getFullYear() + '/' + today.getMonth() + '/' + today.getDay();
    return timeString;
}

/**
 * 获取当前时间字符串（精确到毫秒）
 */
export function getCurrentTimeString(): string {
    let today = new Date();
    return `${today.getFullYear()}/${today.getMonth()}/${today.getDay()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}.${today.getMilliseconds()}`;
}

/** 判断数组 */
export function isArray(arr: any) {
    return Object.prototype.toString.call(arr) === '[object Array]';
}

/**
 * 动态加载 link 标签
 * @param url 待加载文件的url
 * @param type 文件类型
 * @param rel 
 */
export function loadLink(url: string, type: string, rel: string) {
    var link = document.createElement("link");
    link.type = type;
    link.rel = rel;
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
}
/**
 * 动态加载 css 文件
 * @param url 待加载css文件的url
 * @param type 
 * @param rel
 */
export function loadStyle(url: string) {
    loadLink(url, "text/css", "stylesheet");
}

/**
 * 动态加载 css 文件集
 * @param urls css文件集url
 */
export function loadStyles(urls: string[]) {
    for (let index = 0, len = urls.length;
        index < len; index++) {
        let url = urls[index];
        loadStyle(url);
    }
}

/** 合并JSON对象 */
export function extend(des: any, src: any, override: boolean = true) {
    if (src instanceof Array) {
        for (let key = 0, len = src.length; key < len; key++) {
            extend(des, src[key], override);
        }
    }
    for (let key in src) {
        if (override || !(key in des)) {
            des[key] = src[key];
        }
    }

    return des;
}

/**
 * 记录日志
 * @param source 日志源
 * @param message 消息
 * @param messageType 消息类型
 */
export function log(
    source: string,
    message: string | Error | Event,
    messageType: 'error' | 'warning' | 'information' = 'information') {

    // 如果关闭了记录源则不记录
    let logOff = global['logOff'];

    // 如果关闭了记录源则不记录
    if (logOff && (logOff['all'] || logOff[source])) {
        return;
    }

    let date = new Date(Date.now());
    let dataString = `${date.toLocaleString()}`;
    let messageString = `[${dataString} (${source}) ${message}]`;

    if (messageType === 'error' || isError(message)) {
        console.error(messageString);
    } else if (messageType === 'warning') {
        console.warn(messageString);
    } else {
        console.log(messageString);
    }
}

/**
 * 设置全局值
 * @param globalStore 全局存储名称
 * @param name 值名称
 * @param value 值
 */
export function setGlobalValue(globalStore: string, value: any): void {
    global[globalStore] = value;
}

/**
 * 获取全局值
 * @param globalStore 全局存储名称
 * @param name 值名称
 */
export function getGlobalValue(globalStore: string): any {
    return global[globalStore];
}

/**
 * 是否浏览器
 * @returns 如果当前是在客户端浏览器中执行，返回true
 */
export function isBrowser() {
    return !global['nodejs'];
}

export type EventFunction<T> = (sender: any, eventArgs: T) => void;

/**
 * 名称:事件监听器
 * @description 前端事件机制实现
 */
export class EventHandler extends EventEmitter {
    /**
     * 添加事件
     */
    addEventHandler?<T>(event: string, eventHandler: EventFunction<T>): this {
        this.addListener(event, eventHandler);
        return this;
    }
    /**
     * 移除事件
     */
    removeEventHandler?<T>(event: string, eventHandler: EventFunction<T>): this {
        this.removeListener(event, eventHandler);
        return this;
    }
    /**
     * 清空事件
     */
    clearEventHandler?(event: string): this {
        this.removeAllListeners(event);
        return this;
    }
    /**
     * 触发事件
     */
    fire?(event: string, sender: any, eventArgs: any) {
        this.emit(event, sender, eventArgs);
    }
}

/**
 * 同步加载Json
 * @param url JsonUrl
 */
export function syncLoadJson(url: string) {
    let jsonObject = {};
    $.ajax({
        url: url,
        dataType: 'json',
        async: false,
        success: function (scr) {
            jsonObject = scr;
        },
        error: function () {
            log('base', `找不到指定的文件:${url}`);
        }
    });
    return jsonObject;
}

/** 错误码 */
export enum ErrorStatus {
    /** 文件不存在 */
    ERROR_NOT_FOUND = 404,
    /** 方法不存在 */
    ERROR_FUNCTION_NOT_FOUND = 405,
    /** 服务异常 */
    ERROR_SERVICE = 500,
    /** 服务不存在 */
    ERROR_SERVICE_NOT_FOUND = 505,
    /** 没有权限 */
    ERROR_NOT_AUTHORITY = 900,
    /** 用户没有登录 */
    ERROR_USER_NOT_LOGIN = 901,
    /** 用户已经登录 */
    ERROR_USER_HAVE_LOGIN = 902
}

/**
 * 创建错误
 * @param status 状态码
 * @param msg 错误信息
 */
export function throwError(status: number, msg: string) {
    let error = new Error(msg);
    error.status = status;
    throw error;
}