import * as Koa from "koa";
export type Ctx = Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext, any>;
export type Next = Koa.Next;
export type Result<T = any> = Promise<{
    code: number;
    data?: T;
    msg?: string;
    [key: string]: any;
}>;

export type Fiels<ID extends (string | number) = number> = {
    /** 主要索引可以为string的uuid */
    id?: ID,
    /** 创建时间 */
    createdAt?: number;
    /** 更新时间 */
    updatedAt?: number;
    /** 更新次数 */
    version?: number;
}

export type Dict<T = any> = {
    [key: string]: T;
}

export interface ClassFunction {
    new(...args: any[]): any;
    [key: string]: any;
}