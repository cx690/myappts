import path from 'path';
import fs from 'fs';
import { createConnection } from 'typeorm';
import { fileURLToPath } from 'url';
import { clg } from './utils/index.js';
import { logger } from './config/logger.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const js_files = fs.readdirSync(path.resolve(__dirname, './entities')).filter((f) => {
    return f.endsWith('.js') || f.endsWith('.ts');
});

function* importSth() {
    for (const f of js_files) {
        clg(`regist entities from file ${f}...`);
        yield import('./entities/' + f).then((res: any) => Object.values(res));
    }
}

const connectDb = async function (synchronize = false) {
    const entities = (await Promise.all([...importSth()])).flat() as any[];
    const mysqlCfg: Parameters<typeof createConnection>[0] = {
        type: 'mysql',
        database: 'index',
        username: 'root', // 用户名
        password: '123456', // 口令
        host: 'localhost', // 主机名
        port: 3306, // 端口号，MySQL默认3306
        entities,
        synchronize: process.env.NODE_ENV !== 'production' && synchronize,
        logger: {
            log: (lv, msg) => {
                clg(msg);
            },
            logQuery(query) {
                clg(query, true);
            },
            logQueryError(error, query) {
                clg(`Query Error:${query}`);
                clg(error);
                logger.error(`Query Error:${query}`);
            },
            logMigration(msg) {
                clg(msg);
            },
            logQuerySlow(time, query) {
                logger.info(`查询过慢：${time};query:${query}`)
            },
            logSchemaBuild(msg) {
                clg(msg);
            }
        },
    }
    return createConnection(mysqlCfg).then(() => {
        clg('Connection has been established successfully.');
    }).catch(err => {
        console.error('Unable to connect to the database:', err);/* eslint-disable-line no-console */
        process.exit(0);
    });;
}

export default connectDb;

/** 表名前缀 */
export const prefix = 'cx_';