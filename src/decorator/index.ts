import { Utils } from "../utils/type";

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export function Controller(prefix?: string): any {
    const fn = function (target: Function, url?: string) {
        url ??= '/' + target.name.toLowerCase();
        Reflect.defineMetadata('prefix', url, target);
    }

    return function (target: Function) {
        return fn(target, prefix);
    }
}

export function Request(url?: string, method: Method = 'GET') {
    return function (target: any, propertyKey: string) {
        const info = Reflect.getMetadata('action', target.constructor, propertyKey) || [];
        url ??= '/' + propertyKey;
        info.push({ url, method });
        Reflect.defineMetadata('action', info, target.constructor, propertyKey);
    }
}

export function get(url?: string) {
    return Request(url, 'GET');
}

export function post(url?: string) {
    return Request(url, 'POST');
}

export function del(url?: string) {
    return Request(url, 'DELETE');
}

export function put(url?: string) {
    return Request(url, 'PUT');
}

type ItemKey = {
    /** 校验的字段 */
    key: string;
    /** 没有字段的错误信息*/
    errMsg?: string;
}
type Keys = string | ItemKey | (string | ItemKey)[];

/**
 * 校验参数为必须只支持get和post请求，get校验query参数，post校验body参数
 * @param keys 要校验的字段
 * @param option 其他设置项
 */
export function required(keys: Keys, { noEmptyArray = false, errMsg, errData, errCode = 400 }: {
    /** 是否将空数组认为无效参数，默认false */
    noEmptyArray?: boolean;
    /** 发生错误时的描述，存在则优先显示 */
    errMsg?: string;
    /** 发生错误时的code 默认400*/
    errCode?: number;
    /** 发生错误时的data 默认不发送字段*/
    errData?: any;
} = {}) {
    return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        const old = descriptor.value;
        if (typeof old !== 'function') return;
        descriptor.value = async function (this: any, ctx: Utils.ctx, next: Utils.next) {
            const { method } = ctx.request;
            if (method !== 'GET' && method !== 'POST') return await old.call(this, ctx, next);
            const noKeys: (string | ItemKey)[] = [];
            const allKeys = keys instanceof Array ? keys : [keys];
            let param: any;
            if (method === 'GET') {
                param = ctx.request.query;
            } else {
                param = ctx.request.body;
            }
            if (!param || typeof param !== 'object') {
                noKeys.push(...allKeys);
            } else {
                for (const item of allKeys) {
                    const key = typeof item === 'object' ? item.key : item;
                    if (param[key] == null) {
                        noKeys.push(item);
                        continue;
                    }
                    if (noEmptyArray && param[key] instanceof Array && param[key].length === 0) {
                        noKeys.push(item);
                        continue;
                    }
                }
            }
            if (noKeys.length) {
                return { code: errCode, data: errData, msg: errMsg ?? setErrMsg(noKeys) };
            }
            return await old.call(this, ctx, next);
        }
    }
}
/** 设置错误信息 */
export function setErrMsg(noKeys: (string | ItemKey)[]) {
    let flag = true;
    for (const item of noKeys) {
        if (typeof item !== 'string') {
            flag = false;
            break;
        }
    }
    if (flag) {
        return `缺少参数：${noKeys.toString()}`;
    }
    return noKeys.map(item => {
        if (typeof item === 'string') {
            return `缺少参数：${item}`;
        }
        return item.errMsg ?? `缺少参数：${item.key}`;
    }).join(',');
}
