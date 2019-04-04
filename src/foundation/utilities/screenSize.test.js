import screenSize, { defaultWidths, getBreakpoint } from './screenSize';

describe('utility/screenSize', () => {
	it('checks if the `size` parameter has a proper type and value', () => {
		expect(() => screenSize('md')).not.toThrow();
		expect(() => screenSize('xl')).not.toThrow();
		expect(() => screenSize(1)).toThrow();
		expect(() => screenSize('hello')).toThrow();
	});

	it('checks the screen size', () => {
		const result = screenSize('lg');
		expect(result).toBe(true);
	});

	it('checks screen breakpoint', () => {
		const result = getBreakpoint();
		const breakpoints = Object.keys(defaultWidths);
		expect(typeof result).toBe('string');
		expect(result).toEqual(''); // since there's no window in Node context
		expect(breakpoints).toContain('sm');
		expect(breakpoints).toContain('md');
		expect(breakpoints).toContain('lg');
		expect(breakpoints).toContain('xl');
	});
});
