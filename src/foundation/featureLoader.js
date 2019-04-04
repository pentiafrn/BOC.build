import debug from 'debug';
import pubsub from './utilities/pubsub';
import BaseBehavior from './base/base'; // eslint-disable-line no-unused-vars

const log = debug('Framework:FeatureLoader');

export function initBehaviors({ context = document } = {}) {
	const elements = [...context.querySelectorAll('[data-behavior]')];

	window.features = window.features || {
		behaviors: {},
		behaviorInstances: {},
		dom: {},
	};

	window.features.dom.body = document.querySelector('body');

	// Add context element itself to array if behavior present
	if (context.hasAttribute && context.hasAttribute('data-behavior')) {
		elements.unshift(context);
	}

	for (let a = 0; a < elements.length; a++) {
		const element = elements[a];

		// Get defer type (if any)
		const deferType = element.getAttribute('data-defer-init');

		// If we defer initialization unless element is scrolled to:
		if (deferType === 'scroll') {
			pubsub.publish('/scrollHandler/bind', {
				element,
				callback: () => {
					element.removeAttribute('data-defer-init');
					initBehaviors({ context: element });
				},
			});
			// eslint-disable-next-line no-continue
			continue;
		}

		// If not deferred, init behaviors
		const behaviorAttribute = element.getAttribute('data-behavior');
		const behaviors = behaviorAttribute.split(' ');

		for (let b = 0; b < behaviors.length; b++) {
			const behaviorPath = behaviors[b].indexOf('/') === -1 ? `${behaviors[b]}/${behaviors[b]}` : behaviors[b];

		import(`../feature/${behaviorPath}.js`)
			.then(({ default: Component }) => {
				log(`loaded ${behaviorPath}`, element);
				element.component = new Component(element);
				const behaviorInstance = element.component;
				window.features = window.features || {
					behaviors: {},
					behaviorInstances: {},
					dom: {},
				};
				window.features.behaviorInstances[behaviorInstance.instanceId] = behaviorInstance;
				BaseBehavior.instances.push(behaviorInstance);
			})
			.catch((err) => {
				log(`Failed to load ${behaviorPath}`, err);
				throw err;
			});
		}
	}
}

export function destroyBehaviors({ context = null, destroyInstances = true } = {}) {
	if (context) {
		const elements = [...context.querySelectorAll('[data-behavior][data-instance]')];

		// Add context element itself to array if behavior present
		if (context.hasAttribute &&
			context.hasAttribute('data-behavior') &&
			context.hasAttribute('data-instance')
		) {
			elements.unshift(context);
		}

		for (let a = 0; a < elements.length; a++) {
			const element = elements[a];
			const instanceAttribute = element.getAttribute('data-instance');
			const instances = instanceAttribute.split(' ');

			for (let b = 0; b < instances.length; b++) {
				const instanceName = instances[b];
				const instanceId = instanceName.split('__')[1];
				const windowInstances = window.features.behaviorInstances;

				if (instanceId && destroyInstances) {
					BaseBehavior.instances = BaseBehavior.instances
						.filter(instance => instance === windowInstances[instanceId]);
					if (windowInstances[instanceId].cleanup) {
						windowInstances[instanceId].cleanup();
					}
					windowInstances[instanceId] = null;
					delete windowInstances[instanceId];
				}
			}
		}
	} else {
		// eslint-disable-next-line no-console
		console.error('To destroy behaviors you must provide a context to the function in the form "destroyBehaviors(domElement)"');
	}
}

export function resetBehaviorNames({ context = null } = {}) {
	if (context) {
		destroyBehaviors({
			context,
			destroyInstances: false,
		});
	} else {
		// eslint-disable-next-line no-console
		console.error('To reset behavior names you must provide a context to the function in the form "destroyBehaviors(domElement)"');
	}
}

export function cleanupBehaviors({ context = document } = {}) {
	Object.keys(window.features.behaviorInstances).forEach((instanceId) => {
		const element = context.querySelector(`[data-instance*=__${instanceId}]`);

		if (!element) {
			window.features.behaviorInstances[instanceId].cleanup();
			window.features.behaviorInstances[instanceId] = null;
			delete window.features.behaviorInstances[instanceId];
		}
	});
}

initBehaviors();
