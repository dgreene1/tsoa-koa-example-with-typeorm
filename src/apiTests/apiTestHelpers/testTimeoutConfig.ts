export const getAPITestTimeout = (): number => {
	const oneSecond = 1000;
	// tslint:disable-next-line: no-magic-numbers
	const defaultTimeoutPerTest = 5 * oneSecond;
	// tslint:disable-next-line: no-magic-numbers
	const debugTimeoutPerTest = 60 * oneSecond;

	// https://stackoverflow.com/a/45074641/706768
	const inDebugMode =
		typeof global.v8debug === 'object' ||
		/--debug|--inspect/.test(process.execArgv.join(' ')) ||
		/--debug|--inspect/.test(process.argv.join(' '));

	if (inDebugMode) {
		return debugTimeoutPerTest;
	} else {
		return defaultTimeoutPerTest;
	}
};
