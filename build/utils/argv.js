import yargs from 'yargs';

yargs
	.boolean('production')
	.boolean('revision')
	.default({
		production: false,
		revision: true
	});

export default yargs.argv;
