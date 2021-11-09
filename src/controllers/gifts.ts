import { Base } from '../utils/base.js';
import { Controller, get, post, required } from '../decorator/index.js';
import type { Ctx, Result } from '../utils/type.js';
import { getRepository } from 'typeorm';
import _Gifts from '../entities/gifts.js'
const gifts = getRepository(_Gifts);

@Controller()
class Gifts extends Base {
	@post()
	async all(ctx: Ctx): Result {
		const { time, kw, sigin, type } = ctx.request.body;
		let query = gifts.createQueryBuilder().where('hidden = 0');

		if (time && time.length) {
			query = query.andWhere('createdAt > :start and createdAt < :end', { start: new Date(time[0]).getTime(), end: new Date(time[1]).getTime() });
		}

		if (kw) {
			query = query.andWhere('(`name` like :kw or `desc` like :kw)', { kw: `%${kw}%`, });
		}

		if (type) {
			query = query.andWhere('type = :type', { type });
		}

		if (sigin !== undefined && sigin !== '') {
			query = query.andWhere('sigin = :sigin', { sigin });
		}
		query = query.orderBy('gifts.createdAt');
		const data = await query.getMany();

		let total = 0;
		for (const item of data as any[]) {
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
		const data = await gifts.createQueryBuilder().where('id = :id', { id }).getOne();
		return { code: 200, data: data, msg: 'ok' }
	}

	@post()
	async save(ctx: Ctx): Result {
		const { id } = ctx.request.body;
		const parms = gifts.create(ctx.request.body as Record<string, any>);
		if (id) {
			const res = await gifts.createQueryBuilder().update().set(parms).where('id = :id', { id }).execute();
			return { code: 200, data: res, msg: 'ok' }
		}
		const res = await gifts.save(parms);
		return { code: 200, data: res, msg: 'ok' }
	}

	@required('id')
	@post()
	async delete(ctx: Ctx): Result {
		const { id } = ctx.request.body;
		const res = await gifts.createQueryBuilder().update().set({ hidden: 1 }).where('id = :id', { id }).execute();
		return { code: 200, data: res, msg: 'ok' }
	}

	@get()
	async typeList() {
		return await gifts.createQueryBuilder('gifts').select(['type as value']).where('gifts.type is not null').groupBy('gifts.type').getRawMany();
	}
}
export default Gifts;
