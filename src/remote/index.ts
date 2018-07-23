import { addonSerialize, fetchAddonProtoType, BaseAddon, addon } from '../aop';
import { newGuid } from '../base';
import { getCurrentPrincipal } from '../security';

/**
 * 请求类型
 */
export type RequestType = 'GET' | 'POST';

export interface IRemoteRequest {
    id?: string;
    serviceName?: string;
    functionName?: string;
    userToken?: string;
    args?: any;
}

/**
 * 远程访问客户端适配器
 */
export interface IRemoteClientAdapter {
    /**
     * 远程调用
     * @param url url地址
     * @param data 数据
     * @param success 成功执行的回调函数
     * @param error 异常执行的回调函数
     */
    remoteCall(
        url: string,
        data: string,
        success?: (result: any) => void,
        error?: (err: Error) => void): void;
}

/**
 * 远程调用
 * @param adapter 远程调用适配器
 * @param requestArgs 请求参数
 * @returns 回调函数
 */
export function remoteCall<T>(adapter: IRemoteClientAdapter, url: string, serviceName: string, funcName: string, requestArgs: any[]): Promise<T> {
    let userToken: string;
    let currentPrincipal = getCurrentPrincipal();
    if (currentPrincipal && currentPrincipal.user) {
        userToken = currentPrincipal.user.tokenString;
    }
    let requestData: IRemoteRequest = {
        id: newGuid(),
        serviceName: serviceName,
        functionName: funcName,
        userToken: userToken,
        args: requestArgs
    };
    let data = addonSerialize(requestData);
    return new Promise<T>((resolve, reject) => {
        adapter.remoteCall(
            url,
            data,
            (response) => {
                let returnValue = response;
                if (returnValue) {
                    // 返回值处理前要获取类型原型
                    fetchAddonProtoType(returnValue);
                }
                if (returnValue) {
                    // 处理返回值
                    resolve(returnValue.d);
                } else {
                    resolve(undefined);
                }
            },
            (error) => {
                reject(error);
            });
    });
}

/**
 * 名称:远程服务系统
 * @description 定义远程服务系统的url,系统名称等
 */
@addon('RemoteServiceSystem', '远程服务系统', '定义远程服务系统的url,系统名称等')
export class RemoteSystem extends BaseAddon {
    /**
     * 远程服务系统
     * @param name 远程服务系统名称
     * @param url 远程服务系统地址
     */
    constructor(public name: string, public url: string) {
        super();
    }
}

/**
 * 名称:远程服务信息
 * @description 用于描述每个远程服务的名称,代理类型等
 */
@addon('RemoteSystem', '远程服务信息', '用于描述每个远程服务的名称,代理类型等')
export class RemoteService extends BaseAddon {
    /**
     * 远程服务信息
     * @param proxyType 代理类型
     * @param system 远程系统
     * @param serviceName 服务名称 
     */
    constructor(public proxyType: any, public system: RemoteSystem, public serviceName: string) {
        super();
    }
}

/**
 * 名称:请求对象
 * @description 用户客户端请求服务端的请求对象
 */
export class RequestObject {

    constructor(/** 请求服务id */
        public serviceName: string,
        /** 请求方法名称 */
        public functionName: string,
        /** 请求参数对象 */
        public args: any[]) {

    }
}