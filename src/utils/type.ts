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
}