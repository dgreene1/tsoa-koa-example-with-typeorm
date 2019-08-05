import { execSync } from 'child_process';
import * as fs from 'fs';

// tslint:disable-next-line: no-console
console.log('...');
// tslint:disable-next-line: no-console
console.log('Starting the process of checking if a migration script exists for the current schema...');

const failureArtifactName = 'FAILURE--THIS_PROVES_A_DEV_FORGOT_TO_GENERATE_AND_APPLY_A_SCHEMA';

const walk = (dir: string): string[] => {
	let results: string[] = [];
	const list = fs.readdirSync(dir);
	list.forEach(file => {
		file = dir + '/' + file;
		const stat = fs.statSync(file);
		if (stat && stat.isDirectory()) {
			/* Recursively iterate into a subdirectory */
			results = results.concat(walk(file));
		} else {
			/* Is a file */
			results.push(file);
		}
	});
	return results;
};

const findFileInNestedPath = (startingDir: string, fileNameSection: string): string => {
	const paths = walk(startingDir);

	const results = paths.filter(aPath => aPath.includes(fileNameSection));

	if (results.length === 0) {
		throw new Error(`Could not find a file containing ${fileNameSection} within the ${startingDir} directory`);
	}
	if (results.length > 1) {
		throw new Error(`Did not expect to find more than one file. However, we found: ${results.join(' and ')}`);
	}
	return results[0];
};

const stdout = execSync(
	`ts-node ./node_modules/typeorm/cli migration:generate --dir ./src/db/migration --name ${failureArtifactName}`,
);

const outputAStr = stdout.toString();

if (!outputAStr.includes('No changes in database schema were found')) {
	const generalErrMsg =
		'Error: The developer either \n * forgot to create a migration script \n * or forgot to run the existing migrations';
	const errorMsg = outputAStr.includes('generated successfully')
		? `${generalErrMsg}\n * and/or there were other issues: ${outputAStr}`
		: generalErrMsg;

	// Now delete the artifact since you don't want that to hang around
	try {
		const pathOfArtifact = findFileInNestedPath('.', failureArtifactName);
		fs.unlinkSync(pathOfArtifact);
	} catch (err) {
		// tslint:disable-next-line: no-console
		console.warn('Unable to cleanup the artifact due to this error: ' + err);
	}
	throw new Error(errorMsg);
} else {
	// tslint:disable-next-line: no-console
	console.log('Success: Schemas are up-to-date with the code.');
}
