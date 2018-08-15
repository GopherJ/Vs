import * as d3 from 'd3';
import { isFunction } from 'lodash';

/**
 *
 * @param svg
 * @param zooming
 * @param zoomend
 * @param zoomstart
 */
function zoom(svg, zooming, zoomend, zoomstart) {
    const zoom = d3.zoom().scaleExtent([0.2, Infinity]);

    if (isFunction(zooming))   zoom.on('zoom', zooming);
    if (isFunction(zoomend))   zoom.on('end', zoomend);
    if (isFunction(zoomstart)) zoom.on('start', zoomstart);

    svg.call(zoom);
}

export default zoom;
