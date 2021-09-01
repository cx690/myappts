import koa from 'koa';
import bodyParser from 'koa-bodyparser';
import regist from './router.js';
import 'reflect-metadata';
import { logger } from './config/logger.js';
import importModel from './model.js';

const app = new koa();

app.use(bodyParser());

app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    logger.info(`收到请求:${ctx.request.method} ${ctx.request.url}...`);
    logger.info(`参数${ctx.request.method === 'GET' ? 'query' : 'body'}:${JSON.stringify(ctx.request.method === 'GET' ? ctx.request.query : ctx.request.body)}`);
    await next();
});

app.on('error', err => {
    logger.error(JSON.stringify(err));
})

// app.use(ctx => {
//     ctx.body = '没想到吧?！';
// })

async function run() {
    await importModel();
    const routes = await regist();
    app.use(routes);
    console.log('app started at port 3000...')
    app.listen(3000);
}

run();