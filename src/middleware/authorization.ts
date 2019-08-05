import * as Router from 'koa-router';
import * as httpStatusCodes from 'http-status-codes';
import { getHeaderValue, getQueryValue } from './ctxHelpers';

interface ICtxWithToken {
	accessToken: string;
}

export const ensureBearerToken: Router.IMiddleware = async (ctx, next) => {
	if (ctx.method === 'OPTIONS') {
		await next();
	} else {
		const authorizationHeader = getHeaderValue(ctx, 'authorization');
		const authorizationQueryParam = getQueryValue(ctx, 'token');
		const ctxState = (ctx.state as Partial<ICtxWithToken>) || {};

		if (authorizationHeader) {
			const tokenMatch = authorizationHeader.match(/Bearer (\S*)/);
			ctxState.accessToken = tokenMatch ? tokenMatch[1] : undefined;
		} else if (authorizationQueryParam) {
			const tokenMatch = authorizationQueryParam.match(/(\S*)/);
			ctxState.accessToken = tokenMatch ? tokenMatch[1] : undefined;
		}

		return ctxState.accessToken
			? await next()
			: ctx.throw(httpStatusCodes.UNAUTHORIZED, 'Authorization bearer token not provided or in incorrect format.');
	}
};
