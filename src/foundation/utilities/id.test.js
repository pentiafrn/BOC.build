import { generateId } from './id';

describe('utility/id', () => {
	it('generates 6-character string ID', () => {
		const result = generateId();
		expect(typeof result).toBe('string');
		expect(result).toHaveLength(6);
	});
});
