import * as d3 from 'd3';
import { isFunction } from 'lodash';
import { isArray } from '../utils/array';

/**
 *
 * @param svg
 * @param zooming
 * @param zoomend
 * @param zoomstart
 * @param scaleExtent
 */
function zoom(svg, { zooming, zoomend, zoomstart }, scaleExtent) {
    const zoom = d3.zoom();

    if (isArray(scaleExtent)) zoom.scaleExtent(scaleExtent);

    if (isFunction(zooming))   zoom.on('zoom', zooming);
    if (isFunction(zoomend))   zoom.on('end', zoomend);
    if (isFunction(zoomstart)) zoom.on('start', zoomstart);

    svg.call(zoom);
}

export default zoom;
