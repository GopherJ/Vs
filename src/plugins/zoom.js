import * as d3 from 'd3';
import { isFunction } from 'lodash';
import { isExtent, isSimpleExtent } from '../utils/array';
import disableZoomOn from './disableZoomOn';

/**
 *
 * @param svg
 * @param zooming
 * @param zoomend
 * @param zoomstart
 * @param scaleExtent
 * @param extent
 */
function zoom(svg, { zooming, zoomend, zoomstart }, scaleExtent, extent) {
    const zoom = d3.zoom();

    if (isSimpleExtent(scaleExtent)) zoom.scaleExtent(scaleExtent);
    if (isExtent(extent)) svg.call(disableZoomOn, extent);

    if (isFunction(zooming))   zoom.on('zoom', zooming);
    if (isFunction(zoomend))   zoom.on('end', zoomend);
    if (isFunction(zoomstart)) zoom.on('start', zoomstart);

    svg.call(zoom);
    svg.on('dblclick.zoom', null);

    return zoom;
}

export default zoom;
