import { tablesToTruncate, getOrMakeFakeConnection } from './testDb';

describe('.truncateAllTables', () => {
	it('should be aware of all of the entities in the DB', async () => {
		const connection = await getOrMakeFakeConnection();

		if (connection.entityMetadatas.length !== tablesToTruncate.length) {
			throw new Error('A dev forgot to add one or many new entities to tablesToTruncate.');
		}
	});
});
