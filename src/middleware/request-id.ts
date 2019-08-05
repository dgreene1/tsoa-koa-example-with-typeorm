import * as Router from 'koa-router';
import * as shortId from 'shortid';
import { getHeaderValue } from './ctxHelpers';

export const insertCorrelationId: Router.IMiddleware = async (ctx, next) => {
	const correlationIdFromConsumer = getHeaderValue(ctx, 'x-fl-hop-correlationid');
	const ctxStateAsRecord = (ctx.state as Record<string, unknown>) || {};
	ctxStateAsRecord.correlationId = correlationIdFromConsumer || shortId.generate();
	await next();
};
