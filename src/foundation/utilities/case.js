export function camelCaseToDashCase(str) {
	return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export function dashCaseToCamelCase(str) {
	return str.replace(/\W+(.)/g, (x, chr) => chr.toUpperCase());
}
