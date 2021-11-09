import { Namespace, Server, Socket } from "socket.io";
import { PrimaryGeneratedColumn, VersionColumn, BeforeUpdate, Column, BeforeInsert } from "typeorm";

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
    /** 在当前namespace被连接时自动调用的函数 */
    abstract connection(socket: Socket): Promise<any | void>
    constructor(io: Server, namespace: Namespace) {
        this.io = io;
        this.namespace = namespace;
    }
}

export class BaseEntity {
    /** 自增长ID */
    @PrimaryGeneratedColumn()
    id: number;

    /** 创建时间 */
    @Column({
        type: 'bigint',
        width: 15,
        nullable: false,
        default: 0,
        transformer: {
            from: (value?: number | null) => {
                return value ? +value : value;
            },
            to: (value?: Date | number) => {
                if (typeof value === 'number') {
                    return value;
                }
                return value instanceof Date ? value.getTime() : Date.now();
            },
        }
    })
    createdAt: number;

    /** 更新时间 */
    @Column({
        type: 'bigint',
        width: 15,
        nullable: true,
        default: null,
        transformer: {
            from: (value?: number | null) => {
                return value ? +value : value;
            },
            to: (value?: number) => {
                return value;
            },
        }
    })
    updatedAt?: number;

    @BeforeInsert()
    public setCreatedAt() {
        this.createdAt = this.createdAt || Date.now();
    }

    @BeforeUpdate()
    public setUpdatedAt() {
        this.updatedAt = Date.now();
    }

    /** 更新次数 */
    @VersionColumn()
    readonly version: number;
}