const alphabet = '23456789ABDEGJKMNPQRVWXYZ';

export function generateId(length = 6) {
	let id = '';

	for (let i = 0; i < length; i++) {
		id += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
	}

	return id;
}
