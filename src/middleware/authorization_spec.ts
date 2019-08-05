describe('temp', () => {
	it('true', () => {
		console.warn('TODO: Comment these tests back in');
	});
});
// /* tslint:disable:no-unused-expression */

// import * as chai from 'chai';
// import * as sinon from 'sinon';
// import * as sinonChai from 'sinon-chai';

// import { ensureBearerToken } from './authorization';

// const expect = chai.expect;
// chai.use(sinonChai);

// describe('authorization middleware', () => {
// 	afterEach(() => sinon.restore());

// 	describe('ensureBearerToken', () => {
// 		it('rejects if there is no authorization header and no token query param', async () => {
// 			const ctx = { headers: {}, state: {}, throw: sinon.spy() };
// 			const next = sinon.spy();
// 			await ensureBearerToken(ctx as any, next);
// 			expect(ctx.throw).to.have.been.calledWith(401, 'Authorization bearer token not provided or in incorrect format.');
// 			expect(next).not.to.have.been.called;
// 		});

// 		it('rejects if the auth header is blank', async () => {
// 			const ctx = { headers: { authorization: '' }, state: {}, throw: sinon.spy() };
// 			const next = sinon.spy();
// 			await ensureBearerToken(ctx as any, next);
// 			expect(ctx.throw).to.have.been.calledWith(401, 'Authorization bearer token not provided or in incorrect format.');
// 			expect(next).not.to.have.been.called;
// 		});

// 		it('rejects if the auth header is the incorrect format', async () => {
// 			const ctx = { headers: { authorization: 'argle bargle' }, state: {}, throw: sinon.spy() };
// 			const next = sinon.spy();
// 			await ensureBearerToken(ctx as any, next);
// 			expect(ctx.throw).to.have.been.calledWith(401, 'Authorization bearer token not provided or in incorrect format.');
// 			expect(next).not.to.have.been.called;
// 		});

// 		it('rejects if the token param is blank and header is missing', async () => {
// 			const ctx = { query: { token: '' }, state: {}, throw: sinon.spy() };
// 			const next = sinon.spy();
// 			await ensureBearerToken(ctx as any, next);
// 			expect(ctx.throw).to.have.been.calledWith(401, 'Authorization bearer token not provided or in incorrect format.');
// 			expect(next).not.to.have.been.called;
// 		});

// 		it('rejects if the token param is the incorrect format', async () => {
// 			const ctx = { query: { token: 13 }, state: {}, throw: sinon.spy() };
// 			const next = sinon.spy();
// 			await ensureBearerToken(ctx as any, next);
// 			expect(ctx.throw).to.have.been.calledWith(401, 'Authorization bearer token not provided or in incorrect format.');
// 			expect(next).not.to.have.been.called;
// 		});

// 		it('calls next if the authorization header looks good', async () => {
// 			const ctx = { headers: { authorization: 'Bearer 1234' }, state: { accessToken: null }, throw: sinon.spy() };
// 			const next = sinon.spy();
// 			await ensureBearerToken(ctx as any, next);
// 			expect(ctx.throw).not.to.have.been.called;
// 			expect(ctx.state.accessToken).to.equal('1234');
// 			expect(next).to.have.been.calledWith();
// 		});

// 		it('calls next if the authorization header looks good as query param', async () => {
// 			const ctx = { query: { token: '1234' }, state: { accessToken: null }, throw: sinon.spy() };
// 			const next = sinon.spy();
// 			await ensureBearerToken(ctx as any, next);
// 			expect(ctx.throw).not.to.have.been.called;
// 			expect(ctx.state.accessToken).to.equal('1234');
// 			expect(next).to.have.been.calledWith();
// 		});

// 		it('prefers auth header over query params', async () => {
// 			const ctx = {
// 				headers: { authorization: 'Bearer 1234' },
// 				query: { token: '456' },
// 				state: { accessToken: null },
// 				throw: sinon.spy(),
// 			};
// 			const next = sinon.spy();
// 			await ensureBearerToken(ctx as any, next);
// 			expect(ctx.throw).not.to.have.been.called;
// 			expect(ctx.state.accessToken).to.equal('1234');
// 			expect(next).to.have.been.calledWith();
// 		});

// 		it('calls next for OPTIONS requests', async () => {
// 			const ctx = { method: 'OPTIONS', throw: sinon.spy() };
// 			const next = sinon.spy();
// 			await ensureBearerToken(ctx as any, next);
// 			expect(ctx.throw).not.to.have.been.called;
// 			expect(next).to.have.been.calledWith();
// 		});
// 	});
// });
