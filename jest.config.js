module.exports = {
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
	},
	testEnvironment: 'node',
	testRegex: '.*(_spec|.spec).*',
	testPathIgnorePatterns: ['/lib/', '/build/', '/node_modules/'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	collectCoverage: false, // Set to false due to https://github.com/kulshekhar/ts-jest/issues/917
	collectCoverageFrom: [
		'**/*.{ts,tsx}',
		'!**/flClientLibraries/**/*', // This shouldn't be covered because its supposed to just be an API client library with minimal functionality of it's own. Read more at: https://web.archive.org/web/20180826081843/http://columwalsh.ie/?p=6
		'!**/*_spec*',
		'!**/*.spec*',
		'!**/*.config.*',
		'!**/build/**',
		'!**/coverage',
		'!**/serverless',
		'!**/node_modules/**',
		'!**/vendor/**',
	],
	errorOnDeprecated: true,
};
