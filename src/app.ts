import cluster from 'cluster';
import { cpus } from 'os';
import { createServer } from 'http';
import koa from 'koa';
import bodyParser from 'koa-bodyparser';
import regist from './router.js';
import 'reflect-metadata';
import { logger } from './config/logger.js';
import importModel from './model.js';
import koaJwt from 'koa-jwt';
import { Server } from 'socket.io';
import { registWs } from './ws.js';
import { clg } from './utils/index.js';
import { connectDb } from './config/db.js';

if ((cluster.isPrimary || cluster.isMaster) && process.env.NODE_ENV !== "development") {
    console.log(`Primary ${process.pid} is running`);/* eslint-disable-line no-console */

    // 衍生工作进程。    
    const numCPUs = cpus().length;
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died,code:${code},signal:${signal} !`);/* eslint-disable-line no-console */
    });
} else {
    const app = new koa();

    const server = createServer(app.callback());

    app.use(bodyParser());

    app.use(async (ctx, next) => {
        clg(`Process ${ctx.request.method} ${ctx.request.url}...`);
        logger.info(`收到请求:${ctx.request.method} ${ctx.request.url}...`);
        logger.info(`参数${ctx.request.method === 'GET' ? 'query' : 'body'}:${JSON.stringify(ctx.request.method === 'GET' ? ctx.request.query : ctx.request.body)}`);
        await next();
    });

    app.use(async (ctx, next) => {
        return await next().catch((err) => {
            if (401 === err.status) {
                ctx.status = 401;
                ctx.body = { code: 401, msg: '缺少登录信息!' };
                logger.info('返回:缺少登录信息!');
            } else {
                throw err;
            }
        });
    });

    app.use(koaJwt({
        secret: 'this is a secret',
        tokenKey: '233',
        getToken: (ctx) => ctx.request.header.token?.toString() || null,
    }).unless({ path: ['/user/login', /\/gifts\//] }))

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
        await connectDb;
        await importModel();
        const routes = await regist();
        app.use(routes);
        await registWs(io);
        //404处理
        app.use(async (ctx) => {
            const status = ctx.response.status;
            if (status === 404) {
                ctx.response.body = { code: 404, msg: `找不到${ctx.request.method}请求路径!`, path: ctx.request.url };
                ctx.response.status = 404;
            }
        })
        console.log('app started at port 3000...');/* eslint-disable-line no-console */
        server.listen(3000);
    }

    run();

    console.log(`Worker ${process.pid} started`);/* eslint-disable-line no-console */
}