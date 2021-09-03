import { defineModel, STRING, FLOAT, INTEGER } from '../config/db.js';
import { Utils } from '../utils/type.js';

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

export type GiftsDto = {
	name: string;
	/**
	 * 到场状态
	 * 0 未到场
	 * 1 已到场
	 * 其他 未知
	 */
	status: string;
	/**
	 * 支付方式
	 * 0 现金
	 * 1 移动支付
	 * 其他 未知
	 */
	pay: string;
	/**
	 * 性质
	 * 0 无
	 * 1 还礼
	 * 2 小孩收礼
	 * 其他 无
	 */
	sigin: string;
	/** 描述说明 */
	desc?: string;
	/** 金额 */
	price: number;
	/** 隐藏状态 非零为隐藏 */
	hidden: number;
}

export type GiftsType = GiftsDto & Utils.Fiels;

export type GiftsAny<T = any> = GiftsType & Utils.Dict<T>;
