import bach from 'bach';
import log from 'fancy-log';
import Clean from './scripts/clean';
import config from './config';
import scriptFactory from './scripts/webpack';

// revision should always be disabled, in patternlab.
config.revision = false;

const clean = new Clean();
const script = scriptFactory(config);

const build = bach.series(
	clean.dist,
	bach.parallel(
		script.build
	),
);

build((err) => {
	if (err) throw err;
	log('Designsystem is done');
});
