import { Entity, Column, PrimaryColumn, OneToMany, JoinColumn } from 'typeorm';
import * as uuid from 'uuid';
import { IOratorCreationRequest } from '../../controllers/orator/oratorSwaggerModels';
import { Seed } from '../SeedNewData';

export interface IDbOrator {
	id: string;
	vocalRange: string;
}

@Entity()
export class DbOrator implements IDbOrator {
	@PrimaryColumn({
		unique: true,
		type: 'varchar',
	})
	public id: string;

	@Column({
		unique: true,
		type: 'varchar',
	})
	public vocalRange: string;

	/**
	 * Please use the static ".make" function instead. Read more here: https://github.com/typeorm/typeorm/issues/1772#issuecomment-514787854
	 */
	public constructor() {}

	public static make(input: Seed<IOratorCreationRequest>): DbOrator {
		const newInstance = new DbOrator();
		newInstance.id = uuid.v4();
		newInstance.vocalRange = input.data.vocalRange;
		return newInstance;
	}
}
