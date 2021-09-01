
import { Base } from '../base.js';
import { Controller, post, required } from '../decorator/index.js';
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
			return { data: res, code: 0, msg: '登陆成功！' };
		}
	}
}
export default User;
