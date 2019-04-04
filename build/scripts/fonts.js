import Gulp from 'gulp';
import Chalk from 'chalk';
import Log from 'fancy-log';

class Fonts {
	constructor() {
		Log(Chalk.bgCyan.bold('Initializing Fonts'));

		this.srcPath = './src/project/fonts/*.{eot,ttf,woff,woff2,svg}';
		this.distPath = './dist/fonts';

		this.copy = this.copy.bind(this);
	}

	copy() {
		Log(Chalk.cyan('Copying fonts for build'));

		return Gulp.src(this.srcPath)
			.pipe(Gulp.dest(this.distPath));
	}

}

export default Fonts;
