import { drawReferenceX } from '../../plugins/drawReference';
import { drawEntriesX } from '../../plugins/drawEntries';

/**
 *
 * @param axisXLane
 * @param xAxis
 * @param yScale
 * @param lanes
 * @param g_h
 * @param symbolSize
 * @param intervalCornerRadius
 * @param overlayWidth
 * @param referenceLineColor
 * @param referenceLineWidth
 * @param boundingLineColor
 * @param boundingLineWidth
 * @param onDrag
 */
const drawGen = (
    axisXLane,
    xAxis,
    yScale,
    lanes,
    g_h,
    symbolSize,
    intervalCornerRadius,
    overlayWidth,
    referenceLineColor,
    referenceLineWidth,
    boundingLineColor,
    boundingLineWidth,
    onDrag
) => {
    return (g, reference, xScale) => {
        axisXLane
            .call(xAxis.scale(xScale))
            .selectAll('line')
            .attr('y1', -g_h)
            .attr('stroke', boundingLineColor)
            .attr('stroke-width', boundingLineWidth);

        g
            .call(drawEntriesX, lanes, xScale, yScale, symbolSize, intervalCornerRadius)
            .call(drawReferenceX, xScale(reference), g_h, overlayWidth, referenceLineColor, referenceLineWidth, onDrag);
    };
};

export default drawGen;
