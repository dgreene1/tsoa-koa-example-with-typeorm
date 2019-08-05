describe('temp', () => {
	it('true', () => {
		console.warn('TODO: Comment these tests back in');
	});
});

// import { log } from '../util/log';
// import * as middlware from './404-logger';

// describe('middleware/404-logger', () => {
// 	let boom_spy: sinon.SinonSpy;
// 	let ctx: any;
// 	let log_mock: sinon.SinonMock;

// 	beforeEach(() => {
// 		boom_spy = sinon.spy(Boom, 'notFound');
// 		log_mock = sinon.mock(log);
// 		ctx = {
// 			status: 200,
// 		} as any;
// 	});

// 	afterEach(() => {
// 		sinon.restore();
// 	});

// 	it('logs the error if status is 404', async () => {
// 		ctx.status = 404;
// 		log_mock.expects('error').returns(null);

// 		await middlware.fourOhFourLogger(ctx, {} as any);

// 		expect(boom_spy).to.have.been.called;
// 		log_mock.verify();
// 	});

// 	it('doesnt log anything if the status NOT 404', async () => {
// 		ctx.status = 200;
// 		log_mock.expects('error').never();

// 		await middlware.fourOhFourLogger(ctx, {} as any);

// 		expect(boom_spy).not.to.have.been.called;
// 		log_mock.verify();
// 	});
// });
