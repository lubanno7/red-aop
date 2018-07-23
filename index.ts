/*
 * 1、导出base模块内容
 */
import {
    IType,
    IAnyType,
    newGuid,
    getCurrentDateString,
    getCurrentTimeString,
    isArray,
    log,
    setGlobalValue,
    getGlobalValue,
    isBrowser,
    EventFunction,
    EventHandler,
    extend,
    loadLink,
    loadStyle,
    loadStyles,
    ErrorStatus,
    throwError,
    syncLoadJson,
    Error,
    String,
    newError
} from "./src/base";

export {
    IType,
    IAnyType,
    newGuid,
    getCurrentDateString,
    getCurrentTimeString,
    isArray,
    log,
    setGlobalValue,
    getGlobalValue,
    isBrowser,
    EventFunction,
    EventHandler,
    extend,
    loadLink,
    loadStyle,
    loadStyles,
    ErrorStatus,
    throwError,
    syncLoadJson,
    Error,
    String,
    newError
};

/**
 * 2、导出reflect模块内容
 */
import {
    subTypeOf,
    instanceOf,
    createObject,
    createAnyObject,
    getType,
    getFunctionName,
    getConstructorName,
    propertyCopy,
    assignType,
    buildTransparentProxyObject,
    createTransparentProxy
} from "./src/reflect";

export {
    subTypeOf,
    instanceOf,
    createObject,
    createAnyObject,
    getType,
    getFunctionName,
    getConstructorName,
    propertyCopy,
    assignType,
    buildTransparentProxyObject,
    createTransparentProxy
};

/**
 * 3、导出aop模块
 */
import {
    getGlobalAddon,
    setGlobalAddon,
    addon,
    BaseAddon,
    IFactory,
    Ref,
    getAddonTypeName,
    getAddonTypeByName,
    getAddonTypeNameFromObject,
    isFactory,
    getObject,
    findAddonByID,
    fetchAddonProtoType,
    setAddonTypeInfo,
    addonSerialize,
    addonDeserialize,
    addonDeserializeToType,
    ProxyFactory,
    ObjectFactory,
    JsonFactory,
    AddonFactory,
    LazyFactory
} from "./src/aop";

export {
    getGlobalAddon,
    setGlobalAddon,
    addon,
    BaseAddon,
    IFactory,
    Ref,
    getAddonTypeName,
    getAddonTypeByName,
    getAddonTypeNameFromObject,
    isFactory,
    getObject,
    findAddonByID,
    fetchAddonProtoType,
    setAddonTypeInfo,
    addonSerialize,
    addonDeserialize,
    addonDeserializeToType,
    ProxyFactory,
    ObjectFactory,
    JsonFactory,
    AddonFactory,
    LazyFactory
};

/**
 * 4、导出remote模块内容
 */
import {
    RequestType,
    IRemoteRequest,
    IRemoteClientAdapter,
    remoteCall,
    RemoteSystem,
    RemoteService,
    RequestObject
} from "./src/remote";

export {
    RequestType,
    IRemoteRequest,
    IRemoteClientAdapter,
    remoteCall,
    RemoteSystem,
    RemoteService,
    RequestObject
};

/**
 * 5、导出data模块
 */
import {
    DataState,
    IDataList,
    IDataReceiver,
    IDataQueryer,
    DataEntity,
    DataTable,
    DataSet,
    jsonConvertDataTable,
    ObjectListTable,
    DataView,
    DataEvent,
    IDataService
} from "./src/data";

export {
    DataState,
    IDataList,
    IDataReceiver,
    IDataQueryer,
    DataEntity,
    DataTable,
    DataSet,
    jsonConvertDataTable,
    ObjectListTable,
    DataView,
    DataEvent,
    IDataService
};

/**
 * 6、导出reactbase模块
 */
import {
    reactControl,
    BaseReactElementControl
} from "./src/reactBase";

export { reactControl, BaseReactElementControl };

/**
 * 7、导出security模块
 */
import {
    UserIdentity,
    UserToken,
    ILoginService,
    Principal,
    getCurrentPrincipal,
    setCurrentPrincipal,
    LoginType
} from "./src/security";

export {
    UserIdentity,
    UserToken,
    ILoginService,
    Principal,
    getCurrentPrincipal,
    setCurrentPrincipal,
    LoginType
};

/**
 * 8、导出APP模块
 */
import { mainApplication, Application, IAppPathConfig } from "./src/app";

export { mainApplication, Application, IAppPathConfig };