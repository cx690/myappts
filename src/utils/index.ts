import fs from 'fs';
import path from 'path';
import { logger } from '../config/logger.js';

/**
 * 获取目录下所有js文件路径
 * @param dirname 调用函数的文件路径
 * @param dir 相对的文件夹路径
 * @returns 所有js文件相对路径
 */
export async function getPath(dirname: string, dir: string) {
    const urls: string[] = [];
    const files = await fs.readdirSync(path.resolve(dirname, dir));
    for (const name of files) {
        urls.push(dir + '/' + name);
    }
    return urls;
}

export function clg(msg: any, recordLog?: false, talk?: ((...arsg: any[]) => any | void) | undefined): void;
export function clg(msg: string, recordLog: true, talk?: ((...arsg: any[]) => any | void) | undefined): void;
/**
 * 控制台打印与记录日志
 * @param msg 要打印的数据
 * @param recordLog 是否记录为日志，默认false，true要求msg为string类型
 * @param talk 自定义的控制台输出函数
 */
export function clg(msg: any, recordLog = false, talk?: (...arsg: any[]) => any | void) {
    if (process.env.NODE_ENV === 'production' || msg === '') return;
    if (talk && typeof talk === 'function') {
        talk(msg);
    } else {
        console.log(msg);/* eslint-disable-line no-console */
    }
    if (recordLog) {
        logger.info(msg);
    }
}