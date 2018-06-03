import * as d3 from 'd3';

function zoom(svg, scale, zooming, zoomed) {
    const zoom = d3.zoom()
        .on('zoom', zooming)
        .on('end', zoomed);

    svg.call(zoom);
}

export default zoom;
