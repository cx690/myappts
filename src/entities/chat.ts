import { Column, Entity } from "typeorm";
import { prefix } from "../entity.js";
import { BaseEntity } from "../utils/base.js";

@Entity({ name: `${prefix}chat` })
class Chat extends BaseEntity {
	/** 用户名称 */
	@Column()
	userName: string

	/** 用户ID */
	@Column()
	userId: number

	@Column({ length: 1000 })
	content: string

	@Column({ nullable: true })
	header: string
}
export default Chat;