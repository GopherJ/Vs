import * as d3 from 'd3';
import moment from 'moment';

const isFunction = f => typeof f === 'function';
const m          = d => moment(d).format('MMMM Do YYYY, h:mm:ss a');

const drawReferenceLineX = (svg, g, g_w, g_h, xScale, stroke, strokeWidth, dashArray) => {
    svg
        .on('mousemove', function () {
            const [x] = d3.mouse(g.node());
            if (x <= 0  || x >= g_w) return;

            const lineSelection = g.select('.line--reference');
            const textSelection = g.select('.text--reference');
            if (lineSelection.empty()) {
                const line = g
                    .append('line')
                    .attr('class', 'line--reference')
                    .attr('x1', x)
                    .attr('x2', x)
                    .attr('y1', 0)
                    .attr('y2', g_h)
                    .attr('pointer-events', 'none')
                    .attr('stroke', stroke || '#000')
                    .attr('stroke-width', strokeWidth || 1);

                if (dashArray) line.attr('dash-array', dashArray);
            } else {
                lineSelection
                    .attr('x1', x)
                    .attr('x2', x)
                    .attr('y1', 0)
                    .attr('y2', g_h);
            }

            if (textSelection.empty() && isFunction(xScale.invert)) {
                g
                    .append('text')
                    .attr('class', 'text--reference')
                    .attr('x', x + 5)
                    .attr('y', 5)
                    .attr('text-anchor', 'start')
                    .text(m(xScale.invert(x)));
            } else {
                textSelection
                    .attr('x', x + 5)
                    .attr('y', 5)
                    .text(m(xScale.invert(x)));
            }
        })
        .on('mouseout', function () {
            const lineSelection = g.select('.line--reference');
            const textSelection = g.select('.text--reference');
            if (!lineSelection.empty()) {
                lineSelection.remove();
            }

            if (!textSelection.empty()) {
                textSelection.remove();
            }
        });
};

export {
    drawReferenceLineX
};
