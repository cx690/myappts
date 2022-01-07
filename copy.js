import fs from 'fs';
import path from 'path';
deleteFolderRecursive('./dist');
fs.mkdirSync('./dist');
fs.copyFileSync('./package.json', './dist/package.json');
if (fs.existsSync('./yarn.lock')) {
    fs.copyFileSync('./yarn.lock', './dist/yarn.lock');
}
if (fs.existsSync('./package-lock.json')) {
    fs.copyFileSync('./package-lock.json', './dist/package-lock.json');
}
/**
 * 删除指定的文件目录
 * @param {string} url 
 */
 function deleteFolderRecursive(url) {
    if (fs.existsSync(url)) {
        const files = fs.readdirSync(url);
        files.forEach(function (file) {
            const curPath = path.join(url, file);
            if (fs.statSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(url);
    }
}