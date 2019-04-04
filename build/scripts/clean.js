import log from 'fancy-log';
import del from 'del';
import Chalk from 'chalk';


class Clean {
	constructor() {
		log(Chalk.bgCyan.bold('Initializing Clean'));

		this.dist = this.dist.bind(this);
	}

	dist() {
		log(Chalk.cyan('Deleting dist files'));

		return del(['./dist']).then((paths) => {
			log('Deleted files and folders:\n', paths.join('\n'));
		});
	}

	www() {
		log(Chalk.cyan('Deleting www files'));

		return del(['./www']).then((paths) => {
			log('Deleted files and folders:\n', paths.join('\n'));
		});
	}
}

export default Clean;
