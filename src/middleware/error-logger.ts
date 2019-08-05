import * as Router from 'koa-router';
import { myLogger } from '../agnosticUtilities/myLogger';

export const errorLogger: Router.IMiddleware = async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		// tslint:disable-next-line: no-unsafe-any
		myLogger.error({ error: err, correlationId: ctx.state.correlationId }, 'Response error.');
		throw err;
	}
};
