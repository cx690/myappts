import { Column, Entity } from "typeorm";
import { prefix } from "../entity.js";
import { BaseEntity } from "../utils/base.js";

@Entity({ name: `${prefix}gifts` })
class Gifts extends BaseEntity {
	@Column()
	name: string;

	/**
	 * 到场状态
	 * 0 未到场
	 * 1 已到场
	 * 其他 未知
	 */
	@Column({ default: '0', length: 1 })
	status: string;

	/**
	 * 支付方式
	 * 0 现金
	 * 1 移动支付
	 * 其他 未知
	 */
	@Column({ default: '0', length: 1 })
	pay: string;

	/**
	 * 性质
	 * 0 无
	 * 1 还礼
	 * 2 小孩收礼
	 * 其他 无
	 */
	@Column({ default: '0', length: 1 })
	sigin: string;

	/** 描述说明 */
	@Column({ nullable: true })
	desc: string;

	/** 金额 */
	@Column({ type: 'float' })
	price: number;

	/** 类型分类 */
	@Column({ nullable: true })
	type: string;

	/** 隐藏状态 非零为隐藏 */
	@Column({ default: 0, type: 'int', width: 1 })
	hidden: number;
}

export default Gifts;