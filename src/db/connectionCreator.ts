import 'reflect-metadata';
import { createConnection, Connection, ConnectionOptions, getConnectionOptions } from 'typeorm';
import { myLogger } from '../agnosticUtilities/myLogger';
import * as path from 'path';

let connectionInstance: Connection | null = null;

const getFinalConfig = async (): Promise<ConnectionOptions> => {
	// read connection options from ormconfig file (or ENV variables)
	const baseConfig = await getConnectionOptions();

	const onlyLookAtTranspiledEntities = path.resolve(__dirname, 'entities/*.js');
	const onlyLookAtTranspiledMigrations = path.resolve(__dirname, 'migrations/*.js');
	const onlyLookAtTranspiledSubscribers = path.resolve(__dirname, 'subscribers/*.js');

	const overrides: Partial<ConnectionOptions> = {
		entities: [onlyLookAtTranspiledEntities],
		migrations: [onlyLookAtTranspiledMigrations],
		subscribers: [onlyLookAtTranspiledSubscribers],
	};
	myLogger.warn(`Entities, migrations, and subscribers have been replaced. The ormconfig was pointing the entities prop to ${baseConfig.entities} but is being overwritten with ${onlyLookAtTranspiledEntities}.
                To learn why, read: https://github.com/typeorm/typeorm/issues/3629#issuecomment-516067546`);
	const finalConfig = Object.assign({}, baseConfig, overrides);

	return finalConfig;
};

export const ConnectionCreator = {
	makeOrGetAsync: async (): Promise<Connection> => {
		if (connectionInstance) {
			return connectionInstance;
		} else {
			myLogger.info(
				'about to make a DB connection for the first time for this pod (i.e. this instance of the application must be just starting up)',
			);
			const finalConfig = await getFinalConfig();

			myLogger.info(finalConfig, 'about to connect with these connection options');

			connectionInstance = await createConnection(finalConfig);
			return connectionInstance;
		}
	},
};
