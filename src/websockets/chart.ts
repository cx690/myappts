import { Socket } from "socket.io";
import { Wsbase } from "../utils/base.js";
import { Namespace } from "../decorator/wsapi.js";
import jwt from 'jsonwebtoken';
import { on } from "../decorator/wsapi.js";
import { accessLogger } from "../config/logger.js";
import { getRepository } from 'typeorm';
import type _User from '../entities/user.js';
import _Chat from '../entities/chat.js';
const chat = getRepository(_Chat);

export const userList: (_User & Record<string, any>)[] = [];
function deleteUser(id: string) {
    const index = userList.findIndex(v => v.socketId === id)
    if (index > -1) {
        userList.splice(index, 1);
    }
}

@Namespace()
class Chat extends Wsbase {

    async connection(socket: Socket) {
        const token = socket.handshake.headers.token?.toString();
        if (!token) return;
        const user = jwt.decode(token) as UserAll;
        Object.assign(user, { socketId: socket.id });
        socket.user = user;
        userList.push(user);
        socket.emit('login', socket.id);
        socket.emit('users', userList);
        socket.broadcast.emit('users', userList);
        socket.broadcast.emit('join', user);
        accessLogger.info(`用户进入聊天室：${user.userName} id:${user.id}`);
    }

    @on()
    async chat(socket: Socket, content: string) {
        if (content !== '') {
            const user = socket.user;
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
        deleteUser(socket.user?.socketId);
        socket.broadcast.emit('users', userList);
        accessLogger.info(`用户离开聊天室：${socket.user?.userName} id:${socket.user?.id}`);
        setTimeout(() => {
            socket.disconnect(true);
        }, 5000);
    }
}

export default Chat;

function getRecord(time: number = Date.now()) {
    return chat.createQueryBuilder().where('createdAt < :time', { time }).orderBy('createdAt', 'DESC').limit(10).getMany();
}

type UserAll = _User & { id: number, socketId: string }

declare module 'socket.io' {
    class Socket {
        /** 用户数据 */
        user: UserAll;
    }
}