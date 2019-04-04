import pubsub from './pubsub';

describe('utility/pubsub', () => {
	it('checks methods of PubSub class', () => {
		const { subscribe, publish, unsubscribe } = pubsub;
		expect(typeof publish).toEqual('function');
		expect(typeof subscribe).toEqual('function');
		expect(typeof unsubscribe).toEqual('function');
	});

	it('checks subscribe method', () => {
		pubsub.subscribe('test', 9999);
		const topic = pubsub.subscriptions.test;
		expect(topic).toBeDefined();
		expect(topic.constructor.name).toBe('Array');
		expect(topic).toContain(9999);
	});

	it('checks unsubscribe method', () => {
		pubsub.unsubscribe('test', 9999);
		const topic = pubsub.subscriptions.test;
		expect(topic).toBeDefined();
		expect(topic.constructor.name).toBe('Array');
		expect(topic.length).toBe(0);
	});

	it('checks if second argument of `publish` is a function', () => {
		pubsub.subscribe('newsletter');
		expect(() => pubsub.publish('newsletter', 1)).toThrow();
	});
});
