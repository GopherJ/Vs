/**
 *
 * get all unique keys
 *
 * @param {Array} data
 * @return {Array}
 */
const GetAllKeys = (data) => [...new Set(data.map(d => d.key))];

export default GetAllKeys;
