import * as d3 from 'd3';

/**
 *
 * toggle cross
 *
 * @param {d3.Selection} container
 * @param {d3.Selection} rect
 * @param {string} stroke
 * @param {number} strokeWidth
 */
const toggleCross = (container, rect, stroke, strokeWidth) => {
    const selection = container.selectAll('line');
    if (!selection.empty()) {
        selection.remove();
        return;
    }

    const rect = rect.node().getBBox();

    const x1 = rect.x,
        y1 = rect.y,
        x2 = rect.x + rect.width,
        y2 = rect.y + rect.height;

    container.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', stroke)
        .attr('stroke-width', strokeWidth)
        .attr('pointer-events', 'none');

    container.append('line')
        .attr('x1', x2)
        .attr('y1', y1)
        .attr('x2', x1)
        .attr('y2', y2)
        .attr('stroke', stroke)
        .attr('stroke-width', strokeWidth)
        .attr('pointer-events', 'none');
};

/**
 *
 * toggle class
 *
 * @param {d3.Selection} svg
 * @param {d3.Selection} className
 */
const toggleClass = (svg, className) => {
    svg.selectAll(className)
        .each(function () {
            const selection = d3.select(this),
                display = selection.style('display');

            selection.style('display', display === 'inline' ? 'none' : 'inline');
        });
};

export {
    toggleCross,
    toggleClass
};
