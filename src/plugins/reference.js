import * as d3 from 'd3';

/**
 *
 * @param svg
 * @param g
 * @param g_w
 * @param g_h
 * @param xScale
 * @param data
 * @param stroke
 * @param strokeDashArray
 * @param strokeWidth
 */
const drawReferenceLineX = (svg, g, g_w, g_h, xScale, data, stroke = '#777', strokeDashArray = '2.2', strokeWidth = 1) => {
    const bisec = d3.bisector((d, x) => xScale(d.key) - x).left;

    svg
        .on('mousemove', function () {
            const [x, y] = d3.mouse(g.node()),
                lineSelection  = g.select('.line--reference'),
                circlesSelection = g.selectAll('circle');

            if (lineSelection.empty()) {
                g
                    .append('line')
                    .attr('class', 'line--reference')
                    .attr('visibility', 'hidden')
                    .attr('x1', x)
                    .attr('x2', x)
                    .attr('y2', g_h)
                    .attr('pointer-events', 'none')
                    .attr('stroke', stroke)
                    .attr('stroke-dasharray', strokeDashArray)
                    .attr('stroke-width', strokeWidth);
            }

            if (x >= 0 && x <= g_w && y >= 0 && y <= g_h) {
                lineSelection
                    .attr('visibility', 'visible');
            } else {
                lineSelection
                    .attr('visibility', 'hidden');
                circlesSelection
                    .attr('visibility', 'hidden');

                return;
            }

            const idx = Math.min(bisec(data, x, 1), data.length - 1),
                cx = Math.abs(xScale(data[idx].key) - x) > Math.abs(x - xScale(data[idx - 1].key))
                    ? xScale(data[idx - 1].key)
                    : xScale(data[idx].key);

            lineSelection
                .attr('x1', cx)
                .attr('x2', cx);

            circlesSelection.each(function (d) {
                if (+this.getAttribute('cx') === cx) {
                    this.setAttribute('visibility', 'visible');
                } else {
                    this.setAttribute('visibility', 'hidden');
                }
            });
        });
};

export {
    drawReferenceLineX
};
