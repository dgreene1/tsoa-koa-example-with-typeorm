import * as pino from 'pino';
import { envVars } from '../config/configInitiator';

interface IAvoidLog {
	/** We do this because Pino does not have a log method. See why at: https://github.com/pinojs/pino/issues/460#issuecomment-407718003 */
	log: (thisIsNotARealFunctionSoDoNotUseIt: never) => void;
}

export type IMyLogger = pino.Logger & IAvoidLog;

const possibleLevels: pino.Level[] = ['debug', 'error', 'fatal', 'info', 'trace', 'warn'];

function isPinoLogLevel(test: string): test is pino.Level {
	return (possibleLevels as string[]).includes(test);
}

function returnLogLevelOrThrow(test: string | unknown): pino.Level {
	if (typeof test !== 'string') {
		throw new Error('Expected the log level to be a string');
	}
	if (!isPinoLogLevel(test)) {
		throw new Error(`This is not a valid log level: ${test}. Possible options are: ${possibleLevels.join(', ')}`);
	}
	return test;
}

const logLevel = returnLogLevelOrThrow(envVars.get('LOG_LEVEL'));

const prettyPrintOptions = (envVars.getOptional('PRETTY_PRINT_LOGS') as unknown) as pino.LoggerOptions['prettyPrint'];

const pinoInstance = pino({
	level: logLevel,
	name: envVars.get('APP_NAME'),
	prettyPrint: prettyPrintOptions || false,
	serializers: {
		err: pino.stdSerializers.err,
		req: pino.stdSerializers.req,
		res: pino.stdSerializers.res,
	},
});

function aLogFunctionThatYouLiterallyCantUse(pleaseDontUseLog: never) {
	throw new Error(
		`Pino does not have a log method. See why at: https://github.com/pinojs/pino/issues/460#issuecomment-407718003 Note: you sent in ${pleaseDontUseLog}`,
	);
}

pinoInstance.log = aLogFunctionThatYouLiterallyCantUse;

export const myLogger = pinoInstance as IMyLogger;
