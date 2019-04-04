import log from 'fancy-log';
import del from 'del';
import Chalk from 'chalk';


class Tidy {
	constructor() {
		log(Chalk.bgCyan.bold('Initializing Tidy'));

		this.www = this.www.bind(this);
	}

	www() {
		log(Chalk.cyan('Tidy www files'));

		return del(['./www/**/*', '!./www/gocarbonneutral', '!./www/gocarbonneutral/**/*']).then((paths) => {
			log('Deleted files and folders:\n', paths.join('\n'));
		});
	}
}

export default Tidy;
