import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import replace from '@rollup/plugin-replace';
import * as fs from 'fs';

/** @type {import('rollup').RollupOptions} */
const config = {
    input: {
        "src/app": './src/app.ts',
        'src/init-db': './src/init-db.ts',
        'src/router': './src/router.ts',
        'src/entity': './src/entity.ts',
        'src/ws': './src/ws.ts',
        ...getInputs('src/controllers'),
        ...getInputs('src/entities'),
        ...getInputs('src/websockets'),
    },
    output: {
        dir: 'dist',
        format: 'esm',
        chunkFileNames: 'src/chunks/[name].js'
    },
    plugins: [
        resolve({
            extensions: ['.js', '.mjs', '.cjs', '.ts']
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify('production'),
            'preventAssignment': true
        }),
        typescript(),
    ],
    external: function (id) {
        if (/node_modules/.test(id)) {
            return true
        }
        return false;
    },
}

export default config;
/**
 * @param {string} dir
 * @returns {Record<string,string>}
 */
function getInputs(dir) {
    const inputs = {};
    fs.readdirSync(dir).filter(name => name.endsWith('.ts') || name.endsWith('.js')).forEach(name => {
        const input = name.replace(/\.(ts|js)$/, '');
        inputs[`${dir}/${input}`] = `${dir}/${name}`;
    });
    return inputs;
}