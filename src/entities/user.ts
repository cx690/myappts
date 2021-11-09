import { Column, Entity } from "typeorm";
import { prefix } from "../entity.js";
import { BaseEntity } from "../utils/base.js";

@Entity({ name: `${prefix}user` })
class User extends BaseEntity {
	constructor(param?: Record<string, any>) {
		super();
		if (typeof param === 'object' && param !== null) {
			this.account = param.account;
			this.userName = param.userName;
			this.password = param.password;
			this.header = param.header;
			this.phone = param.phone;
		}
	}

	/** 账户 */
	@Column()
	account: string

	/** 用户名称 */
	@Column()
	userName: string

	@Column({ select: false })
	password: string

	@Column({ nullable: true })
	header: string

	@Column({ length: 12, nullable: true })
	phone: string
}

export default User;