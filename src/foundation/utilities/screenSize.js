export const defaultWidths = {
	sm: 768,
	md: 1024,
	lg: 1280,
	xl: 1400
};

// function :: String -> ?Object -> Boolean
export default (size, widths = defaultWidths) => {
	if (typeof size !== 'string') {
		throw new Error('size must be a string');
	} else if (!Object.prototype.hasOwnProperty.call(widths, size)) {
		throw new Error(`size must be one of: ${Object.keys(widths).join(', ')}`);
	}
	return window.innerWidth < widths[size];
};

// getBreakpoint :: Void -> String
export const getBreakpoint = () =>
	window
		.getComputedStyle(document.querySelector('body'), ':before')
		.getPropertyValue('content')
		.replace(/"/g, '');
