import * as d3 from 'd3';
/**
 *
 * cursor control in svg
 *
 * @param {d3.Selection} svg
 * @param {d3.Selection} g
 * @param {number} g_w
 * @param {number} g_h
 * @param {string} cursorType
 */
function cursor(svg, g, g_w, g_h, cursorType) {
    svg.on('mousemove', function () {
        const [cx, cy] = d3.mouse(g.node());

        if (cx > 0 && cx < g_w && cy > 0 && cy < g_h) {
            svg.attr('cursor', cursorType);
        }

        else {
            svg.attr('cursor', 'auto');
        }
    });
}

export default cursor;


