import { getGlobalValue, setGlobalValue } from "../base";

const SecurityStorageName = '__security__';

/**
 * 用户令牌
 * @author pao
 */
export class UserToken {
    constructor(public userID?: string, public expireTime?: Date, public roles?: string[]) {

    }
}

/**
 * 用户标识
 * @author pao
 */
export class UserIdentity {
    constructor(public userToken?: UserToken, public tokenString?: string) {

    }
}

/**
 * 主角
 * @author pao
 */
export class Principal {
    constructor(public user?: UserIdentity, public roles?: string[]) {

    }

    /**
     * 判断当前用户是否属于角色
     * @param role 角色
     */
    isInRole(role: string): boolean {
        return true;
    }
}

/**
 * 获取当前主角
 * @author pao
 * @returns 当前主角
 */
export function getCurrentPrincipal(): Principal {
    return <Principal>getGlobalValue(SecurityStorageName);
}

/**
 * 设置当前主角
 * @author pao
 * @param principal 主角
 */
export function setCurrentPrincipal(principal: Principal) {
    setGlobalValue(SecurityStorageName, principal);
}

/** 登陆类型 */
export enum LoginType {
    /** 账户和密码 */
    AccountPasswork,
    /** 邮箱和密码 */
    EmailPasswork,
    /** 手机号码和密码 */
    MobilePasswork,
    /** 手机号码和验证码 */
    MobileAuth,
    /** QQ */
    QQ,
    /** 微信 */
    WebChat,
    /** 微博 */
    Weibo,
    /** 其它第三方 */
    Other
}

/**
 * 登陆服务接口
 * @author pao
 */
export class ILoginService {
    /**
     * 登陆
     * @param userName 用户名
     * @param loginType 登陆类型
     * @param loginData 登陆数据（密码、二维码或其他验证信息）
     * @returns token令牌
     */
    login(userName: string, loginType?: LoginType, loginData?: string): Promise<string> { return null; }
    /** 登出 */
    logout?(): Promise<boolean> { return null; }
    /** 是否登录 */
    isLogin?(): Promise<boolean> { return null; }
}
