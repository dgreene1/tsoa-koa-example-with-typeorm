describe('temp', () => {
	it('true', () => {
		console.warn('TODO: Comment these tests back in');
	});
});
// /* tslint:disable:variable-name */
// import { expect } from 'chai';
// import * as sinon from 'sinon';
// import * as middlware from './cache-buster';
// import { IRouterContext } from 'koa-router';
// import * as Router from 'koa-router';

// describe('middleware/cache-buster', () => {
// 	let ctx: any;
// 	let next: any;

// 	beforeEach(() => {
// 		ctx = {
// 			headers: {},
// 			set: sinon.spy(),
// 		};
// 		next = sinon.spy();
// 	});

// 	afterEach(() => {
// 		sinon.restore();
// 	});

// 	it('adds correct headers for cache busting', async () => {
// 		await middlware.cacheBuster(ctx, next);
// 		expect(
// 			ctx.set.calledOnceWithExactly({
// 				'Cache-Control': 'must-revalidate, private',
// 				Expires: '-1',
// 				'Last-Modified': sinon.match.string, // will be date-time string
// 			}),
// 		).to.equal(true);
// 		expect(next.calledOnce).to.equal(true);
// 	});
// });
