import { defineModel, STRING, INTEGER } from '../config/db.js';

const chat = defineModel('chat', {
	name: STRING(255),
	header: {
		type: STRING(255),
		allowNull: true,
	},
	userId: INTEGER({ length: 50 }),
	content: STRING(1000),
});

export default chat;