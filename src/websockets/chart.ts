import { Socket } from "socket.io";
import { Wsbase } from "../utils/base.js";
import { Namespace } from "../decorator/wsapi.js";
import jwt from 'jsonwebtoken';
import { on } from "../decorator/wsapi.js";
import { accessLogger } from "../config/logger.js";
import { getRepository } from 'typeorm';
import type _User from '../entities/user.js';
import _Chat from '../entities/chat.js';
import { filter } from "../utils/index.js";
const chat = getRepository(_Chat);

@Namespace()
class Chat extends Wsbase {

    async connection(socket: Socket) {
        const token = socket.handshake.headers.token?.toString();
        if (!token) return;
        const user = jwt.decode(token) as UserAll;
        Object.assign(user, { socketId: socket.id });
        socket.data.user = user;
        const userList = filter((await this.namespace.fetchSockets()).map(socket => socket.data.user) as UserAll[]);
        socket.emit('login', socket.id);
        socket.emit('users', userList);
        socket.broadcast.emit('users', userList);
        socket.broadcast.emit('join', user);
        accessLogger.info(`用户进入聊天室：${user.userName} id:${user.id}`);
    }

    @on()
    async chat(socket: Socket, content: string) {
        if (content !== '') {
            const user = socket.data.user;
            const insert = chat.create({
                userName: user.userName,
                userId: user.id,
                content: content,
            })
            const res: any = await chat.save(insert);
            socket.broadcast.emit('chat', res);
            socket.emit('chat', res);
        }
    }

    @on()
    async record(socket: Socket, time: number) {
        const record = await getRecord(time);
        socket.emit('record', record);
    }

    @on()
    async disconnect(socket: Socket) {
        const userList = (await this.namespace.fetchSockets()).map(socket => socket.data.user).filter((user?: UserAll) => user && user.id !== socket.data.user.id) as UserAll[];
        socket.broadcast.emit('users', filter(userList));
        accessLogger.info(`用户离开聊天室：${socket.data.user?.userName} id:${socket.data.user?.id}`);
        setTimeout(() => {
            socket.disconnect(true);
        }, 5000);
    }
}

export default Chat;

function getRecord(time: number = Date.now()) {
    return chat.createQueryBuilder().where('createdAt <= :time', { time }).orderBy('createdAt', 'DESC').limit(10).getMany();
}

type UserAll = _User & { socketId: string }
