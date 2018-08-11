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
    const overlaySelection = g.select('.overlay'),
        lineReferenceSelection = g.select('.line--reference');

    if (!overlaySelection.empty()) overlaySelection.remove();
    if (!lineReferenceSelection.empty()) lineReferenceSelection.remove();

    const line = g
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

    const overlay = g
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

    overlay
        .call(d3.drag()
        .on('drag', function() {
            const n = d3.event.x, o = +overlay.attr('x') + overlayWidth / 2;

            overlay.attr('x', n - overlayWidth / 2);

            line.attr('x1', n).attr('x2', n);

            ondrag(n, o);
        }));
};

export {
    drawReferenceX
};
