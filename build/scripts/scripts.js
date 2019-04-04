import fs from 'fs';
import gulp from 'gulp';
import chalk from 'chalk';
import log from 'fancy-log';
import GInject from 'gulp-inject';
import debug from 'gulp-debug';

class Scripts {
	constructor() {
		log(chalk.bgCyan.bold('Initializing Scripts'));

		this.inject = this.inject.bind(this);
	}

	inject() {
		log(chalk.cyan('Scripts: Injecting Scripts'));

		const stream = gulp.src('./www/**/*.html')
			.pipe(GInject(gulp.src( './dist/js/behaviors-*.js', {
				read: false
			}).pipe(debug({ title: 'Inject:' })), {
				name: 'body',
				relative: false
			}))
			.pipe(gulp.dest('./www'));

		return stream;
	}
}

export default Scripts;
