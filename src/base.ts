import { Socket } from "socket.io";

const UUID_REG = /^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/;
export class Base {
    $isValidId(id: string) {
        return UUID_REG.test(id.toString());
    };
}
/** ws继承的函数 */
export abstract class Wsbase {
    abstract connection(socket: Socket): Promise<any | void>
}
