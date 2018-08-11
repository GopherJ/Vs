/**
 *
 * calculate the real bbox which includes transform
 *
 * @param g
 * @return {SVGRect}
 */
const realBBox = g => {
    const rect = g.node().getBBox(),
        t = g.attr('transform'),
        [tx, ty] = t !== null
            ? t.split(/\(|\)|\,/).slice(1, 3).map(x => parseFloat(x))
            : [0, 0];

    return {
        x: rect.x + tx,
        y: rect.y + ty,
        width: rect.width,
        height: rect.height
    };
};

export default realBBox;
