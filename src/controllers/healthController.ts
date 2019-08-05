import { Controller, Route, Get } from 'tsoa';
import { ConnectionCreator } from './../db/connectionCreator';

/**
 * @tsoaModel
 */
interface IHealthResponse {
	serviceIsAlive: boolean;
}

@Route('health')
export class HealthController extends Controller {
	@Get()
	public async getHealthCheckResponse(): Promise<IHealthResponse> {
		// Don't admit that we're healthy/up until we have a connection to the Database
		const connection = await ConnectionCreator.makeOrGetAsync();

		if (connection.isConnected) {
			return Promise.resolve({
				serviceIsAlive: true,
			});
		} else {
			throw new Error('Connection to the DB has been severed');
		}
	}
}
