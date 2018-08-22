import { drawCurrentReferenceX } from '../../plugins/drawCurrentReference';
import { drawEntriesMultiLaneX } from '../../plugins/drawEntriesMultiLane';

/**
 *
 * @param axisXLane
 * @param xAxis
 * @param yScale
 * @param data
 * @param groups
 * @param g_h
 * @param symbolSize
 * @param intervalCornerRadius
 * @param currentTimeLineColor
 * @param currentTimeLineWidth
 * @param boundingLineColor
 * @param boundingLineWidth
 */
const draw = (
    axisXLane,
    xAxis,
    yScale,
    data,
    groups,
    g_h,
    symbolSize,
    intervalCornerRadius,
    currentTimeLineColor,
    currentTimeLineWidth,
    boundingLineColor,
    boundingLineWidth
) => {
    return (g, xScale) => {
        axisXLane
            .call(xAxis.scale(xScale))
            .selectAll('line')
            .attr('y1', -g_h)
            .attr('stroke', boundingLineColor)
            .attr('stroke-width', boundingLineWidth);

        g
            .call(drawEntriesMultiLaneX, data, groups, xScale, yScale, symbolSize, intervalCornerRadius)
            .call(drawCurrentReferenceX, xScale, g_h, currentTimeLineColor, currentTimeLineWidth);
    }
};

export default draw;
