import jwt from 'jsonwebtoken';
import { Base } from '../utils/base.js';
import { Controller, get, post, required } from '../decorator/index.js';
import type { Ctx, Result } from '../utils/type.js';
import { getRepository } from 'typeorm';
import _User from '../entities/user.js';
const user = getRepository(_User);

@Controller('/user')
class User extends Base {

	@required(['account', 'password'], { errMsg: '请正确输入用户名或密码！' })
	@post()
	async login(ctx: Ctx): Result {
		const { account, password } = ctx.request.body;
		const res = await user.createQueryBuilder().where('account = :account and password = :password', { account, password }).getOne();

		if (!res) {
			return { code: 400, msg: '用户名或密码错误！' }
		} else {
			return { data: res, code: 200, msg: '登陆成功！', token: jwt.sign({ ...res }, 'this is a secret') };
		}
	}

	@get()
	async userList(ctx: Ctx) {
		const { userName, account } = ctx.request.query;
		let query = user.createQueryBuilder();
		if (userName) {
			query = query.where('userName like :userName', { userName: `%${userName}%` });
		}
		if (account) {
			if (userName) {
				query = query.andWhere('account like :account', { account: `%${account}%` });
			} else {
				query = query.where('account like :account', { account: `%${account}%` });
			}
		}
		return await query.getMany();
	}

	@required([{ key: 'account', errMsg: '请输入账户' }, { key: 'account', errMsg: '请输入用户名' }, { key: 'password', errMsg: '请输入密码' }])
	@post()
	async regist(ctx: Ctx): Result {
		const insert = new _User(ctx.request.body)
		const res = await user.save(insert);
		return { data: res, code: 200 };
	}

	@get()
	async userInfo(ctx: Ctx): Result {
		const token = ctx.state.user;
		const user = jwt.decode(token);
		return { code: 200, data: user }
	}
}
export default User;
