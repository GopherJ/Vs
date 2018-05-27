
/**
 *
 * sankey highlight helper
 *
 * @param {*} node
 * @param {string} name
 * @return {number} opacity
 */
const highlightNodes = (node, name) => {
    let opacity = 0.3;

    if (node.name === name) {
        opacity = 1;
    }
    node.sourceLinks.forEach((link) => {
        if (link.target.name === name) {
            opacity = 1;
        }
    });
    node.targetLinks.forEach((link) => {
        if (link.source.name === name) {
            opacity = 1;
        }
    });

    return opacity;
};

export default highlightNodes;
