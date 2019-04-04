import gulp from 'gulp';
import chalk from 'chalk';
import log from 'fancy-log';
import sprite from 'gulp-svg-sprite';
import min from 'gulp-svgmin';
import GInject from 'gulp-inject';
import debug from 'gulp-debug';

class Svg {
	constructor() {
		log(chalk.bgCyan.bold('Initializing Svg'));

		this.baseDir = './src/project/sprites'; // <-- Set to your SVG base directory
		this.svgGlob = '*.svg'; // <-- Glob to match your SVG files
		this.outDir = './dist/sprites'; // <-- Main output directory
		this.svgPath = './dist/sprites/**/*.svg';
		this.config = {
			log: 'verbose',
			svg: {
				xmlDeclaration: false
			},
			mode: {
				symbol: true
			}
		};
		this.sprite = this.sprite.bind(this);
		this.inject = this.inject.bind(this);
		this.injectForPatternlab = this.injectForPatternlab.bind(this);
	}

	sprite() {
		log(chalk.cyan('Building Svg Sprite'));

		return new Promise((resolve, reject) => {
			const stream = gulp.src(this.svgGlob, { cwd: this.baseDir })
				.pipe(min())
				.pipe(sprite(this.config)).on('error', (error) => { log(error); })
				.pipe(gulp.dest(this.outDir));

			stream.on('end', () => {
				log('stream ended');
				resolve();
			});
			stream.on('error', () => {
				log('stream failed');
				reject();
			});
		});
	}

	injectForPatternlab() {
		// We inject the SVG sprite in Patternlabs patterns so we can see it when developing
		log(chalk.cyan('Injecting Svg for Patternlab'));

		return new Promise((resolve, reject) => {
			const stream = gulp.src('./source/_patterns/**/*.mustache')
				.pipe(GInject(gulp.src(this.svgPath).pipe(debug({ title: 'Inject:' })), {
					name: 'body',
					transform(filePath, file) {
						// return file contents as string
						return file.contents.toString('utf8');
					}
				}))
				.pipe(gulp.dest('./source/_patterns'));

			stream.on('end', () => {
				log('stream ended');
				resolve();
			});
			stream.on('error', () => {
				log('stream failed');
				reject();
			});
		});
	}

	inject() {
		log(chalk.cyan('SVG: Injecting Sprite'));

		return new Promise((resolve, reject) => {
			const stream = gulp.src('./www/**/*.html')
				.pipe(GInject(gulp.src(this.svgPath).pipe(debug({ title: 'Inject:' })), {
					name: 'body',
					transform(filePath, file) {
						// return file contents as string
						return file.contents.toString('utf8');
					}
				}))
				.pipe(gulp.dest('./www'));

			stream.on('end', () => {
				log('stream ended');
				resolve();
			});
			stream.on('error', () => {
				log('stream failed');
				reject();
			});
		});
	}
}

export default Svg;
