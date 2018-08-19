import { drawCurrentReferenceX } from '../../plugins/drawCurrentReference';
import { drawEntriesMultiLaneX } from '../../plugins/drawEntriesMultiLane';

/**
 *
 * @param g
 * @param axisXLane
 * @param xAxis
 * @param xScale
 * @param yScale
 * @param data
 * @param groups
 * @param g_h
 * @param entryClipPathId
 * @param symbolSize
 * @param intervalCornerRadius
 * @param currentTimeLineColor
 * @param currentTimeLineWidth
 * @param boundingLineColor
 * @param boundingLineWidth
 */
const draw = (
        g,
        axisXLane,
        xAxis,
        xScale,
        yScale,
        data,
        groups,
        g_h,
        entryClipPathId,
        symbolSize,
        intervalCornerRadius,
        currentTimeLineColor,
        currentTimeLineWidth,
        boundingLineColor,
        boundingLineWidth
) => {
    axisXLane
        .call(xAxis.scale(xScale))
        .selectAll('line')
        .attr('y1', -g_h)
        .attr('stroke', boundingLineColor)
        .attr('stroke-width', boundingLineWidth);

    g
        .call(drawEntriesMultiLaneX, data, groups, xScale, yScale, entryClipPathId, symbolSize, intervalCornerRadius)
        .call(drawCurrentReferenceX, xScale, g_h, entryClipPathId, currentTimeLineColor, currentTimeLineWidth);
};

export default draw;
