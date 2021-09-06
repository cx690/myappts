import type { ClassFunction } from "../utils/type.js";

/**
 * 注册namespace 
 * @param nsp io切出的命名空间，默认为/+class名称的小写
 */
export function Namespace(nsp?: string | RegExp | ParentNspNameMatchFn): any {
    return function (target: ClassFunction) {
        nsp ??= '/' + target.name.toLowerCase();
        Reflect.defineMetadata('isnsp', nsp, target);
    }
}

/**
 * 注册监听方法 相当于socket.on(ev,callback)
 * @param ev 方法名称默认成员函数名称
 */
export function on(ev?: string) {
    return function (target: any, propertyKey: string) {
        ev ??= propertyKey;
        Reflect.defineMetadata('action', ev, target.constructor, propertyKey);
    }
}

declare type ParentNspNameMatchFn = (name: string, auth: {
    [key: string]: any;
}, fn: (err: Error | null, success: boolean) => void) => void;