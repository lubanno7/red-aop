import { getGlobalValue, setGlobalValue } from '../base/base';

const SecurityStorageName = '__security__';

/**
 * 用户令牌
 */
export class UserToken {
    constructor(public userID?: string, public expireTime?: Date, public roles?: string[]) {

    }
}

/**
 * 用户标识
 */
export class UserIdentity {
    constructor(public userToken?: UserToken, public tokenString?: string) {

    }
}

/**
 * 主角
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
 * @return 当前主角
 */
export function getCurrentPrincipal(): Principal {
    return <Principal>getGlobalValue(SecurityStorageName);
}

/**
 * 设置当前主角
 * @param principal 主角
 */
export function setCurrentPrincipal(principal: Principal) {
    setGlobalValue(SecurityStorageName, principal);
}

export class ILoginService {
    /**
     * 登录
     * @param userName 用户名
     * @param loginType 登陆类型
     * @param loginData 登陆数据（密码、二维码或其他验证信息）
     * @returns token令牌
     */
    login(userName: string, loginType?: string, loginData?: string): string { return null; }
}
