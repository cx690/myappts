import fs from 'fs';
import path from 'path';

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

/** 控制台打印 */
export function clg(msg: any, talk?: Function) {
    if (process.env.NODE_ENV === 'production' || msg === '') return;
    if (talk) {
        talk(msg);
    } else {
        console.log(msg)
    }
}