
import jwt from 'jsonwebtoken';
import { Base } from '../base.js';
import { Controller, get, post, required } from '../decorator/index.js';
import user from '../models/user.js';
import { Utils } from '../utils/type.js';
@Controller('/user')
class User extends Base {
	@required(['unserName', 'password'], { errMsg: '请正确输入用户名或密码！' })
	@post()
	async login(ctx: Utils.ctx): Utils.Result {
		const { unserName, password } = ctx.request.body;
		const res: any = await user.findOne({
			where: {
				name: unserName,
				password,
			}
		})
		if (!res) {
			return { code: 400, msg: '用户名或密码错误！' }
		} else {
			res.password = '*';
			return { data: res, code: 0, msg: '登陆成功！', token: jwt.sign(res, 'this is a secret') };
		}
	}

	@get()
	@post()
	async allUser() {
		return await user.findAll();
	}

	@required(['unserName', 'password'], { errMsg: '请正确输入用户名和密码！' })
	@post()
	async regist(ctx: Utils.ctx): Utils.Result {
		const { unserName, password, phone } = ctx.request.body;
		const res = await user.create({
			name: unserName,
			password,
			phone,
		});
		return { data: res, code: 0 };
	}

	@get()
	async userInfo(ctx: Utils.ctx): Utils.Result {
		return { code: 200, data: ctx.state.user }
	}
}
export default User;
