const fs = require('fs');
const path = require('path');

/**
 * Since we aren't in a .ts file we need to check that envKey was spelled correctly
 * @param {string} keyName
 */
function assertPropertyKeyExists(objToCheckItOn, keyName) {
	var value = objToCheckItOn[keyName];
	if (!value) {
		throw new Error(
			'Could not find a value for ' + keyName + ' and it is required. <-- consider checking the spelling.',
		);
	}
	return value;
}

const nodeEnvName = assertPropertyKeyExists(process.env, 'NODE_ENV');

const jsonEnvFilePath = path.join(__dirname, 'src', 'config', nodeEnvName.toLowerCase() + '.json');
if (!fs.existsSync(jsonEnvFilePath)) {
	throw new Error(`Could not find a config file at ${jsonEnvFilePath}`);
}
const jsonForEnv = JSON.parse(fs.readFileSync(jsonEnvFilePath).toString());

var baseORMConfig = {
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: assertPropertyKeyExists(jsonForEnv, 'TYPEORM_USERNAME'),
	password: assertPropertyKeyExists(jsonForEnv, 'TYPEORM_PASSWORD'),
	database: assertPropertyKeyExists(jsonForEnv, 'TYPEORM_DATABASE'),
	logging: jsonForEnv.TYPEORM_LOGGING || 'warn',
	entities: [__dirname + '/src/db/entities/*{.js,.ts}'], // Warning: at runtime we will replace this glob inside connectionCreator.ts. Read more at: https://github.com/typeorm/typeorm/issues/3629#issuecomment-516067546
	migrations: [__dirname + '/src/db/migrations/*{.js,.ts}'],
	subscribers: [__dirname + '/src/db/subscribers/*{.js,.ts}'],
	migrationsRun: true,
};

module.exports = baseORMConfig;
