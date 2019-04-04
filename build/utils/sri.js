import crypto from 'crypto';

/**
 * See {@link https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity|Subresource Integrity} at MDN
 *
 * @param  {array} hashes - The algorithms you want to use when hashing `content`
 * @param  {string} content - File contents you want to hash
 * @return {string} SRI hash
 */
function getSRIHash(hashes, content) {
	return Array.isArray(hashes) ? hashes.map((hash) => {
		const integrity = crypto.createHash(hash).update(content, 'utf-8').digest('base64');

		return `${hash}-${integrity}`;
	}).join(' ') : '';
}

export default getSRIHash;
