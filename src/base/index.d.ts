/*
 * 版权: Copyright (c) 2018
 * 
 * 文件: base.d.ts
 * 创建日期: Tuesday July 3rd 2018
 * 作者: lubanno7
 * 说明:
 * 1、对应base的类型文件定义
 */
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