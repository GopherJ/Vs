import { drawReferenceX } from '../../plugins/drawReference';
import { drawTicksX } from '../../plugins/drawTicks';
import { drawEntriesX } from '../../plugins/drawEntries';


/**
 *
 * @param g
 * @param axisXLane
 * @param xAxis
 * @param xScale
 * @param yScale
 * @param lanes
 * @param reference
 * @param g_h
 * @param clipPathId
 * @param symbolSize
 * @param intervalCornerRadius
 * @param overlayWidth
 * @param referenceLineColor
 * @param referenceLineWidth
 * @param boundingLineColor
 * @param boundingLineWidth
 * @param onDrag
 */
const draw = (
    g,
    axisXLane,
    xAxis,
    xScale,
    yScale,
    lanes,
    reference,
    g_h,
    clipPathId,
    symbolSize,
    intervalCornerRadius,
    overlayWidth,
    referenceLineColor,
    referenceLineWidth,
    boundingLineColor,
    boundingLineWidth,
    onDrag
) => {
    axisXLane
        .call(xAxis.scale(xScale))
        .selectAll('line')
        .attr('y1', -g_h)
        .attr('stroke', boundingLineColor)
        .attr('stroke-width', boundingLineWidth);

    g
        .call(drawEntriesX, lanes, xScale, yScale, symbolSize, clipPathId, intervalCornerRadius)
        .call(drawReferenceX, xScale(reference), clipPathId, g_h, overlayWidth, referenceLineColor, referenceLineWidth, onDrag);
};

export default draw;
