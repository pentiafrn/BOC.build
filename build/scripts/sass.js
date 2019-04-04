import fs from 'fs';
import gulp from 'gulp';
import Sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import chalk from 'chalk';
import log from 'fancy-log';
import GInject from 'gulp-inject';
import chokidar from 'chokidar';
import rev from 'gulp-rev-plus';
import debug from 'gulp-debug';
import Del from 'del';
import Paths from 'vinyl-paths';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import getSRIHash from '../utils/sri';

class Styles {
	constructor(options) {
		log(chalk.bgCyan.bold('Initializing Sass'));

		if (!options) {
			log(chalk.red('You must provide options'));
		}
		this.revPath = options ? options.style.revPath : undefined;
		this.srcPath = options ? options.style.srcPath : undefined;
		this.destPath = options ? options.style.destPath : undefined;
		this.sriHashes = options ? options.sri.hashes : undefined;

		this.revOptions = {
			forceRev: options.revision ? false : 'dev'
		};

		this.build = this.build.bind(this);
		this.inject = this.inject.bind(this);
		this.revision = this.revision.bind(this);
		this.watch = this.watch.bind(this);
	}

	build() {
		log(chalk.cyan('Sass: Building Styles'));

		return new Promise((resolve, reject) => {
			const stream = gulp.src(this.srcPath)
				.pipe(sourcemaps.init())
				.pipe(Sass().on('error', Sass.logError))
				.pipe(
					postcss([
						autoprefixer({
							browsers: ['last 2 versions', 'IE >= 9']
						})
					])
				)
				.pipe(sourcemaps.write())
				.pipe(gulp.dest(this.destPath));

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
		log(chalk.cyan('Sass: Injecting Styles'));

		const stream = gulp.src('./www/**/*.html')
			.pipe(GInject(gulp.src(this.revPath, {
				read: false
			}).pipe(debug({ title: 'Inject:' })), {
				name: 'head',
				relative: false
			}))
			.pipe(gulp.dest('./www'));

		return stream;
	}

	revision() {
		log(chalk.cyan('Sass: Revisioning files'));

		return new Promise((resolve, reject) => {
			const stream = gulp.src(this.revPath)
				.pipe(debug({
					title: 'Revving:'
				}))
				.pipe(Paths(Del))
				.pipe(rev(this.revOptions))
				.pipe(debug({
					title: 'Revved:'
				}))
				.pipe(gulp.dest('./dist/css'))
				.pipe(rev.manifest({
					transformer: {
						stringify: (manifest) => {
							const intregrityManifest = {};

							Object.entries(manifest).forEach(
								([key, value]) => {
									const fileContent = fs.readFileSync('dist/css/' + value, 'utf8');
									const integrityHashes = getSRIHash(this.sriHashes, fileContent);

									intregrityManifest[key] = {
										src: value,
										integrity: integrityHashes
									};
								}
							);

							const absPaths = JSON.stringify(intregrityManifest, null, '\t').replace(
								/"src": ?"(.*)/gim,
								'"src": "/dist/css/$1'
							);

							return absPaths;
						}
					}
				}))
				.pipe(gulp.dest('./dist/css'));

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

	watch() {
		const watcher = chokidar.watch('./src/**/*.scss', {
			persistent: true
		});

		// Add event listeners.
		watcher
			.on('add', path => log(`Watcher: File ${path} has been added`))
			.on('change', (path) => {
				log(`Watcher: File ${path} has been changed`);
				this.build();
			})
			.on('unlink', path => log(`Watcher: File ${path} has been removed`));
	}
}

export default Styles;
