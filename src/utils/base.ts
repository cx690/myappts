import { Namespace, Server, Socket } from "socket.io";

const UUID_REG = /^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/;
export class Base {
    $isValidId(id: string) {
        return UUID_REG.test(id.toString());
    }
}
/** ws继承的函数 */
export abstract class Wsbase {
    /** 当前创建的namespace */
    namespace: Namespace;
    /** 顶层的websocket server */
    io: Server;
    abstract connection(socket: Socket): Promise<any | void>
    constructor(io: Server, namespace: Namespace) {
        this.io = io;
        this.namespace = namespace;
    }
}
