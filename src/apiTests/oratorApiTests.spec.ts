import { getUnStartedApp } from '../index';
import * as supertest from 'supertest';
import { IOratorCreationRequest, IOratorResponse } from '../controllers/orator/oratorSwaggerModels';
import { getOrMakeFakeConnection, truncateAllTables } from './apiTestHelpers/testDb';
import * as connectionCreator from '../db/connectionCreator';
import * as httpStatusCodes from 'http-status-codes';
import { envVars } from '../config/configInitiator';
import { getAPITestTimeout } from './apiTestHelpers/testTimeoutConfig';

const relativeUrlForOratorApi = '/api/v1/orator';

describe(relativeUrlForOratorApi, () => {
	jest.setTimeout(getAPITestTimeout()); // because API tests take longer when you're debugging;
	const SpyOfMakeOrGetConnectionAsync = jest.spyOn(connectionCreator, 'makeOrGetConnectionAsync');

	beforeEach(async () => {
		SpyOfMakeOrGetConnectionAsync.mockImplementation(getOrMakeFakeConnection);
	});

	afterEach(async () => {
		await truncateAllTables();
		// For some reason closing the connection and/or db is causing an out of memory exception // const conn = await getOrMakeFakeConnection();
		// For some reason closing the connection and/or db is causing an out of memory exception // await conn.close();
		// For some reason closing the connection and/or db is causing an out of memory exception // db.close();
		//      ... could be due to this strange issue: https://github.com/kripken/sql.js/issues/201
	});

	describe('POST endpoint', () => {
		it('should fail since this is a bogus test', async () => {
			// Arrange

			// Act
			const result = await supertest(getUnStartedApp().callback())
				.post(relativeUrlForOratorApi)
				.send({});

			// Assert
			expect(result.status).toEqual(httpStatusCodes.INTERNAL_SERVER_ERROR);
			expect(result.body).toEqual({});
		});
	});
});

function expectToBeAGuid(): string {
	// tslint:disable-next-line: no-unsafe-any
	return expect.stringContaining('-');
}
