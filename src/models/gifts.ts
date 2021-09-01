import { defineModel, STRING, FLOAT, INTEGER } from '../config/db.js';

const gifts = defineModel('gifts', {
	name: STRING(255),
	status: {
		type: STRING(1),
		defaultValue: '0',
	},
	pay: {
		type: STRING(1),
		defaultValue: '0',
	},
	sigin: {
		type: STRING(1),
		defaultValue: '0',
	},
	desc: {
		type: STRING(255),
		allowNull: true,
	},
	price: FLOAT(10),
	hidden: {
		type: INTEGER({ length: 1 }),
		defaultValue: 0,
	}
});

export default gifts;
