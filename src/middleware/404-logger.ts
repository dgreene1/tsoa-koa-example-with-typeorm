import * as Boom from '@hapi/boom';
import * as Router from 'koa-router';
import * as httpStatusCodes from 'http-status-codes';
import { myLogger } from '../agnosticUtilities/myLogger';

export const fourOhFourLogger: Router.IMiddleware = async (ctx, next) => {
	if (ctx.status === httpStatusCodes.NOT_FOUND) {
		myLogger.error(Boom.notFound());
	}
};
