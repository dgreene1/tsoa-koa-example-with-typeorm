import * as Router from 'koa-router';
import * as httpStatusCodes from 'http-status-codes';
import { AxiosError } from 'axios';
import * as createHttpError from 'http-errors';
import * as Boom from '@hapi/boom';
import { assertUnreachable } from '../agnosticUtilities/assertUnreachable';
import { envVars } from '../config/configInitiator';

function isAxiosError(input: unknown & object): input is AxiosError {
	const innocentUntilGuilty = input as Partial<AxiosError>;
	return !!innocentUntilGuilty.stack && !!innocentUntilGuilty.code && typeof innocentUntilGuilty.code === 'string';
}

function isHttpError(input: unknown & object): input is createHttpError.HttpError {
	const innocentUntilGuilty = input as Partial<createHttpError.HttpError>;
	return (
		!!innocentUntilGuilty.stack &&
		!!innocentUntilGuilty.statusCode &&
		typeof innocentUntilGuilty.statusCode === 'number'
	);
}

const grabStatusCodeFromError = (error: Error | AxiosError | createHttpError.HttpError | Boom): number | undefined => {
	// ######################
	// IMPORTANT NOTE: Boom must be first in the check since some libraries (like tsoa) automatically set the ".code" to 500 if there wasn't one.
	//      So if .code is the first thing you check, then you'd never arrive at .output.statusCode
	// ######################
	if (Boom.isBoom(error)) {
		return error.output.statusCode;
	}
	if (isHttpError(error)) {
		return error.statusCode;
	}
	if (isAxiosError(error)) {
		return error.code ? parseInt(error.code) : undefined;
	}
	if (error instanceof Error) {
		return undefined; // since standard errors don't have http status codes
	} else {
		return assertUnreachable(error, 'We got some kind of error that we do not have a handler for');
	}
};

export const errorResponder: Router.IMiddleware = async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		const expose = envVars.get('EXPOSE_STACK');
		// tslint:disable-next-line: no-unsafe-any
		const statusCode = grabStatusCodeFromError(err) || httpStatusCodes.INTERNAL_SERVER_ERROR;

		ctx.status = statusCode;
		ctx.body = {
			// tslint:disable-next-line: no-unsafe-any
			message: err.message || 'An error occurred',
			// tslint:disable-next-line: no-unsafe-any
			correlationId: ctx.state.correlationId,
			// tslint:disable-next-line: no-unsafe-any
			stack: expose ? err.stack : undefined,
		};
	}
};
