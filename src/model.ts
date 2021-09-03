import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as db from './config/db.js';

console.log('init sequelize...');
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const files = fs.readdirSync(path.resolve(__dirname, './models'));

let js_files = files.filter((f) => {
    return f.endsWith('.js');
});

export function* importSth() {
    for (const f of js_files) {
        console.log(`regist model from file ${f}...`);
        yield import('./models/' + f);
    }
}

export default async function importModel() {
    return await Promise.all([...importSth()]);
}

export async function sync() {
    await importModel();
    return await db.sync();
}