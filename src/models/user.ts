import { defineModel, STRING } from '../config/db.js';
import { Utils } from '../utils/type.js';
const user = defineModel('user', {
	account: STRING(255),//账户
	userName: STRING(255),//用户名称
	password: STRING(255),
	phone: {
		type: STRING(12),
		allowNull: true,
	},
});
export default user;

export type UserDto = {
	account: string;
	userName: string;
	password: string;
	phone?: string;
}

export type UserType = UserDto & Utils.Fiels;

export type UserAny<T = any> = UserType & Utils.Dict<T>;