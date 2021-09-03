import koa from 'koa';
import bodyParser from 'koa-bodyparser';
import regist from './router.js';
import 'reflect-metadata';
import { logger } from './config/logger.js';
import importModel from './model.js';
import koaJwt from 'koa-jwt';
import { Server } from 'socket.io';
import { createServer } from 'http'
import { registWs } from './ws.js';

const app = new koa();

const server = createServer(app.callback());

app.use(bodyParser());

app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    logger.info(`收到请求:${ctx.request.method} ${ctx.request.url}...`);
    logger.info(`参数${ctx.request.method === 'GET' ? 'query' : 'body'}:${JSON.stringify(ctx.request.method === 'GET' ? ctx.request.query : ctx.request.body)}`);
    await next();
});

app.use(async (ctx, next) => {
    return await next().catch((err) => {
        if (401 == err.status) {
            ctx.status = 401;
            ctx.body = { code: 401, msg: '缺少登录信息!' };
            logger.info('返回:缺少登录信息!');
        } else {
            throw err;
        }
    });
});

const jwt = koaJwt({
    secret: 'this is a secret',
    tokenKey: '233',
    getToken: (ctx) => ctx.request.header.token?.toString() || null,
})
app.use(jwt.unless({ path: ['/user/login'] }))

app.on('error', err => {
    logger.error(JSON.stringify(err));
})

const io = new Server(server, {
    path: '/ws',
    serveClient: false,
    // below are engine.IO options
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: true
});

async function run() {
    await importModel();
    const routes = await regist();
    app.use(routes);
    await registWs(io);
    console.log('app started at port 3000...')
    server.listen(3000);
}

run();