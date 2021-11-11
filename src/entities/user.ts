import { Column, Entity } from "typeorm";
import { prefix } from "../entity.js";
import { BaseEntity } from "../utils/base.js";

@Entity({ name: `${prefix}user` })
class User extends BaseEntity {
	/** 账户 */
	@Column()
	account: string

	/** 用户名称 */
	@Column()
	userName: string

	@Column({ select: false })
	password?: string

	@Column({ nullable: true })
	header: string

	@Column({ length: 12, nullable: true })
	phone: string
}

export default User;