import * as d3 from 'd3';
import { isFunction } from 'lodash';
/**
 *
 * draw reference line
 *
 * @param g
 * @param x
 * @param h
 * @param overlayWidth
 * @param referenceLineColor
 * @param referenceLineWidth
 * @param cb
 */
const drawReferenceX = (g, x, h, overlayWidth, referenceLineColor, referenceLineWidth, cb) => {
    let overlaySelection = g.select('.overlay'),
        lineReferenceSelection = g.select('.line--reference');

    if (!lineReferenceSelection.empty()) lineReferenceSelection.remove();
    if (!overlaySelection.empty()) overlaySelection.remove();

    g
        .append('line')
        .attr('pointer-events', 'none')
        .attr('class', 'line--reference')
        .attr('x1', x)
        .attr('x2', x)
        .attr('y2', h)
        .attr('stroke', referenceLineColor)
        .attr('stroke-width', referenceLineWidth);

    overlaySelection = g
        .append('rect')
        .attr('class', 'overlay')
        .attr('pointer-events', 'all')
        .attr('fill', 'none')
        .attr('x', x - overlayWidth / 2)
        .attr('y', 0)
        .attr('width', overlayWidth)
        .attr('height', h)
        .attr('cursor', 'move');

    const onDrag = () => {
        const n = d3.event.x,
            o = +overlaySelection.attr('x') + overlayWidth / 2;

        if (isFunction(cb)) cb(n, o);
    };

    overlaySelection
        .call(d3.drag().on('drag', onDrag));
};

export {
    drawReferenceX
};
