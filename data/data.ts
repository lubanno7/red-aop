import { BaseAddon, addon } from '../aop/aop';
import { ReturnType } from '../remote/remote';

/**
 * 数据状态
 */
export enum DataState {
    Detached,
    Unchanged,
    Added,
    Modified,
    Deleted
}

/**
 * 数据表
 */
export interface IDataList {
    /** 获取数据名 */
    getDataName?(): string;
    /** 
     * 获取对象数组
     * REMARK:缓存数据 
     */
    getDataList?(): any[];
}
/**
 * 数据接收器接口
 */
export interface IDataReceiver extends IDataList {
    /** 
     * 数据到达
     * REMARK:增量数据
     */
    onDataReceived: (data?: any[]) => void;
}

/** 
 * 数据查询器接口 
 */
export interface IDataQueryer extends IDataReceiver {
    /**
     * 是否在查询中
     * @returns 如果当前正在查询，返回true；否则，返回false
     */
    getIsInQuery(): boolean;
    /**
     * 查询
     * @param parameters 参数值
     * @returns 查询结果
     */
    query(parameters: any[string]): Promise<void>;
}

/**
 * 数据实体
 */
@addon('DataEntity', '数据实体', '表示关系式数据库的一行或一个实体')
export class DataEntity extends BaseAddon {
    /** 数据状态 */
    dataState: DataState = DataState.Detached;
    /** 原始值 */
    private originValues: any[string] = {};
    /** 当前值 */
    private currentValues: any[string] = {};
    constructor(row?: {}) {
        super();
        this.originValues = row;
        this.currentValues = row;
    }
    /** 获取值 */
    getFieldValue(key: string, origionValue: boolean = false) {
        if (origionValue) { return this.originValues[key]; }
        return this.currentValues[key];
    }

    /** 设置字段值 */
    setFieldValue(key: string, value: any) {
        if (this.dataState === DataState.Deleted) {
            throw new Error('已经删除的对象不能设置值');
        }

        this.currentValues[key] = value;

        this.setModified();
    }

    /** 设置状态为新增 */
    setAdded() {
        this.dataState = DataState.Added;
    }

    /** 设置删除标记 */
    setDeleted() {
        if (this.dataState === DataState.Added
            || this.dataState === DataState.Modified
            || this.dataState === DataState.Unchanged) {
            this.dataState = DataState.Deleted;
        }
    }

    /** 设置修改标记 */
    setModified() {
        if (this.dataState === DataState.Unchanged) {
            this.dataState = DataState.Modified;
        }
    }

    /** 接受修改 */
    acceptChanges() {
        this.originValues = [];
        for (let key in this.currentValues) {
            if (this.currentValues.hasOwnProperty(key)) {
                this.originValues[key] = this.currentValues[key];
            }
        }

        if (this.dataState === DataState.Added
            || this.dataState === DataState.Modified) {
            this.dataState = DataState.Unchanged;
        } else if (this.dataState === DataState.Deleted) {
            this.dataState = DataState.Detached;
        }
    }

    /** 取消修改 */
    rejectChanges() {
        this.currentValues = [];
        for (let key in this.originValues) {
            if (this.originValues.hasOwnProperty(key)) {
                this.currentValues[key] = this.originValues[key];
            }
        }

        if (this.dataState === DataState.Added
            || this.dataState === DataState.Modified) {
            this.dataState = DataState.Unchanged;
        } else if (this.dataState === DataState.Deleted) {
            this.dataState = DataState.Unchanged;
        }
    }

    /** 转换为对象 */
    toObject(): Object {
        let newObj = {};
        for (let key in this.originValues) {
            if (this.originValues.hasOwnProperty(key)) {
                newObj[key] = this.originValues[key];
            }
        }

        for (let key in this.currentValues) {
            if (this.currentValues.hasOwnProperty(key)) {
                let newValue = this.currentValues[key];
                newObj[key] = newValue;
            }
        }
        return newObj;
    }
}

/**
 * 数据表
 */
