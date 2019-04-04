import debug from 'debug';
import pubsub from '../utilities/pubsub';
import { generateId } from '../utilities/id';
import { camelCaseToDashCase, dashCaseToCamelCase } from '../utilities/case';
import { getBreakpoint } from '../utilities/screenSize';
import { debounce } from '../utilities/debounce';

const log = debug('Framework:base');

export default class BaseBehavior {
	constructor(element) {
		this.element = element;
		this.setBehaviorName();
		this.log = debug('Feature:' + this.behaviorName);
		this.setInstanceId();
		this.initEventsCache();
		this.initSubscriptionsCache();
	}

	setBehaviorName() {
		const behaviorName = camelCaseToDashCase(this.element.getAttribute('data-behavior'));
		this.behaviorName = behaviorName;
	}

	setInstanceId() {
		let behaviorAttribute = this.element.getAttribute('data-behavior');

		this.instanceId = generateId();

		if (behaviorAttribute.indexOf(this.behaviorName) > -1) {
			behaviorAttribute = behaviorAttribute.replace(
				this.behaviorName,
				this.behaviorName + '__' + this.instanceId
			);
			this.element.setAttribute('data-instance', behaviorAttribute);
		} else {
			console.error(`Unable to correctly initialize behavior "${this.behaviorName}" are you use you have used the correct case?`);
		}
	}

	initDomCache() {
		this.dom = {};

		// Filter out ref's that embedded in another instance of the same behavior.
		const elements = [
			...this.element.querySelectorAll('[data-ref^=' + this.behaviorName + ']')
		].filter((element) => {
			const closestInstance = element.closest('[data-behavior*="' + this.behaviorName + '"]');
			return closestInstance === this.element;
		});

		log('initDomCache elements:', elements);

		for (let a = 0; a < elements.length; a++) {
			const element = elements[a];
			const ref = element.getAttribute('data-ref');
			const key = dashCaseToCamelCase(ref).split('__')[1];

			if (key) {
				this.dom[key] = element;
			} else {
				// eslint-disable-next-line no-console
				console.error('DOM element cannot be correctly cached, have you used the correct pattern? Reference "' + ref + '" is expected to have the format "behavior-name__element-name"');
			}
		}
	}

	initEventsCache() {
		this.events = {};
	}

	publishBreakpointOnResize(delay = 250) {
		this.breakpoint = getBreakpoint();
		this.publish('SITE.BREAKPOINT', this.breakpoint);

		const debouncedGetBreakpoint = debounce(() => {
			const newBreakPoint = getBreakpoint();
			if (this.breakpoint !== newBreakPoint) {
				this.publish('SITE.BREAKPOINT', newBreakPoint);
				this.breakpoint = newBreakPoint;
			}
		}, delay);

		window.addEventListener('resize', debouncedGetBreakpoint);
	}

	addEventListener(element, event, fn) {
		this.events[event] = fn;
		element.addEventListener(event.split('.')[0], this.events[event]);
	}

	removeEventListener(element, event) {
		element.removeEventListener(event.split('.')[0], this.events[event]);
		this.events[event] = null;
		delete this.events[event];
	}

	initSubscriptionsCache() {
		this.subscriptions = {};
	}

	// eslint-disable-next-line class-methods-use-this
	publish(topic, obj) {
		pubsub.publish(topic, obj);
	}

	subscribe(topic, fn) {
		this.subscriptions[topic] = fn;
		pubsub.subscribe(topic, fn);
	}

	unsubscribe(topic) {
		pubsub.unsubscribe(topic, this.subscriptions[topic]);
		this.subscriptions[topic] = null;
		delete this.subscriptions[topic];
	}

	static findInstance(targetElement, behaviorName) {
		const rootElement = targetElement.closest(
			`[data-behavior${behaviorName ? `=${behaviorName}` : ''}]`
		);
		if (!rootElement) {
			return null;
		}
		return BaseBehavior.instances.find(instance => instance.element === rootElement);
	}
}

BaseBehavior.instances = [];
