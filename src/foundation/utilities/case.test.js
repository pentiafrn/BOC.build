import { camelCaseToDashCase, dashCaseToCamelCase } from './case';

describe('utility/case', () => {
	it('changes camelCase to dash-case', () => {
		const result = camelCaseToDashCase('testClass');
		expect(result).toEqual('test-class');
	});

	it('changes dash-case to camelCase', () => {
		const result = dashCaseToCamelCase('test-attribute-name');
		expect(result).toEqual('testAttributeName');
	});
});