@addon('DataTable', '数据表', '关系式数据库对应的表')
export class DataTable extends BaseAddon implements IDataList {
    /** 主键列 */
    primaryKeyFields: string[] = [];
    /** 数据结构 */
    tableSchema: string[] = [];
    /** 数据行 */
    private rows: DataEntity[] = [];

    /** 数据表 */
    constructor(public tableName?: string) {
        super();
    }
    /**
     * 获取表名
     * @returns 表名
     */
    getDataName(): string {
        return this.tableName;
    }
    /** 数据行 */
    get DataRows() {
        return this.rows;
    }
    /**
     * 根据键值查找行
     * @param keyValues 键值对
     */
    findRowByKey(keyValues: any[string]): DataEntity {
        return this.rows.find((row) => {
            let findKey = true;
            // 检索主键列
            for (let field of this.primaryKeyFields) {
                if (row.getFieldValue(field) !== keyValues[field]) {
                    findKey = false;
                    break;
                }
            }
            return findKey;
        });
    }
    /**
     * 获取行的主键值
     * @param row 数据行
     */
    getRowKeyValues(row: DataEntity): any[string] {
        let keyValues: any[string] = [];
        this.primaryKeyFields.forEach((field) => {
            keyValues[field] = row.getFieldValue(field);
        });
        return keyValues;
    }
    /**
     * 增加行
     * @param row 数据行
     */
    addRow(row: DataEntity) {
        // 过滤相同行逻辑
        let keyValues = this.getRowKeyValues(row);
        let oldRow = this.findRowByKey(keyValues);
        if (oldRow) {
            // 相同行不添加
            return;
        }

        row.setAdded();
        this.rows.push(row);
    }
    /**
     * 接受修改
     */
    acceptChanges() {
        let newRows: DataEntity[] = [];
        this.rows.forEach((oldRow) => {
            oldRow.acceptChanges();

            if (oldRow.dataState === DataState.Unchanged) {
                newRows.push(oldRow);
            }
        });
        this.rows = newRows;
    }
    /** 
     * 取消修改 
     */
    rejectChanges() {
        let newRows: DataEntity[] = [];
        for (let oldRow of this.rows) {
            oldRow.rejectChanges();

            if (oldRow.dataState === DataState.Unchanged) {
                newRows.push(oldRow);
            }
        }
        this.rows = newRows;
    }
    /**
     * 转换为对象数组
     * @returns 对象数组
     */
    getDataList(): object[] {
        let objects = [];
        for (let row of this.rows) {
            objects.push(row.toObject());
        }
        return objects;
    }
}

/**
 * 名称:数据集
 * @description 多个数据表的合集
 * @author huyl
 */
@addon('DataSet', '数据集', '多个数据表的合集')
export class DataSet extends BaseAddon {
    /** 数据表集 */
    tables: DataTable[string] = {};

    /** 数据集 */
    constructor(public dataSetName: string) {
        super();
    }
    /** 设置数据表 */
    setTable(table: DataTable) {
        if (table) { this.tables[table.getDataName()] = table; }
        return this;
    }
    /** 删除表 */
    deleteTable(tableName: string) {
        if (this.tables[tableName]) { delete this.tables[tableName]; }
        return this;
    }
    /** 清空表 */
    clearTable() {
        this.tables = {};
    }
}

/**
 * JSON 数据转 DataTable
 * @param {any} originData 原JSON数据
 * @param {string} tableName 表名称
 * @param {string[]} primaryKeyFields 主键列
 */
