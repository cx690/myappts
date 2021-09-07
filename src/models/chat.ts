import { defineModel, STRING, INTEGER } from '../config/db.js';
import { Dict, Fiels } from '../utils/type.js';

const chat = defineModel('chat', {
	userName: STRING(255),//用户名称
	header: {
		type: STRING(255),
		allowNull: true,
	},
	userId: INTEGER({ length: 50 }),
	content: STRING(1000),
});

export default chat;

export type ChatDto = {
	userName: string;
	header?: string;
	userId: number;
	/** 消息数据 */
	content: string;
}

export type ChatType = ChatDto & Fiels;

export type ChatAny<T = any> = ChatType & Dict<T>;