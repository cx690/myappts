import type koa from 'koa';
export namespace Utils {
    export type ctx = koa.ParameterizedContext<koa.DefaultState, koa.DefaultContext, any>;
    export type next = koa.Next;
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
}