export function jsonConvertDataTable(originData: any, tableName?: string, primaryKeyFields?: string[]): DataTable {
    if (!originData) { return undefined; }
    try {
        // 闭包处理
        let data = JSON.parse(JSON.stringify(originData));
        // 不存在行数据
        // 表名称,默认table
        let name = tableName || 'table';
        let table = new DataTable(name);
        if (!data.length || data.length === 0) {
            return table;
        }
        let first = data[0];
        // 添加主键
        if (primaryKeyFields && primaryKeyFields.length > 0) {
            table.primaryKeyFields = primaryKeyFields;
        }
        // 添加数据结构
        for (let key in first) {
            if (first.hasOwnProperty(key)) {
                table.tableSchema.push(key);
            }
        }
        // 添加数据
        for (let index = 0, len = data.length;
            index < len; index++) {
            let element = data[index];
            let row = new DataEntity();
            for (let key in element) {
                if (element.hasOwnProperty(key)) {
                    let value = element[key];
                    row.setFieldValue(key, value);
                }
            }
            table.addRow(row);
        }
        table.acceptChanges();
        return table;
    } catch (error) {
        throw new Error(`数据转换表对象错误,${error.message || error}`);
    }
}

/**
 * 对象列表
 */
export class ObjectListTable extends BaseAddon implements IDataList {
    constructor(public tableName?: string, public objects?: any) {
        super();
    }
    /**
     * 获取表名
     * @returns 表名
     */
    getDataName(): string {
        return this.tableName;
    }

    getDataList(): any {
        return this.objects;
    }
}

/** 数据事件 */
export enum DataEvent {
    /** 数据到达 */
    DataReceive = "DataReceive"
}

@addon('DataView', '数据视图', '对数据表进行二次过滤的试图')
export class DataView extends BaseAddon implements IDataList {
    /** 过滤时重新查询 */
    requeryOnFilter?: boolean = false;
    /**
     * 构造函数
     * @param dataTable 数据表
     * @param filter 过滤器
     */
    constructor(public viewName?: string, public filter?: string, public dataReceiver?: IDataReceiver) {
        super();
        if (dataReceiver) {
            this.init();
        }
    }
    /** 数据视图初始化 */
    init?() {
        if (this.dataReceiver) {
            (this.dataReceiver as BaseAddon).addEventHandler(
                DataEvent.DataReceive,
                (_: any, data: any[]) => {
                    let newObjectArray = [];
                    for (let obj of data) {
                        if (this.checkData(obj)) {
                            newObjectArray.push(obj);
                        }
                    }
                    this.onDataReceived(newObjectArray);
                });
        }
    }
    /**
     * 数据到达
     */
    onDataReceived?= (data?: any[]) => {
        this.fire(DataEvent.DataReceive, this, data);
    }
    /**
     * 获取数据列表
     * @returns 符合条件的数据列表
     */
    getDataList?() {
        let fullList = this.dataReceiver.getDataList();
        if (!fullList) {
            return [];
        }

        let newObjectArray: any[] = [];
        fullList.forEach((obj) => {
            if (this.checkData(obj)) {
                newObjectArray.push(obj);
            }
        });
        return newObjectArray;
    }

    /**
     * 获取表名
     * @returns 表名
     */
    getDataName?(): string {
        return this.viewName;
    }

    /**
     * 检查数据
     * @param inputData 输入数据
     * @return 数据符合条件的返回True，否则返回False
     */
    private checkData?(inputData: any): boolean {
        // 无过滤条件返回true
        if (!this.filter) { return true; }
        let functionString = `function(data) { return ${this.filter}; }`;
        let func = eval(functionString);
        return func(inputData);
    }
}

/**
 * 数据服务接口
 * @author huyl
 * @description 用于访问服务端数据的服务接口
 */
export class IDataService {
    /**
     * 查询
     * @param command 命令
     * @param params 查询参数
     */
    query(command: string, params?: {}): ReturnType<any> { return undefined; }
    /**
     * 更新
     * @param command 命令
     * @param dataList 待更新数据
     * TODO: 暂时未实现 
     */
    update?(command: string, dataList: DataEntity[]): ReturnType<any> { return undefined; }
    /**
     * 插入
     * @param {string} command 命令ID
     * @param {Object[]} objects 插入对象集合
     * @returns {Promise<any>} 返回
     */
    insert?(command: string, objects: Object[]): ReturnType<any>;
    /**
     * 获取数量
     * @param {string} command 命令ID
     * @param {{}} paramValues 参数
     */
    count?(command: string, paramValues: {}): ReturnType<number>;
}