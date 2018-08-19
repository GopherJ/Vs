import * as d3 from 'd3';

/**
 *
 * @param svg
 * @param g_w
 * @param zoom
 * @return {Function}
 */
const zoomToXK = (svg, g_w, zoom) => {
   return function (xScale, dateTimeStart, dateTimeEnd) {
        const k = g_w / (xScale(dateTimeEnd) - xScale(dateTimeStart));
        const translateX = -xScale(dateTimeStart) ;

        svg
            .transition()
            .duration(750)
            .call(zoom.transform, () => {
                return d3.zoomIdentity
                    .scale(k)
                    .translate(translateX, 0);
            });
   }
};

export {
    zoomToXK
};
