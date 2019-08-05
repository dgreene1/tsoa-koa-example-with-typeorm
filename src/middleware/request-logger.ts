import * as Router from 'koa-router';
import { myLogger } from '../agnosticUtilities/myLogger';
import { getStateValue } from './ctxHelpers';

// prevent logging of constantly pinged endpoints
const ignoredUrls: string[] = ['/api/health', '/api/metrics'];

export const logRequest: Router.IMiddleware = async (ctx, next) => {
	const correlationId = getStateValue(ctx, 'correlationId');

	if (!correlationId) {
		throw new Error(
			'Since correlationId was not set, that means that the insertCorrelationId middleware has not been run yet',
		);
	}

	if (ctx.method !== 'OPTIONS' && !ignoredUrls.includes(ctx.originalUrl)) {
		myLogger.debug(
			{
				correlationId: correlationId,
				method: ctx.method,
				url: ctx.originalUrl,
			},
			'Request received',
		);
	}
	await next();
};
