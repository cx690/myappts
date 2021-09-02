import pkgSequelize from 'sequelize';
import config from './mysql.js';
import * as uuid from 'uuid';
import { logger } from './logger.js';
const { Sequelize, DataTypes } = pkgSequelize;
export const sequelize = new Sequelize(config.database, config.username, config.password, {
	host: config.host,
	dialect: 'mysql',
	pool: {
		max: 5,
		min: 0,
		idle: 30000
	},
	logging: msg => {
		console.log(msg);
		logger.info(msg);
	},
	query: {
		raw: true  // 设置为 true，只返回源数据
	},
});

sequelize.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.');
	})
	.catch(err => {
		console.error('Unable to connect to the database:', err);
		process.exit(0);
	});

const ID_TYPE = DataTypes.INTEGER({ length: 50 });
/**
 * 定义数据表，增加部分默认字段
 * @param name 表名，配置了数据库前缀将会增加前缀
 * @param attributes 表的属性描述
 * @param option 其他设置项
 * @returns 定义的数据表模型
 */
export function defineModel(name: string, attributes: any, { isuuid = false, prefix = config.prefix }: {
	/** 是否采用uuid作为索引主键，默认false采用自增长主键 */
	isuuid?: boolean;
	/** 表前缀，默认数据库配置中的前缀 */
	prefix?: string;
} = {}) {
	let tableName = name;
	if (prefix) {
		tableName = prefix + name; //增加数据库前缀名
	}
	const attrs: any = {
		id: {
			type: ID_TYPE,
			primaryKey: true,
			autoIncrement: true,
		}
	};
	for (let key in attributes) {
		let value = attributes[key];
		if (typeof value === 'object' && value['type']) {
			value.allowNull = value.allowNull || false;
			attrs[key] = value;
		} else {
			attrs[key] = {
				type: value,
				allowNull: false
			};
		}
	}

	attrs.createdAt = {
		type: DataTypes.BIGINT,
		allowNull: true
	};
	attrs.updatedAt = {
		type: DataTypes.BIGINT,
		allowNull: true
	};
	attrs.version = {
		type: DataTypes.BIGINT,
		allowNull: true
	};
	return sequelize.define(name, attrs, {
		tableName: tableName,
		timestamps: false,
		hooks: {
			beforeValidate: function (obj: any, opt) {
				const now = Date.now();
				if (obj.isNewRecord) {
					if (!obj.id && isuuid) {
						obj.id = uuid.v4();;
					}
					obj.createdAt = obj.createdAt || now;
					obj.updatedAt = obj.updatedAt || now;
					obj.version = 0;
				} else {
					obj.updatedAt = Date.now();
					obj.version++;
				}
			}
		}
	});
}
export const STRING = DataTypes.STRING;
export const BOOLEAN = DataTypes.BOOLEAN;
export const INTEGER = DataTypes.INTEGER;
export const BIGINT = DataTypes.BIGINT;
export const FLOAT = DataTypes.FLOAT;
export const TEXT = DataTypes.TEXT;
export const DOUBLE = DataTypes.DOUBLE;
export const DATEONLY = DataTypes.DATEONLY;
export const QueryTypes = pkgSequelize.QueryTypes;

export async function sync() {
	// only allow create ddl in non-production environment:
	if (process.env.NODE_ENV !== 'production') {
		await sequelize.sync({
			force: false
		});
	} else {
		throw new Error('Cannot sync() when NODE_ENV is set to \'production\'.');
	}
}
