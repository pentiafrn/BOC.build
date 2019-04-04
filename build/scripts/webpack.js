import fs from 'fs';
import webpack from 'webpack';
import Manifest from 'webpack-assets-manifest';
import log from 'fancy-log';

function writeStatsToFile(stats) {
	return fs.writeFileSync(
		'./dist/webpack-stats.json',
		JSON.stringify(
			stats.toJson({
				chunkModules: true
			}),
			null,
			'\t'
		)
	);
}

export default function scriptFactory(options) {
	const webpackConfig = {
		mode: options.mode,
		devtool: "source-map",
		output: {
			path: options.script.distDir,
			filename: options.revision ? '[name]-[chunkhash:8].pkg.js' : '[name].pkg.js',
			publicPath: options.script.publicPath
		},
		entry: {
			behaviors: './src/foundation/featureLoader'
		},
		resolve: {
			alias: {
				swiper: 'swiper/dist/js/swiper.js', // Swiper is not a compiled es6 module, so we import the UMD version instead.
			}
		},
		module: {
			rules: [{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				options: {
					cacheDirectory: true
				}
			}]
		},
		plugins: [
			new Manifest({
				output: 'rev-manifest.json',
				integrity: true, // We want SRI hashes
				publicPath: '/dist/js/'
			})
		]
	};

	function watchTask() {
		const webpackCompiler = webpack(webpackConfig);

		webpackCompiler.watch({
			ignored: [
				'**/*.scss',
				'**/*.map',
				'**/rev-manifest.json',
				'**/rev-manifest-component-css.json',
				'**/*.css'
			]
		}, (err, stats) => {
			if (err) {
				console.error(err.stack || err);
				if (err.details) {
					console.error(err.details);
				}
				return;
			}

			const info = stats.toJson();
			if (stats.hasErrors()) {
				console.error(info.errors);
			}
			if (stats.hasWarnings()) {
				console.warn(info.warnings);
			}

			// Print watch/build result here...
			log('[webpack]', stats.toString({
				colors: true,
				exclude: /.map$/gi
			}));
		});
	}

	function scriptTask(done) {
		webpack(webpackConfig, (err, stats) => {
			if (err) {
				console.error(err.stack || err);
				if (err.details) {
					console.error(err.details);
				}
				return;
			}

			const info = stats.toJson();
			if (stats.hasErrors()) {
				console.error(info.errors);
			}
			if (stats.hasWarnings()) {
				console.warn(info.warnings);
			}

			writeStatsToFile(stats);

			log(stats.toString({
				colors: true
			}));

			done();
		});
	}

	return {
		build: scriptTask,
		watch: watchTask
	};
}
