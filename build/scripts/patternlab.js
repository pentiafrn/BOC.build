/* eslint class-methods-use-this: 0 */

import Chalk from 'chalk';
import Log from 'fancy-log';
import Gulp from 'gulp';

const config = require('../patternlab-config.json');
const PatternLab = require('@pattern-lab/core')(config);

class Patternlab {
	constructor(options) {
		this.options = options;
		Log(Chalk.bgCyan.bold('Initializing Patternlab'));

		this.serve = this.serve.bind(this);

	}

	serve() {
		Log(Chalk.cyan('Patternlab: Starting server'));

		return PatternLab.server.serve({
			cleanPublic: true,
			watch: true
		}).then(() => {
			PatternLab.events.on('patternlab-pattern-asset-change', (data) => {
				Log(data); // {file: 'path/to/file.css', dest: 'path/to/destination'}
				PatternLab.server.refreshCSS();
			});

			PatternLab.events.on('patternlab-pattern-change', (data) => {
				Log(data); // {file: 'path/to/file.ext'}
				PatternLab.patternsonly({
					cleanPublic: false
				}).then(() => {
					PatternLab.server.reload();
				});
			});

			PatternLab.events.on('patternlab-global-change', (data) => {
				Log(data); // {file: 'path/to/file.ext'}
			});
		});
	}

	build() {
		return PatternLab.build({
			cleanPublic: true
		}).then(() => {
			Log(Chalk.bgCyan.bold('Patternlab: Build done'));
		});
	}
}

export default Patternlab;
