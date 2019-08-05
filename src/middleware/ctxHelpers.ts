import { myLogger } from '../agnosticUtilities/myLogger';
import * as util from 'util';
import { ParameterizedContext } from 'koa';

export const getHeaderValue = (context: ParameterizedContext, headerKeyToGet: string): string | undefined => {
	const headersAsRecord: Record<string, unknown> = (context.headers as Record<string, unknown>) || {};
	const headerValue = headersAsRecord[headerKeyToGet];
	if (typeof headerValue === 'string') {
		return headerValue;
	} else {
		myLogger.warn(`unexpected value for ctx.headers.${headerKeyToGet}: ${util.format(headerValue)}`);
		return undefined;
	}
};

export const getQueryValue = (context: ParameterizedContext, queryKeyToGet: string): string | undefined => {
	const queryAsRecord: Record<string, unknown> = (context.query as Record<string, unknown>) || {};
	const queryValue = queryAsRecord[queryKeyToGet];
	if (typeof queryValue === 'string') {
		return queryValue;
	} else {
		myLogger.warn(`unexpected value for ctx.query.${queryKeyToGet}: ${util.format(queryValue)}`);
		return undefined;
	}
};

export const getStateValue = (context: ParameterizedContext, stateKeyToGet: string): string | undefined => {
	const stateAsRecord: Record<string, unknown> = (context.state as Record<string, unknown>) || {};
	const stateValue = stateAsRecord[stateKeyToGet];
	if (typeof stateValue === 'string') {
		return stateValue;
	} else {
		myLogger.warn(`unexpected value for ctx.state.${stateKeyToGet}. The whole object: ${util.format(context)}`);
		return undefined;
	}
};
