import * as Router from 'koa-router';

/**
 * Add cache busting headers
 * Necessary to fix an IE Edge issue we encountered
 * @see {@link(https://stackoverflow.com/questions/5017454/make-ie-to-cache-resources-but-always-revalidate/5084395#5084395)}
 * @param ctx
 * @param next
 */
export const cacheBuster: Router.IMiddleware = async (ctx, next) => {
	ctx.set({
		'Cache-Control': 'must-revalidate, private',
		Expires: '-1',
		'Last-Modified': new Date().toString(),
	});
	await next();
};
