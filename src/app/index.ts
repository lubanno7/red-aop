import { BaseAddon, addon } from '../aop';

export let mainApplication: Application;

/**
 * 应用
 */
@addon('application', '应用设置', '包含各种资源的主应用实体对象')
export class Application extends BaseAddon {

    /**
     * 运行
     */
    run?() {
        mainApplication = this;
    }
}

/**
 * 应用程序路径配置
 * @author pao
 */
export interface IAppPathConfig {
    app?: Application;
}