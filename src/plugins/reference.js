import * as d3 from 'd3';
import moment from 'moment';

const m          = d => moment(d).format('MMMM Do YYYY, h:mm:ss a');

const drawReferenceLineX = (svg, g, g_w, g_h, xScale, data, stroke, strokeWidth) => {
    const bisec = d3.bisector(x => x.key).left;

    svg
        .on('mousemove', function () {
            const [x] = d3.mouse(g.node());
            if (x <= 0  || x >= g_w) return;

            const lineSelection  = g.select('.line--reference');
            const keySelection   = g.select('.key--reference');
            const valueSelection = g.select('.value--reference');

            if (lineSelection.empty()) {
                g
                    .append('line')
                    .attr('class', 'line--reference')
                    .attr('x1', x)
                    .attr('x2', x)
                    .attr('y1', 0)
                    .attr('y2', g_h)
                    .attr('pointer-events', 'none')
                    .attr('stroke', stroke || '#ccc')
                    .attr('stroke-width', strokeWidth || 2);
            } else {
                lineSelection
                    .attr('x1', x)
                    .attr('x2', x)
            }

            const xInvert = xScale.invert(x);

            if (keySelection.empty()) {
                g
                    .append('text')
                    .attr('class', 'key--reference')
                    .attr('x', x + 5)
                    .attr('dy', '1em')
                    .attr('font-family', 'sans-serif')
                    .attr('text-anchor', 'start')
                    .text(m(xInvert));
            } else {
                keySelection
                    .attr('x', x + 5)
                    .text(m(xInvert));
            }

            const i  = bisec(data, xInvert, 1),
                  d0 = data[i - 1],
                  d1 = data[i],
                  d = xInvert - d0.key > d1.key - xInvert ? d1 : d0;

            if (valueSelection.empty()) {
                g
                    .append('text')
                    .attr('class', 'value--reference')
                    .attr('x', x + 5)
                    .attr('dy', '2em')
                    .attr('font-family', 'sans-serif')
                    .attr('text-anchor', 'start')
                    .text(d.value);
            } else {
                valueSelection
                    .attr('x', x + 5)
                    .attr(d.value);
            }
        })
        .on('mouseout', function () {
            const lineSelection  = g.select('.line--reference');
            const keySelection   = g.select('.key--reference');
            const valueSelection = g.select('.value--reference');

            if (!lineSelection.empty()) lineSelection.remove();
            if (!keySelection.empty()) keySelection.remove();
            if (!valueSelection.empty()) valueSelection.remove();
        });
};

export {
    drawReferenceLineX
};
