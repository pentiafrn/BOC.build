import fs from 'fs';
import log from 'fancy-log';
import chalk from 'chalk';

const options = {
	finalManifest: './dist/asset-manifest.json'
};

function readManifest(manifestPath) {
	return new Promise((resolve, reject) => {
		fs.readFile(manifestPath, 'utf8', (readErr, data) => {
			let jsonData;

			if (readErr) {
				console.error(readErr);
				return reject(readErr);
			}

			try {
				jsonData = JSON.parse(data);
			} catch (parseError) {
				console.error('Parse Error: ', manifestPath, data, parseError);
				return reject(parseError);
			}

			resolve(jsonData);

			return data;
		});
	});
}

function mergeManifest(done) {
	return Promise.all([
		readManifest('./dist/css/rev-manifest.json'),
		readManifest('./dist/js/rev-manifest.json')
	]).then((values) => {
		const mergedManifest = Object.assign(...values);

		log(chalk.cyan('Writing merged assest manifest') + chalk.grey(` (${options.finalManifest})`));

		fs.writeFile(options.finalManifest, JSON.stringify(mergedManifest, null, '\t'), (err) => {
			if (err) throw err;
			done();
		});
	}).catch((err) => {
		console.error(err);
		throw err;
	});
}

export default mergeManifest;
