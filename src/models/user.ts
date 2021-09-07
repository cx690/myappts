import { defineModel, STRING } from '../config/db.js';
import { Dict, Fiels } from '../utils/type.js';
const user = defineModel('user', {
	account: STRING(255),//账户
	userName: STRING(255),//用户名称
	password: STRING(255),
	header: {
		type: STRING(255),
		allowNull: true,
	},
	phone: {
		type: STRING(12),
		allowNull: true,
	},
});
export default user;

export type UserDto = {
	/** 账号 */
	account: string;
	userName: string;
	password: string;
	/** 电话 */
	phone?: string;
	/** 头像 */
	header?: string;
}

export type UserType = UserDto & Fiels;

export type UserAny<T = any> = UserType & Dict<T>;