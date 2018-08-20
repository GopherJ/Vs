import * as d3 from 'd3';

/**
 *
 * @param svg
 * @param extent
 */
const disableZoomOn = (svg, extent) => {
    svg.on('mousedown', () => {
        const [cx, cy] = d3.mouse(svg.node()),
            [[x0, y0], [x1, y1]] = extent;

        if (cx < x0 || cx > x1 || cy > y1 || cy < y0)
            d3.event.stopImmediatePropagation();
    });
};

export default disableZoomOn;
