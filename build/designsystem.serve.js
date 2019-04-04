import bach from 'bach';
import log from 'fancy-log';
import Clean from './scripts/clean';
import Styles from './scripts/sass';
import config from './config';
import scriptFactory from './scripts/webpack';

// revision should always be disabled, in patternlab.
config.revision = false;

const clean = new Clean();
const script = scriptFactory(config);

const build = bach.series(
	clean.dist,
	script.build,
	script.watch
);

build((err) => {
	if (err) throw err;
	log('Designsystem is done');
});
