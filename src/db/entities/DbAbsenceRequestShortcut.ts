import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import * as uuid from 'uuid';
import { DbOrator } from './DbOrator';
import { Seed } from '../SeedNewData';

export interface IAbsenceRequestShortcutTable {
	id: string;
	orator: DbOrator;
	institutionId: number;
	absenceReasonId: number;
	substituteSelections_shouldAsk: boolean;
	substituteSelections_wantsASubstituteDefault?: boolean;
	substituteNoteSelections_shouldAsk: boolean;
}

@Entity()
export class DbAbsenceRequestShortcut implements IAbsenceRequestShortcutTable {
	@PrimaryColumn({
		unique: true,
		type: 'varchar',
	})
	public id: string;

	@ManyToOne(type => DbOrator)
	public orator: DbOrator;

	@Column('bigint')
	public institutionId: number;

	@Column('bigint')
	public absenceReasonId: number;

	@Column('boolean')
	// tslint:disable-next-line: variable-name
	public substituteSelections_shouldAsk: boolean;

	@Column({
		type: 'boolean',
		nullable: true,
	})
	// tslint:disable-next-line: variable-name
	public substituteSelections_wantsASubstituteDefault?: boolean;

	@Column('boolean')
	// tslint:disable-next-line: variable-name
	public substituteNoteSelections_shouldAsk: boolean;

	/**
	 * Please use the static ".make" function instead. Read more here: https://github.com/typeorm/typeorm/issues/1772#issuecomment-514787854
	 */
	private constructor() {}

	public static make(input: Seed<IAbsenceRequestShortcutTable>): DbAbsenceRequestShortcut {
		const newInstance = new DbAbsenceRequestShortcut();
		Object.assign(newInstance, input, {
			id: uuid.v4(),
		});
		return newInstance;
	}
}
