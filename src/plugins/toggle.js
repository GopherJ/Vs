import * as d3 from 'd3';

/**
 *
 * toggle cross in rect
 *
 * @param {d3.Selection} container
 * @param {d3.Selection} rect
 * @param {string} stroke
 * @param {number} strokeWidth
 */
const toggleCross = (container, rect, stroke, strokeWidth) => {
    const selection = container.selectAll('line');
    if (!selection.empty()) { selection.remove(); return; }

    const __rect__ = rect.node().getBBox();

    const x1 = __rect__.x,
        y1 = __rect__.y,
        x2 = __rect__.x + __rect__.width,
        y2 = __rect__.y + __rect__.height;

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
 * @param {d3.Selection} container
 * @param {d3.Selection} circle
 * @param {String} stroke
 * @param {Number} strokeWidth
 */
const toggleCrossInCircle = (container, circle, stroke, strokeWidth) => {
    const selection = container.selectAll('line');
    if (!selection.empty()) { selection.remove(); return; }

    const SVGRect = circle.node().getBBox(),
          R       = SVGRect.width / 2,
          PROJ    = (Math.sqrt(2) * R - R) / Math.sqrt(2);

    const x1 = SVGRect.x + PROJ,
          y1 = SVGRect.y + PROJ,
          x2 = SVGRect.x + SVGRect.width - PROJ,
          y2 = SVGRect.y + SVGRect.height - PROJ;

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
 * toggle class selector's elements' visibility
 *
 * @param {d3.Selection} svg
 * @param {String} className
 * @return {void}
 */
const toggleClass = (svg, className) => {
    svg.selectAll(`.${className}`)
       .each(function () {
           const selection = d3.select(this),
               display = selection.style('display');

           selection.style('display', display === 'inline' ? 'none' : 'inline');
       });
};

export {
    toggleCross,
    toggleClass,
    toggleCrossInCircle
};
