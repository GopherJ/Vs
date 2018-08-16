import * as d3 from 'd3';
/**
 *
 * draw reference line
 *
 * @param g
 * @param x
 * @param clipPathId
 * @param h
 * @param overlayWidth
 * @param referenceLineColor
 * @param referenceLineWidth
 * @param ondrag
 */
const drawReferenceX = (g, x, clipPathId, h, overlayWidth, referenceLineColor, referenceLineWidth, ondrag) => {
    let overlaySelection = g.select('.overlay'),
        lineReferenceSelection = g.select('.line--reference');
    /*
        ToDo: reuse the reference line
     */

    // if (!lineReferenceSelection.empty()) {
    //     lineReferenceSelection
    //         .attr('x1', x)
    //         .attr('x2', x);
    // } else {
    //     lineReferenceSelection = g
    //         .append('line')
    //         .attr('pointer-events', 'none')
    //         .attr('class', 'line--reference')
    //         .attr('clip-path', `url(#${clipPathId})`)
    //         .attr('x1', x)
    //         .attr('y1', 0)
    //         .attr('x2', x)
    //         .attr('y2', h)
    //         .attr('stroke', referenceLineColor)
    //         .attr('stroke-width', referenceLineWidth);
    // }
    //
    // if (!overlaySelection.empty()) {
    //     overlaySelection
    //         .attr('x', x - overlayWidth / 2);
    // } else {
    //     overlaySelection = g.append('rect')
    //         .attr('class', 'overlay')
    //         .attr('pointer-events', 'all')
    //         .attr('clip-path', `url(#${clipPathId})`)
    //         .attr('fill', 'none')
    //         .attr('x', x - overlayWidth / 2)
    //         .attr('y', 0)
    //         .attr('width', overlayWidth)
    //         .attr('height', h)
    //         .attr('cursor', 'move');
    // }

    if (!lineReferenceSelection.empty()) lineReferenceSelection.remove();
    if (!overlaySelection.empty()) overlaySelection.remove();

    lineReferenceSelection = g
        .append('line')
        .attr('pointer-events', 'none')
        .attr('class', 'line--reference')
        .attr('clip-path', `url(#${clipPathId})`)
        .attr('x1', x)
        .attr('y1', 0)
        .attr('x2', x)
        .attr('y2', h)
        .attr('stroke', referenceLineColor)
        .attr('stroke-width', referenceLineWidth);

    overlaySelection = g
        .append('rect')
        .attr('class', 'overlay')
        .attr('pointer-events', 'all')
        .attr('clip-path', `url(#${clipPathId})`)
        .attr('fill', 'none')
        .attr('x', x - overlayWidth / 2)
        .attr('y', 0)
        .attr('width', overlayWidth)
        .attr('height', h)
        .attr('cursor', 'move');

    overlaySelection
        .call(d3.drag()
        .on('drag', () => {
            const n = d3.event.x,
                o = +overlaySelection.attr('x') + overlayWidth / 2;

            overlaySelection.attr('x', n - overlayWidth / 2);
            lineReferenceSelection.attr('x1', n).attr('x2', n);

            ondrag(n, o);
        }));
};

export {
    drawReferenceX
};
