import * as nconf from 'nconf';
import * as path from 'path';
import * as utilityTypes from 'utility-types';

const rightSideDoesNotMatter =
	'Only the key name matters because it will become the union of string literals defined as IRequiredEnvName';

/**
 * Add to this whenever you want to force configInitiator to verify the presence of an environment variable on startup
 */
export const requiredEnvVars = {
    APP_NAME: rightSideDoesNotMatter,
    MY_HOST_URL: rightSideDoesNotMatter,
	LOG_LEVEL: rightSideDoesNotMatter,
	EXPOSE_STACK: rightSideDoesNotMatter,
	TYPEORM_DATABASE: rightSideDoesNotMatter,
	TYPEORM_USERNAME: rightSideDoesNotMatter,
	TYPEORM_PASSWORD: rightSideDoesNotMatter,
	API_YOU_NEED: rightSideDoesNotMatter,
	OAUTH_CLIENT_ID: rightSideDoesNotMatter,
};

export type IRequiredEnvName = keyof typeof requiredEnvVars;

function determineTheRightEnv(): string {
	// We only consider the value of NODE_ENV when it's "test"
	//      (continued) because we need a workaround for the way that vscode-jest works (where it defaults NODE_ENV to "test" and ignores all other hand-rolled env variables during debugging)
	if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'test') {
		return 'test';
	} else {
		// But why do we read the value of NODE_ENV instead of NODE_ENV?
		//  (answer) We have to read from a variable other than NODE_ENV due to two webpack design mistakes/bugs https://github.com/webpack/webpack/issues/7074 and https://github.com/webpack/webpack/issues/7470

		if (!process.env.NODE_ENV) {
			throw new Error('the environment variable NODE_ENV must be set.');
		}

		if (
			process.env.NODE_ENV !== 'production' &&
			process.env.NODE_ENV !== 'stage' &&
			process.env.NODE_ENV !== 'development'
		) {
			throw new Error(
				`NODE_ENV was set to ${process.env.NODE_ENV} which is not one of the valid environment config file names`,
			);
		}

		return process.env.NODE_ENV;
	}
}

const env = determineTheRightEnv();

const selectedEnvFile = path.join(__dirname, env.toLowerCase() + '.json');

try {
	// Prioritize in order:
	// 1. Command line args
	// 2. Env vars
	// 3. Env specific file
	// 4. Default file
	nconf
		.argv()
		.env({ parseValues: true })
		.file('environmentConfig', selectedEnvFile)
		.required(Object.keys(requiredEnvVars));
} catch (err) {
	(err as Error).message = `Error with ${selectedEnvFile} : ${(err as Error).message}`;
	throw err;
}

type INConf = typeof nconf;
interface ISaferEnvGet {
	/**
	 * This is type-safe since the configInitiator utilizes nconf.required() to hard assert on startup
	 */
	get: (envVarName: IRequiredEnvName) => string;
}
interface IUnsafeEnvGet {
	/**
	 * Please use "get" instead of "getOptional" if this is a variable that must exist in all environments since that method requires the existence of the environment variable in all environments
	 */
	getOptional: (envVarName: string) => string | undefined | null;
}
type SaferNConf = utilityTypes.Overwrite<INConf, ISaferEnvGet> & IUnsafeEnvGet;

// tslint:disable-next-line:no-any // Because we need to dynamically add a function. Don't worry, we'll make it a strict type (SaferNConf) at the end
const nconfCopy = nconf as any;
// tslint:disable-next-line:no-unsafe-any
nconfCopy.getOptional = (envVarName: IRequiredEnvName | string) => {
	return nconf.get(envVarName);
};

// Now that we've instantiated the variables into memory, lets expose nconf so devs can use those environment variables
// tslint:disable-next-line:no-unsafe-any // Here's where we annotate the stricter type
export const envVars: SaferNConf = nconfCopy;
