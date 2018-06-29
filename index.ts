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
    syncLoadJson
} from "./src/base/base";

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
    syncLoadJson
}

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
} from "./src/reflect/reflect";

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
}

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
} from "./src/aop/aop";

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
}

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
    RequestObject,
    ErrorStatus,
    throwError
} from "./src/remote/remote";

export {
    RequestType,
    IRemoteRequest,
    IRemoteClientAdapter,
    remoteCall,
    RemoteSystem,
    RemoteService,
    RequestObject,
    ErrorStatus,
    throwError
}

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
    IDataService
} from "./src/data/data";

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
    IDataService
}

/**
 * 6、导出reactbase模块
 */
import { BaseReactElementControl } from "./src/react/reactBase";

export { BaseReactElementControl }

/**
 * 7、导出security模块
 */
import {
    UserIdentity,
    UserToken,
    ILoginService,
    Principal,
    getCurrentPrincipal,
    setCurrentPrincipal
} from "./src/security/security";

export {
    UserIdentity,
    UserToken,
    ILoginService,
    Principal,
    getCurrentPrincipal,
    setCurrentPrincipal
}