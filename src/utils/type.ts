import type Koa from "koa";
export type Ctx = Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext, any>;
export type Next = Koa.Next;
export type Result<T = any> = Promise<{
    code: number;
    data?: T;
    msg?: string;
    [key: string]: any;
}>;

export interface ClassFunction {
    new(...args: any[]): any;
    [key: string]: any;
}