import murmurHash3 from 'murmurhash3js';

/**
 *
 * create a 129bit hex format hash for css selector or others
 *
 * @param d
 * @return {String}
 */

const hash = d => 'x' + murmurHash3.x64.hash128(d);

export default hash;


