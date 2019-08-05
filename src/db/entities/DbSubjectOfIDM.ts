import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { DbOrator } from './DbOrator';

export interface IDbSubjectOfIDM {
	id: string;
	orgId: number;
	orator: DbOrator;
}

@Entity()
export class DbSubjectOfIDM implements IDbSubjectOfIDM {
	@PrimaryColumn({
		unique: true,
		type: 'varchar',
	})
	public id: string;

	@PrimaryColumn({
		unique: true,
		type: 'bigint',
	})
	public orgId: number;

	@ManyToOne(type => DbOrator, {
		eager: true, // Please always set eager to true for ManyToOne relationships so the types are actually filled out
	})
	public orator: DbOrator;

	/**
	 * Please use the static ".make" function instead. Read more here: https://github.com/typeorm/typeorm/issues/1772#issuecomment-514787854
	 */
	public constructor() {}

	public static make(input: IDbSubjectOfIDM): DbSubjectOfIDM {
		const newInstance = new DbSubjectOfIDM();
		newInstance.id = input.id;
		newInstance.orgId = input.orgId;
		newInstance.orator = input.orator;
		return newInstance;
	}
}
