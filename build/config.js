import path from 'path';
import argv from './utils/argv';

export default {
	production: argv.production,
	mode: argv.production ? 'production' : 'development',
	revision: argv.revision,
	style: {
		srcPath: './src/project/styles/*.scss',
		destPath: './dist/css',
		revPath: './dist/css/*.css'
	},
	script: {
		distDir: path.resolve(__dirname, '../dist/js'),
		publicPath: '/statics/build/dist/js/'
	},
	// Sub Resource Intregitry
	sri: {
		hashes: ['sha256', 'sha384', 'sha512']
	}
};
