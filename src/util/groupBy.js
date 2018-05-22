/**
 *
 * @param data
 * @param key
 */
const groupBy = (data, key) => {
    const results = {};
    for (let i = 0, l = data.length; i < l; i += 1) {
        const item = data[i];

        if (results[item[key]]) {
            results[item[key]].push(item);
        }

        else {
            results[item[key]] = [item];
        }
    }

    return results;
};

export default groupBy;
