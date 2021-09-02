import { defineModel, STRING } from '../config/db.js';
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