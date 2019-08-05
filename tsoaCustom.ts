import * as tsoa from 'tsoa';
import * as fs from 'fs';
import * as path from 'path';
import { envVars } from './src/config/configInitiator';

function createDirRegardless(dirPath: string): void {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath);
		// tslint:disable-next-line: no-console
		console.log(`Created directory: ${dirPath}`);
	} else {
		// tslint:disable-next-line: no-console
		console.log(`This directory already existed so we'll keep moving: ${dirPath}`);
	}
}

async function main(): Promise<'done'> {
	// tslint:disable-next-line: no-console
	console.log('Started the tsoa generation');

	const buildDirectory = path.join(__dirname, 'build');
	const staticFileServingDir = path.join(buildDirectory, 'staticFilesToBeServed');
	createDirRegardless(buildDirectory);
	createDirRegardless(staticFileServingDir);

	const securityScopes = ({
		openid: 'openid',
		profile: 'profile',
	} as unknown) as Array<Record<string, string>>; // TODO: remove the "unknown" conversion once https://github.com/lukeautry/tsoa/pull/375 is merged

	const swaggerGenArgs: Parameters<typeof tsoa.generateSwaggerSpec> = [
		{
			outputDirectory: staticFileServingDir,
			entryFile: './src/index.ts',
			host: 'localhost:3000',
			basePath: '/api/v1',
			securityDefinitions: {
				OAuth2: {
					type: 'oauth2',
					flow: 'implicit',
					description: 'OAuth2 Implicit Grant',
					tokenUrl: envVars.get('OAUTH_CLIENT_ID') + '/connect/token',
					authorizationUrl: envVars.get('OAUTH_CLIENT_ID') + '/connect/authorize',
					scopes: securityScopes,
				},
			},
			yaml: true,
		},
	];

	const swaggerGenerationResult = await tsoa.generateSwaggerSpec(...swaggerGenArgs);
	// tslint:disable-next-line: no-console
	console.log(`Generated swagger doc at: ${swaggerGenArgs[0].outputDirectory}`);

	const routeGenArgs: Parameters<typeof tsoa.generateRoutes> = [
		{
			basePath: '/api/v1',
			entryFile: './src/index.ts',
			middleware: 'koa',
			routesDir: './src',
		},
	];

	const routesGenerationResult = await tsoa.generateRoutes(...routeGenArgs);
	// tslint:disable-next-line: no-console
	console.log(`Generated automatic routes at: ${routeGenArgs[0].routesDir}`);

	return 'done';
}

main()
	.then(() => {
		// tslint:disable-next-line: no-console
		console.log('Finished the tsoa generation');
	})
	.catch(err => {
		throw err;
	});
