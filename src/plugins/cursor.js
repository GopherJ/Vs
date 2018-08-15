import * as d3 from 'd3';

/**
 *
 * cursor control in svg
 *
 * @param svg
 * @param g
 * @param extent
 * @param cursor
 */
function cursor(svg, g, extent, cursor = 'pointer') {
    const [[x0, y0], [x1, y1]] = extent;

    svg.on('mousemove', function () {
        const [cx, cy] = d3.mouse(g.node());

        if (cx > x0 && cx < x1 && cy > y0 && cy < y1) svg.attr('cursor', cursor);
        else svg.attr('cursor', 'auto');
    });
}

export default cursor;


