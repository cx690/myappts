import fs from 'fs';
import path from 'path';
import KoaRouter from 'koa-router';
import { Method } from './decorator/index.js';
import { fileURLToPath } from 'url';
import { Utils } from './utils/type.js';
import { logger } from './config/logger.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const router = new KoaRouter();
async function getPath() {
    const urls: string[] = [];
    const files = await fs.readdirSync(path.resolve(__dirname, './controllers'));
    for (const name of files) {
        urls.push('./controllers/' + name);
    }
    return urls;
}

async function regist() {
    const urls = await getPath();
    const allClass: ClassFunction[] = [];
    (await Promise.all([...findClass(urls)])).map(v => {
        for (const key in v) {
            if (Reflect.getMetadata('prefix', v[key]) != undefined) {
                allClass.push(v[key]);
            }
        }
    });
    for (const item of allClass) {
        const prefix = Reflect.getMetadata('prefix', item);
        const instance: any = new item();
        for (const propertyKey of Object.getOwnPropertyNames(item.prototype)) {
            if (propertyKey === 'constructor') continue;
            const list: Info[] = Reflect.getMetadata('action', item, propertyKey);
            if (list && list instanceof Array) {
                for (const item of list) {
                    const { url, method } = item;
                    if (typeof instance[propertyKey] !== 'function') continue;
                    const fn = async (ctx: Utils.ctx, next: Utils.next) => {
                        const requestUrl = prefix + url;
                        return await instance[propertyKey](ctx, next).then((res: any) => {
                            if (typeof res === 'object' && res != null && !Reflect.has(res, 'code')) {
                                ctx.response.body = { code: 200, data: res, msg: 'ok' }
                            } else {
                                ctx.response.body = res;
                            }
                            const data = ctx.response.body?.data;
                            const l = data instanceof Array ? data.length : 0;
                            logger.info(`${requestUrl} 返回:${l ? `（数据数量${l}条）` : ''} ${JSON.stringify(ctx.response.body, dataToStr)}`);
                        }).catch((err: any) => {
                            console.log(err);
                            if (typeof err !== 'object') {
                                logger.error(err);
                                ctx.response.body = { code: 500, msg: err ?? '服务器繁忙，请稍后再试！' };
                                ctx.response.status = 500;
                            } else {
                                err = JSON.stringify(err);
                                logger.error(err);
                                ctx.response.body = { code: 500, msg: err };
                                ctx.response.status = 500;
                            }
                        });//保证内部this指针正常
                    }
                    switch (method) {
                        case 'GET':
                            router.get(prefix + url, fn);
                            break;
                        case 'POST':
                            router.post(prefix + url, fn);
                            break;
                        case 'DELETE':
                            router.delete(prefix + url, fn);
                            break;
                        case 'PUT':
                            router.put(prefix + url, fn);
                            break;
                        default:
                            const a: never = method;
                            console.warn('存在未知的请求方式，请注册:' + a);
                            break;
                    }
                }
            }
        }
    }
    return router.routes();
}

export default regist;

function* findClass(urls: string[]) {
    for (const path of urls) {
        yield import(path);
    }
}

interface ClassFunction {
    new(...args: any[]): any;
    [key: string]: any;
}

interface Info { url: string, method: Method }

function dataToStr(this: any, key: string, value: unknown) {
    if (key === 'data' && this.data === value && value instanceof Array && value.length > 2) {
        return value.slice(0, 2);
    }
    return value;
}