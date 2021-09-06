import { Socket } from "socket.io";
import { Wsbase } from "../utils/base.js";
import { Op } from "../config/db.js";
import { Namespace } from "../decorator/wsapi.js";
import chat, { ChatType } from "../models/chat.js";
import jwt from 'jsonwebtoken';
import { on } from "../decorator/wsapi.js";
import { UserAny, UserType } from "../models/user.js";
import { accessLogger } from "../config/logger.js";

export const userList: UserAny[] = [];
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
        const record = await getRecord();
        socket.emit('record', record);
        accessLogger.info(`用户进入聊天室：${user.userName} id:${user.id}`);
    }

    @on()
    async chat(socket: Socket, content: string) {
        if (content !== '') {
            const now = Date.now();
            const user = socket.user;
            const data: ChatType = {
                userName: user.userName,
                userId: user.id + '',
                createdAt: now,
                updatedAt: now,
                content: content,
            }
            const res: any = await chat.create(data);
            socket.broadcast.emit('chat', res.dataValues);
            socket.emit('chat', res.dataValues);
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

function getRecord(time = Date.now()) {
    return chat.findAll({
        where: {
            createdAt: {
                [Op.lt]: time
            }
        },
        order: [
            ['createdAt', 'DESC'],
        ],
        limit: 10,
    })
}

type UserAll = UserType & { id: number, socketId: string }

declare module 'socket.io' {
    class Socket {
        /** 用户数据 */
        user: UserAll;
    }
}