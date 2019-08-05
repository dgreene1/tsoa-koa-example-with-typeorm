import { Get, Post, Route, Body, Query, Header, Path, SuccessResponse, Controller } from 'tsoa';
import { IOratorCreationRequest, IOratorResponse } from './oratorSwaggerModels';
import { saveNewOratorToDb, getOratorBySubject } from './oratorBusiness';
import { ConnectionCreator } from '../../db/connectionCreator';
import { myLogger } from '../../agnosticUtilities/myLogger';

@Route('orator')
export class OratorController extends Controller {
	@Get('{subjectId}/{orgId}')
	public async getOratorBySubject(subjectId: string, orgId: number): Promise<IOratorResponse> {
		if (process.env.DEMO_MODE) {
			myLogger.warn('Running in demo mode. About to send back a mock object.');
			return {
				id: 'mockId',
				subjects: [
					{
						id: 'mockSubjectId',
						orgId: 9,
					},
				],
				vocalRange: 'mock soprano range',
			};
		}

		const dbConnection = await ConnectionCreator.makeOrGetAsync();
		return getOratorBySubject(
			{
				id: subjectId,
				orgId,
			},
			dbConnection,
		);
	}

	@Post()
	public async createOrator(@Body() requestBody: IOratorCreationRequest): Promise<IOratorResponse> {
		if (process.env.DEMO_MODE) {
			myLogger.warn('Running in demo mode. About to send back a mock object.');
			return {
				id: 'mockId',
				subjects: [
					{
						id: 'mockSubjectId',
						orgId: 9,
					},
				],
				vocalRange: 'mock soprano range',
			};
		}

		const dbConnection = await ConnectionCreator.makeOrGetAsync();
		return saveNewOratorToDb(requestBody, dbConnection);
	}
}
