import { Base } from '../utils/base.js';
import { Op } from '../config/db.js';
import { Controller, post, required } from '../decorator/index.js';
import gifts from '../models/gifts.js';
import type { Ctx, Result } from '../utils/type.js';

@Controller()
class Gifts extends Base {
	@post()
	async all(ctx: Ctx): Result {
		const { time, kw, sigin } = ctx.request.body;
		const option: any = {
			where: {
				hidden: 0,
			},
			order: ['createdAt']
		}

		if (time && time.length) {
			option.where.createdAt = {
				[Op.gt]: new Date(time[0]).getTime(),
				[Op.lt]: new Date(time[1]).getTime(),
			}
		}

		if (kw) {
			option.where[Op.or] = {
				name: {
					[Op.like]: `%${kw}%`,
				},
				desc: {
					[Op.like]: `%${kw}%`
				}
			}
		}

		if (sigin !== undefined && sigin !== '') {
			option.where.sigin = sigin;
		}

		const data: any[] = await gifts.findAll(option);

		let total = 0;
		for (const item of data) {
			const { price, pay, sigin, status } = item;
			total += price;
			switch (pay) {
				case '0':
					item.payStr = '现金';
					break;
				case '1':
					item.payStr = '移动支付';
					break;
				default:
					item.payStr = '未知';
					break;
			}
			switch (sigin) {
				case '0':
					item.siginStr = '无';
					break;
				case '1':
					item.siginStr = '还礼';
					break;
				case '2':
					item.siginStr = '小孩收礼';
					break;
				default:
					item.siginStr = '无';
					break;
			}
			switch (status) {
				case '0':
					item.statusStr = '未到场';
					break;
				case '1':
					item.statusStr = '已到场';
					break;
				default:
					item.statusStr = '未知';
					break;
			}
		}
		return { code: 200, data: data, total, msg: 'ok' }
	}

	@required('id')
	@post()
	async one(ctx: Ctx): Result {
		const { id } = ctx.request.body;
		const data = await gifts.findOne({
			where: { id }
		})
		return { code: 200, data: data, msg: 'ok' }
	}

	@post()
	async save(ctx: Ctx): Result {
		const { id } = ctx.request.body;
		if (id) {
			const parms = ctx.request.body || {};
			const res = await gifts.update({
				...parms,
				updatedAt: Date.now()
			}, {
				where: {
					id,
				}
			});
			return { code: 200, data: res, msg: 'ok' }
		}
		const res = await gifts.create(ctx.request.body);
		return { code: 200, data: res, msg: 'ok' }
	}

	@required('id')
	@post()
	async delete(ctx: Ctx): Result {
		const { id } = ctx.request.body;
		const res = await gifts.update({
			hidden: 1,
		}, {
			where: { id }
		});
		return { code: 200, data: res, msg: 'ok' }
	}

}
export default Gifts;
