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

/** 
 * 错误码
 */
export enum ErrorStatus {
    /** 文件不存在 */
    ERROR_NOT_FOUND = 404,
    /** 方法不存在 */
    ERROR_FUNCTION_NOT_FOUND = 405,
    /** 服务异常 */
    ERROR_SERVICE = 500,
    /** 服务不存在 */
    ERROR_SERVICE_NOT_FOUND = 505,
    /** 系统异常 */
    ERROR_SYSTEM = 555,
    /** 没有权限 */
    ERROR_NOT_AUTHORITY = 900,
    /** 用户没有登录 */
    ERROR_USER_NOT_LOGIN = 901,
    /** 用户已经登录 */
    ERROR_USER_HAVE_LOGIN = 902
}

/**
 * 抛出错误
 * @param status 状态码
 * @param msg 错误信息
 */
export function throwError(status: number, msg: string) {
    throw newError(status, msg);
}

/**
 * 创建错误
 * @param status 状态码
 * @param msg 错误信息
 */
export function newError(status: number, msg: string): Error {
    let error = new Error(msg);
    error.status = status;
    return error;
}

/**
 * 自适应
 * @param win Window
 * @param lib jQuery
 */
export function adaption(win: Window, lib: any) {
    // 摘自淘宝移动端
    let doc = win.document;
    let docEl = doc.documentElement;
    let metaEl = doc.querySelector('meta[name="viewport"]');
    let flexibleEl = doc.querySelector('meta[name="flexible"]');
    let dpr = 0;
    let scale = 0;
    let tid: NodeJS.Timer;
    let flexible = lib.flexible || (lib.flexible = {});
    let designPixel = 750;

    if (metaEl) {
        let match = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
        if (match) {
            scale = parseFloat(match[1]);
            dpr = parseInt(`${1 / scale}`, null);
        }
    } else if (flexibleEl) {
        let content = flexibleEl.getAttribute('content');
        if (content) {
            let initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
            let maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
            if (initialDpr) {
                dpr = parseFloat(initialDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));
            }
            if (maximumDpr) {
                dpr = parseFloat(maximumDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));
            }
        }
    }
    if (!dpr && !scale) {
        // let isAndroid = win.navigator.appVersion.match(/android/gi);
        let isIPhone = win.navigator.appVersion.match(/iphone/gi);
        let devicePixelRatio = win.devicePixelRatio;
        if (isIPhone) {
            if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
                dpr = 3;
            } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)) {
                dpr = 2;
            } else {
                dpr = 1;
            }
        } else {
            dpr = 1;
        }
        scale = 1 / dpr;
    }
    docEl.setAttribute('data-dpr', `${dpr}`);
    if (!metaEl) {
        metaEl = doc.createElement('meta');
        metaEl.setAttribute('name', 'viewport');
        metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
        if (docEl.firstElementChild) {
            docEl.firstElementChild.appendChild(metaEl);
        } else {
            let wrap = doc.createElement('div');
            wrap.appendChild(metaEl);
            doc.write(wrap.innerHTML);
        }
    }

    function refreshRem() {
        let width = docEl.getBoundingClientRect().width;
        if (width / dpr > designPixel) {    // 如果分辨率不是1，那么获取的物理宽度应该乘以分辨率，才是最终可用的width
            width = width * dpr;
        }
        let rem = width / (designPixel / 100); // 计算最终还原到设计图上的比例，从而设置到文档上
        docEl.style.fontSize = rem + 'px';
        flexible.rem = win["rem"] = rem;
    }

    win.addEventListener(
        'resize',
        function () {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        },
        false);
    win.addEventListener(
        'pageshow',
        function (e) {
            if (e.persisted) {
                clearTimeout(tid);
                tid = setTimeout(refreshRem, 300);
            }
        },
        false);

    if (doc.readyState === 'complete') {
        doc.body.style.fontSize = 16 * dpr + 'px';
    } else {
        doc.addEventListener(
            'DOMContentLoaded',
            function (e) {
                doc.body.style.fontSize = 16 * dpr + 'px';
            },
            false);
    }
    refreshRem();

    flexible.dpr = win["dpr"] = dpr;
    flexible.refreshRem = refreshRem;
    flexible.rem2px = function (d: string) {
        let val: any = parseFloat(d) * this.rem;
        if (typeof d === 'string' && d.match(/rem$/)) {
            val += 'px';
        }
        return val;
    };
    flexible.px2rem = function (d: string) {
        let val: any = parseFloat(d) / this.rem;
        if (typeof d === 'string' && d.match(/px$/)) {
            val += 'rem';
        }
        return val;
    };
}