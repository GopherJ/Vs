import * as d3 from 'd3';
import { toggleCrossInCircle } from './toggle';
import { toggleClass } from './toggle';
import hash from '../utils/hash';
import realBBox from './realBBox';

/**
 *
 * @param axisXGroupLabelLane
 * @param svg
 * @param labels
 * @param g_w
 * @param schemeCategory
 * @param axisXGroupLabelLaneHeight
 * @param axisXGroupLabelFillColorOpacity
 * @param axisXGroupLabelBorderColorOpacity
 * @param crossColor
 * @param crossWidth
 * @param axisXGroupLabelFontSize
 * @param axisXGroupLabelFontWeight
 * @param axisXGroupLabelFontOpacity
 * @param axisXGroupLabelGap
 */
const legendGen = (
    axisXGroupLabelLane,
    svg,
    labels,
    g_w,
    schemeCategory,
    axisXGroupLabelLaneHeight,
    axisXGroupLabelFillColorOpacity,
    axisXGroupLabelBorderColorOpacity,
    crossColor,
    crossWidth,
    axisXGroupLabelFontSize,
    axisXGroupLabelFontWeight,
    axisXGroupLabelFontOpacity,
    axisXGroupLabelGap
) => {
    const groupLabelContainer = axisXGroupLabelLane.append('g');

    let previousPos;
    const handler = function (d, i) {
        const _g = d3.select(this);

        const label = _g
            .append('circle')
            .attr('r', axisXGroupLabelLaneHeight / 2)
            .attr('cy', axisXGroupLabelLaneHeight / 2)
            .attr('fill', d => schemeCategory(d))
            .attr('fill-opacity', axisXGroupLabelFillColorOpacity)
            .attr('stroke', d => schemeCategory(d))
            .attr('stroke-opacity', axisXGroupLabelBorderColorOpacity)
            .on('click', function (d) {
                toggleCrossInCircle(_g, d3.select(this), crossColor, crossWidth);
                toggleClass(svg, hash(d));
            });

        const labelPos = label.node().getBBox();

        _g
            .append('text')
            .attr('class', 'label label--group')
            .attr('text-anchor', 'start')
            .attr('x', labelPos.x + labelPos.width)
            .attr('y', axisXGroupLabelLaneHeight / 2)
            .attr('dy', '0.32em')
            .text(d)
            .attr('fill', '#000')
            .attr('font-size', axisXGroupLabelFontSize)
            .attr('font-weight', axisXGroupLabelFontWeight)
            .attr('fill-opacity', axisXGroupLabelFontOpacity);

        if (i !== 0) _g.attr('transform', `translate(${previousPos.x + previousPos.width + axisXGroupLabelGap}, 0)`);

        previousPos = realBBox(_g);
    };

    groupLabelContainer
        .selectAll('.label .label--group')
        .data(labels)
        .enter()
        .append('g')
        .each(handler);

    const groupLabelContainerPos = groupLabelContainer.node().getBBox();
    groupLabelContainer
        .attr('transform', `translate(${(g_w - groupLabelContainerPos.width)}, 0)`);
};

/**
 *
 * @param axisXGroupLabelLane
 * @param svg
 * @param labels
 * @param g_w
 * @param fill
 * @param axisXGroupLabelLaneHeight
 * @param crossColor
 * @param crossWidth
 * @param axisXGroupLabelFontSize
 * @param axisXGroupLabelFontWeight
 * @param axisXGroupLabelFontOpacity
 * @param axisXGroupLabelGap
 */
const lengendGenStatic = (
    axisXGroupLabelLane,
    svg,
    labels,
    g_w,
    fill,
    axisXGroupLabelLaneHeight,
    crossColor,
    crossWidth,
    axisXGroupLabelFontSize,
    axisXGroupLabelFontWeight,
    axisXGroupLabelFontOpacity,
    axisXGroupLabelGap
) => {
    const groupLabelContainer = axisXGroupLabelLane.append('g');

    let previousPos;
    const handler = function (d, i) {
        const _g = d3.select(this);

        const label = _g
            .append('circle')
            .attr('r', axisXGroupLabelLaneHeight / 2)
            .attr('cy', axisXGroupLabelLaneHeight / 2)
            .attr('fill', fill)
            .attr('fill-opacity', d => d.opacity)
            .attr('stroke', fill)
            .attr('stroke-opacity', d => d.opacity)
            .on('click', function (d) {
                toggleCrossInCircle(_g, d3.select(this), crossColor, crossWidth);
                toggleClass(svg, hash(d.label));
            });

        const labelPos = label.node().getBBox();

        _g
            .append('text')
            .attr('class', 'label label--group')
            .attr('text-anchor', 'start')
            .attr('x', labelPos.x + labelPos.width)
            .attr('y', axisXGroupLabelLaneHeight / 2)
            .attr('dy', '0.32em')
            .text(d.label)
            .attr('fill', '#000')
            .attr('font-size', axisXGroupLabelFontSize)
            .attr('font-weight', axisXGroupLabelFontWeight)
            .attr('fill-opacity', axisXGroupLabelFontOpacity);

        if (i !== 0) _g.attr('transform', `translate(${previousPos.x + previousPos.width + axisXGroupLabelGap}, 0)`);

        previousPos = realBBox(_g);
    };

    groupLabelContainer
        .selectAll('.label .label--group')
        .data(labels)
        .enter()
        .append('g')
        .each(handler);

    const groupLabelContainerPos = groupLabelContainer.node().getBBox();
    groupLabelContainer
        .attr('transform', `translate(${(g_w - groupLabelContainerPos.width)}, 0)`);
};

export default legendGen;

export {
    lengendGenStatic
};
