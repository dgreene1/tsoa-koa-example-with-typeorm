import * as initSqlJs from 'sql.js';
import { SqlJs } from 'sql.js/module';
import { Connection, createConnection, ConnectionOptions } from 'typeorm';
import * as path from 'path';
import { envVars } from '../../config/configInitiator';
import { DbSubjectOfIDM } from '../../db/entities/DbSubjectOfIDM';
import { DbOrator } from '../../db/entities/DbOrator';
import { DbAbsenceRequestShortcut } from '../../db/entities/DbAbsenceRequestShortcut';

let dbInstance: SqlJs.Database | null;
let sqlJsStaticInstance: SqlJs.SqlJsStatic | null;

const getOrMakeDbHookAsync = async (): Promise<SqlJs.Database> => {
	if (dbInstance) {
		return dbInstance;
	} else {
		sqlJsStaticInstance = await initSqlJs();

		dbInstance = new sqlJsStaticInstance.Database();

		return dbInstance;
	}
};

/**
 * NOTE: when you add things to this array, please be careful of the order since it will break things if the foreign key constraints aren't considered
 */
export const tablesToTruncate = [
	// Reminder... the order matters. If not, you'll get a FOREIGN KEY CONSTRAINT error.
	// Make sure to remove foreign-key included tables before the foreign-key container table.
	DbAbsenceRequestShortcut,
	DbSubjectOfIDM,
	DbOrator,
];

export const truncateAllTables = async (): Promise<void> => {
	const conn = await getOrMakeFakeConnection();
	await conn.manager.transaction(async entityManager => {
		for (const table of tablesToTruncate) {
			await entityManager.clear(table);
		}
	});
};

let connectionForTests: Connection | null = null;

/**
 * designed to replace connectionCreator.makeOrGetAsync in tests
 */
export const getOrMakeFakeConnection = async (): Promise<Connection> => {
	if (connectionForTests) {
		return connectionForTests;
	} else {
		await getOrMakeDbHookAsync();
		const dbLogLevel = (envVars.getOptional('TYPEORM_LOGGING') as ConnectionOptions['logging']) || [
			'warn',
			'error',
			'migration',
		];
		const MUST_USE_SYNCHRONIZE_SINCE_SQLJS_AND_POSTGRES_MIGRATIONS_DIFFER_IN_SYNTAX = true;
		const connectionOptions: ConnectionOptions = {
			type: 'sqljs',
			logging: dbLogLevel,
			name: 'in-memory Sql.js DB for use in tests',
			entities: [path.resolve(__dirname, './../../db/entities/*{.js,.ts}')],
			migrations: [
				// Don't use the migration files since they're written for PostGres and we can only use Sql.js (which is a variant of SqlLite) in the API tests
			],
			subscribers: [path.resolve(__dirname, './../../db/subscribers/*{.js,.ts}')],
			migrationsRun: false,
			synchronize: MUST_USE_SYNCHRONIZE_SINCE_SQLJS_AND_POSTGRES_MIGRATIONS_DIFFER_IN_SYNTAX,
		};

		connectionForTests = await createConnection(connectionOptions);
		return connectionForTests;
	}
};
