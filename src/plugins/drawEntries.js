import * as d3 from 'd3';
import { Point, Interval } from '../utils/getTrackerLanes';
import { showTip, hideTip } from './tooltip';
import roundedRect from './roundedRect';

/**
 *
 * @param g
 * @param lanes
 * @param xScale
 * @param yScale
 * @param symbolSize
 * @param intervalCornerRadius
 */
const drawEntriesX = (g, lanes, xScale, yScale, symbolSize, intervalCornerRadius) => {
    const entriesSelection = g.selectAll('.entry');
    if (!entriesSelection.empty()) entriesSelection.remove();

    for (let i = 0, l = lanes.length; i < l; i += 1) {
        const lane = lanes[i],
            Y = yScale(i.toString()), H = yScale.bandwidth();

        for (let I = 0, L = lane.length; I < L; I += 1) {
            const entry = lane[I];

            if (entry instanceof Point) {
                const point = g
                    .append('path')
                    .attr('transform', `translate(${xScale(entry.at)}, ${Y + H / 2})`)
                    .attr('class', `entry entry--${entry.className ? entry.className : 'default'}`)
                    .attr('d', () => {
                        const symbolGen = d3.symbol().size(symbolSize);

                        return symbolGen.type(d3[entry.symbol] || d3['symbolCircle'])();
                    });

                if (entry.title) {
                    point
                        .on('mouseover', showTip(entry.title))
                        .on('mouseout', hideTip);
                }
            }

            if (entry instanceof Interval) {
                const X = xScale(entry.from),
                    W = xScale(entry.to) - xScale(entry.from);

                const interval = g
                    .append('path')
                    .attr('class', `entry entry--${entry.className ? entry.className : 'default'}`)
                    .attr('d', roundedRect(X, Y, W, H, intervalCornerRadius, true, true, true, true));

                if (entry.title) {
                    interval
                        .on('mouseover', showTip(entry.title))
                        .on('mouseout', hideTip);
                }

                const text = g
                    .append('text')
                    .attr('class', 'entry entry--label')
                    .attr('text-anchor', 'middle')
                    .attr('pointer-events', 'none')
                    .attr('x', X + W / 2)
                    .attr('y', Y + H / 2)
                    .text(entry.label || null)
                    .attr('fill', '#fff')
                    .attr('dy', '0.32em');

                if (text.node().getComputedTextLength() > W) {
                    text.remove();
                }
            }
        }
    }
};

export {
    drawEntriesX
};
