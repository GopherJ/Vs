import * as d3 from 'd3';
/**
 *
 * cursor control in svg
 *
 * @param {d3.Selection} svg
 * @param {d3.Selection} g
 * @param {[[number, number], [number, number]]} extent
 * @param {string} cursor
 */
function cursor(svg, g, extent, cursor) {
    svg.on('mousemove', function () {
        const [cx, cy] = d3.mouse(g.node()),
            [[x0, y0], [x1, y1]] = extent;

        if (cx > x0 && cx < x1 && cy > y0 && cy < y1) {
            svg.attr('cursor', cursor || 'pointer');
        }

        else {
            svg.attr('cursor', 'auto');
        }
    });
}

export default cursor;


