import jwt from 'jsonwebtoken';
import { Base } from '../utils/base.js';
import { Op } from '../config/db.js';
import { Controller, get, post, required } from '../decorator/index.js';
import user from '../models/user.js';
import { Utils } from '../utils/type.js';
@Controller('/user')
class User extends Base {

	@required(['account', 'password'], { errMsg: '请正确输入用户名或密码！' })
	@post()
	async login(ctx: Utils.ctx): Utils.Result {
		const { account, password } = ctx.request.body;
		const res: any = await user.findOne({
			where: {
				account,
				password,
			}
		})
		if (!res) {
			return { code: 400, msg: '用户名或密码错误！' }
		} else {
			res.password = '*';
			return { data: res, code: 200, msg: '登陆成功！', token: jwt.sign(res, 'this is a secret') };
		}
	}

	@get()
	async userList(ctx: Utils.ctx) {
		const { userName, account } = ctx.request.query;
		const option: any = { attributes: { exclude: ['password'] }, where: {} };
		if (userName) {
			option.where.userName = {
				[Op.like]: `%${userName}%`
			}
		}
		if (account) {
			option.where.account = {
				[Op.like]: `%${account}%`
			}
		}
		return await user.findAll(option);
	}

	@required([{ key: 'account', errMsg: '请输入账户' }, { key: 'account', errMsg: '请输入用户名' }, { key: 'password', errMsg: '请输入密码' }])
	@post()
	async regist(ctx: Utils.ctx): Utils.Result {
		const { account, unserName, password, phone } = ctx.request.body;
		const res = await user.create({
			account,
			unserName,
			password,
			phone,
		});
		return { data: res, code: 200 };
	}

	@get()
	async userInfo(ctx: Utils.ctx): Utils.Result {
		const token = ctx.state.user;
		const user = jwt.decode(token);
		return { code: 200, data: user }
	}
}
export default User;
