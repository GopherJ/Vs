/**
 *
 * @param data
 */
const groupBy = (data) => {
    const results = {};
    for (let i = 0, l = data.length; i < l; i += 1) {
        const item = data[i];
        if (!item.group) {
            continue;
        }

        if (results[item.group]) {
            results[item.group].push(item);
        }

        else {
            results[item.group] = [item];
        }
    }

    return results;
};

export default groupBy;
