import * as tsoa from 'tsoa';
import * as fs from 'fs';
import * as path from 'path';
import { Config } from 'tsoa';
import { envVars } from './src/config/configInitiator';

const RUN_ALL_COMMAND = '--all';

function printManPage(): never {
	// tslint:disable-next-line: no-console
	console.log(`A custom wrapper around the tsoa library. The following flags are available:
        "${RUN_ALL_COMMAND}" this will build the swagger document and the controller routes
    `);
	return process.exit(0);
}

function createDirRegardless(dirPath: string): void {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
		// tslint:disable-next-line: no-console
		console.log(`Created directory: ${dirPath}`);
	} else {
		// tslint:disable-next-line: no-console
		console.log(`This directory already existed so we'll keep moving: ${dirPath}`);
	}
}

const staticFileServingDir = path.join(__dirname, 'build', 'staticFilesToBeServed');

const tsoaConfig: Config = {
	swagger: {
		outputDirectory: staticFileServingDir,
		entryFile: './src/index.ts',
		host: 'localhost:3000',
		basePath: '/api/v1',
		noImplicitAdditionalProperties: 'throw-on-extras',
		yaml: true,
	},
	routes: {
		basePath: '/api/v1',
		entryFile: './src/index.ts',
		middleware: 'koa',
		routesDir: './src',
		controllerPathGlobs: ['./src/controllers/**/*.ts'],
	},
	ignore: ['node_modules'],
};

export async function generateSwaggerDocs() {
	createDirRegardless(tsoaConfig.swagger.outputDirectory);

	const swaggerGenerationResult = await tsoa.generateSwaggerSpec(tsoaConfig.swagger, tsoaConfig.routes);

	// tslint:disable-next-line: no-console
	console.log(`Generated swagger doc at: ${tsoaConfig.swagger.outputDirectory}`);

	return {
		swaggerGenerationResult,
	};
}

async function runCliForAll() {
	// tslint:disable-next-line: no-console
	console.log('Started the tsoa generation');

	const { swaggerGenerationResult } = await generateSwaggerDocs();

	// tslint:disable-next-line: no-console
	console.log(`Starting route controller generation.`);

	const routeGenArgs: Parameters<typeof tsoa.generateRoutes> = [tsoaConfig.routes, tsoaConfig.swagger];

	const routesGenerationResult = await tsoa.generateRoutes(...routeGenArgs);
	// tslint:disable-next-line: no-console
	console.log(`Generated automatic routes at: ${routeGenArgs[0].routesDir}`);

	return {
		swaggerGenerationResult,
		routesGenerationResult,
	};
}

if (!process.argv.length) {
	printManPage();
}

if (process.argv.includes(RUN_ALL_COMMAND)) {
	runCliForAll()
		.then(() => {
			// tslint:disable-next-line: no-console
			console.log('Finished the tsoa generation');
		})
		.catch(err => {
			throw err;
		});
} else {
	printManPage();
}
