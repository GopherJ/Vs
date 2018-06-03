import * as d3 from 'd3';

function zoom(svg, zooming, zoomend, zoomstart) {
    const zoom = d3.zoom()
        .on('zoom', zooming);

    if (zoomend) zoom.on('end', zoomend);
    if (zooming) zoom.on('start', zoomstart);

    svg.call(zoom);
}

export default zoom;
