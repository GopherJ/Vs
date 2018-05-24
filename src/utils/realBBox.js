/**
 *
 * @param g
 * @returns {{x: *, y: *, width: *, height: *}}
 */
const realBBox = (g) => {
    const pos = g.node().getBBox(),
        transform = g.attr('transform'),
        [translateX, translateY] = transform !== null
            ? transform.split(/\(|\)|\,/).slice(1, 3).map(x => parseFloat(x))
            : [0, 0];

    return {
        x: pos.x + translateX,
        y: pos.y + translateY,
        width: pos.width,
        height: pos.height
    };
};

export default realBBox;
