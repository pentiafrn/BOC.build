class PubSub {
	constructor() {
		this.subscriptions = {};
	}

	publish(topic, ...args) {
		if (this.subscriptions[topic]) {
			// eslint-disable-next-line no-restricted-syntax
			for (const fn of this.subscriptions[topic]) {
				fn(...args);
			}
		}
	}

	subscribe(topic, fn) {
		this.subscriptions[topic] = this.subscriptions[topic] || [];
		this.subscriptions[topic].push(fn);
	}

	unsubscribe(topic, fn) {
		if (this.subscriptions[topic]) {
			this.subscriptions[topic].forEach((value, index) => {
				if (value === fn) {
					this.subscriptions[topic].splice(index, 1);
				}
			});
		}
	}
}

const pubsub = new PubSub();

export default pubsub;
