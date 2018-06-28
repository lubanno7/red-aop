/**
 * 字符串自定义方法
 */
declare interface String {
    /** 不区分大小写匹配 */
    compare(str: string): boolean;
    /** 字符串格式化 */
    format(...args: any[]): string;
}
/**
 * 动态加载 link 标签
 * @param url 待加载文件的url
 * @param type 文件类型
 * @param rel 
 */
declare function loadLink(url: string, type: string, rel: string): void;

/**
 * 动态加载 css 文件
 * @param url 待加载css文件的url
 * @param type 
 * @param rel
 */
declare function loadStyle(url: string): void;

/**
 * 动态加载 css 文件集
 * @param urls css文件集url
 */
declare function loadStyles(urls: string[]): void;

declare interface Error {
    status?: number;
}