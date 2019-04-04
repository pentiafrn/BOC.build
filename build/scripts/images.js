import Gulp from 'gulp';
import Chalk from 'chalk';
import Log from 'fancy-log';

class Images {
	constructor() {
		Log(Chalk.bgCyan.bold('Initializing Images'));

		this.copyPath = './src/project/images/**/*.*';
		this.destPath = './dist/images';
		this.copy = this.copy.bind(this);
	}

	copy() {
		Log(Chalk.cyan('Copying images'));

		return Gulp.src(this.copyPath)
			.pipe(Gulp.dest(this.destPath));
	}
}

export default Images;
