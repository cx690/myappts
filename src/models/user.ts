import { defineModel, STRING } from '../config/db.js';
const user = defineModel('user', {
	name: STRING(255),
	password: STRING(255),
	phone: {
		type: STRING(12),
		allowNull: true,
	},
});
export default user;