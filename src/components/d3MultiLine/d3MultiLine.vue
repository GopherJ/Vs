<template>
    <div class="d3-multi-line" :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import _ from 'lodash';
    import { brushX } from '../../utils/brush';
    import mixins from '../../mixins';
    import groupBy from '../../utils/groupBy';
    import realBBox from '../../utils/realBBox';
    import { responsiveAxisX } from '../../utils/responsiveAxis';
    import tickFormat from '../../utils/tickFormat';
    import { toggleCross, toggleClass } from '../../utils/toggle';
    import { showTip, hideTip } from '../../utils/tooltip';
    import { selectTicksNumY } from '../../utils/select';
    import wrap from '../../utils/wrap';
    import { firstTickTextAnchorStart, lastTickTextAnchorEnd } from '../../utils/textAnchor';
    import GetAllKeys from '../../utils/allKeys';
    import isAxisTime from '../../utils/isAxisTime';
    import emit from '../../utils/emit';

    export default {
        name: 'd3-multi-line',
        mixins: [mixins],
        methods: {
            drawMultiLine() {
                const _data = _.cloneDeep(this.data);
                const {left = 0, top = 0, right = 0, bottom = 0} = this.margin,
                    {
                        strokeWidth = 2,

                        circleRadius = 5,
                        circleTitle = d => `${d.value}`,

                        crossWidth = 2,
                        crossColor = 'white',

                        axisXLabel = null,
                        axisYLabel = null,

                        tickSize = 10,
                        tickPadding = 8,

                        axisXGroupLabelLaneHeight = 30,
                        axisXGroupLabelWidth = 15,
                        axisXGroupLabelFillColorOpacity = 1,
                        axisXGroupLabelBorderColorOpacity = 0.6,
                        axisXGroupLabelGap = 10,

                        axisLabelFontSize = 12,
                        axisLabelFontWeight = 400,
                        axisLabelFontOpacity = 0.5,

                        axisXLaneHeight = 60,
                        axisYLaneWidth = 35,

                        axisFontSize = 12,
                        axisFontWeight = 400,
                        axisFontOpacity = 1,

                        axisXTimeInterval = null,

                        dashedGroups = [],
                        strokeDashArray = 5,

                        isAxisPathShow = true,

                        curve = 'curveCardinal',

                        axisYTickFormat = '.2s',

                        groupKey = 'group',

                        negative = false,

                        nice = false
                    } = this.options,
                    {
                        axisXLabelLaneHeight = _.isNull(axisXLabel) ? 0 : 30,
                        axisYLabelLaneWidth = _.isNull(axisYLabel) ? 0 : 30,
                    } = this.options;

                const [w, h] = this.getElWidthHeight(),
                    __offsetRight__ = 10,
                    g_w = w - left - right - axisYLabelLaneWidth - axisYLaneWidth - __offsetRight__,
                    g_h = h - top - bottom - axisXLabelLaneHeight - axisXLaneHeight - axisXGroupLabelLaneHeight;

                if (![g_w, g_h].every(el => el > 0)) {
                    return;
                }

                const isAxisXTime = isAxisTime(_data),
                    axisXTickFormat = value => isAxisXTime ? tickFormat(value, axisXTimeInterval) : value,
                    ticks = selectTicksNumY(g_w),
                    data = groupBy(_data, groupKey),
                    groups = Object.keys(data);

                if (groups.length === 0) {
                    return;
                }

                const schemeCategory20 = d3.scaleOrdinal()
                    .domain(groups)
                    .range(d3.schemeCategory20);

                const yScale = d3.scaleLinear()
                    .domain(negative ? d3.extent(data, d => d.value) : [0, d3.max(_data.map(d => d.value))])
                    .range([g_h, 0]);
                if (nice) yScale.nice();

                const xScale = d3.scalePoint()
                    .domain(GetAllKeys(_data))
                    .range([0, g_w]);

                const lineGen = d3.line()
                    .x(d => xScale(d.key))
                    .y(d => yScale(d.value))
                    .defined(d => !_.isNull(d) && !_.isUndefined(d));

                if (!_.isNull(curve) && !_.isUndefined(d3[curve])) {
                    lineGen
                        .curve(d3[curve]);
                }

                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);

                const axisXGroupLabelLane = svg.append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth + axisYLaneWidth}, ${top})`)
                    .attr('width', g_w)
                    .attr('height', axisXGroupLabelLaneHeight);

                const axisYLabelLane = svg.append('g')
                    .attr('transform', `translate(${left}, ${top + axisXGroupLabelLaneHeight})`)
                    .attr('width', axisYLabelLaneWidth)
                    .attr('height', g_h);

                const axisXLabelLane = svg.append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth + axisYLaneWidth}, ${top + axisXGroupLabelLaneHeight + g_h + axisXLaneHeight})`)
                    .attr('width', g_w)
                    .attr('height', axisXLabelLaneHeight);

                const axisYLane = svg.append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth}, ${top + axisXGroupLabelLaneHeight})`)
                    .attr('width', axisYLaneWidth)
                    .attr('height', g_h);

                const axisXLane = svg.append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth + axisYLaneWidth}, ${top + axisXGroupLabelLaneHeight + g_h})`)
                    .attr('width', g_w)
                    .attr('height', axisXLaneHeight);

                const GroupLabelContainer = axisXGroupLabelLane
                    .append('g');

                let previousPos;
                GroupLabelContainer
                    .selectAll('.label .label--group')
                    .data(groups)
                    .enter()
                    .append('g')
                    .each(function (d, i) {
                        const _g = d3.select(this);

                        let label;
                        label = _g.append('rect')
                            .attr('width', axisXGroupLabelWidth)
                            .attr('height', axisXGroupLabelLaneHeight)
                            .attr('fill', d => schemeCategory20(d))
                            .attr('fill-opacity', axisXGroupLabelFillColorOpacity)
                            .attr('stroke', d => schemeCategory20(d))
                            .attr('stroke-opacity', axisXGroupLabelBorderColorOpacity)
                            .on('click', function (d) {
                                toggleCross(_g, d3.select(this), crossColor, crossWidth);
                                toggleClass(svg, `.d3-multi-line-${d}`);
                            });

                        const labelPos = label.node().getBBox();

                        _g.append('text')
                            .attr('class', 'label label--group')
                            .attr('text-anchor', 'start')
                            .attr('x', labelPos.x + labelPos.width)
                            .attr('y', axisXGroupLabelLaneHeight / 2)
                            .attr('dy', '0.32em')
                            .text(d);

                        if (i !== 0) {
                            _g.attr('transform', `translate(${previousPos.x + previousPos.width + axisXGroupLabelGap}, 0)`);
                        }

                        previousPos = realBBox(_g);
                    });

                const GroupLabelContainerPos = GroupLabelContainer.node().getBBox();
                GroupLabelContainer
                    .attr('transform', `translate(${(g_w - GroupLabelContainerPos.width) / 2}, 0)`);

                axisXLabelLane
                    .append('text')
                    .attr('class', 'label label--x')
                    .attr('text-anchor', 'middle')
                    .attr('x', g_w / 2)
                    .attr('y', axisXLabelLaneHeight / 2)
                    .attr('dy', '0.32em')
                    .text(axisXLabel)
                    .attr('fill', '#000')
                    .attr('fill-opacity', axisLabelFontOpacity)
                    .attr('font-size', axisLabelFontSize)
                    .attr('font-weight', axisLabelFontWeight);

                axisYLabelLane
                    .append('text')
                    .attr('class', 'label label--y')
                    .attr('text-anchor', 'middle')
                    .attr('transform', 'rotate(-90)')
                    .attr('y', axisYLabelLaneWidth / 2)
                    .attr('x', -g_h / 2)
                    .text(axisYLabel)
                    .attr('fill', '#000')
                    .attr('fill-opacity', axisLabelFontOpacity)
                    .attr('font-size', axisLabelFontSize)
                    .attr('font-weight', axisLabelFontWeight);

                const xAxis = d3
                    .axisBottom(xScale)
                    .tickFormat(axisXTickFormat)
                    .tickSize(tickSize)
                    .tickPadding(tickPadding);

                const yAxis = d3
                    .axisLeft(yScale)
                    .ticks(selectTicksNumY(g_h))
                    .tickFormat(d3.format(axisYTickFormat))
                    .tickSize(tickSize)
                    .tickPadding(tickPadding);

                axisXLane
                    .append('g')
                    .attr('class', 'axis axis--x')
                    .call(xAxis)
                    .call(firstTickTextAnchorStart)
                    .call(lastTickTextAnchorEnd)
                    .attr('fill-opacity', axisFontOpacity)
                    .attr('font-size', axisFontSize)
                    .attr('font-weight', axisFontWeight);

                axisYLane
                    .append('g')
                    .attr('transform', `translate(${axisYLaneWidth}, 0)`)
                    .attr('class', 'axis axis--y')
                    .call(yAxis)
                    .attr('fill-opacity', axisFontOpacity)
                    .attr('font-size', axisFontSize)
                    .attr('font-weight', axisFontWeight);

                if (isAxisXTime) {
                    const extent = [
                        [left + axisYLaneWidth + axisYLabelLaneWidth, top + axisXGroupLabelLaneHeight],
                        [w - right - __offsetRight__, g_h + top + axisXGroupLabelLaneHeight]
                    ];

                    axisXLane
                        .call(responsiveAxisX, xAxis, xScale);

                    svg.call(brushX.bind(this), extent, xScale, _data);
                }

                axisXLane
                    .selectAll('text')
                    .call(wrap, xScale.step());

                svg.append('defs')
                    .append('clipPath')
                    .attr('id', 'clip-multi-line')
                    .append('rect')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', g_w)
                    .attr('height', g_h);

                const g = svg.append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth + axisYLaneWidth}, ${top + axisXGroupLabelLaneHeight})`)
                    .attr('width', g_w)
                    .attr('height', g_h);

                g.selectAll('path')
                    .data(groups)
                    .enter()
                    .append('path')
                    .attr('class', d => `d3-multi-line-${d}`)
                    .attr('clip-path', 'url(#clip-multi-line)')
                    .attr('d', d => lineGen(data[d]))
                    .attr('stroke-dasharray', d => dashedGroups.some(el => el === d) ? (_.isNumber(strokeDashArray) ? strokeDashArray : 0) : 0)
                    .attr('fill', 'transparent')
                    .attr('pointer-events', 'none')
                    .attr('stroke', d => schemeCategory20(d))
                    .attr('stroke-width', strokeWidth);

                const circles = g.selectAll('circle')
                    .data(_data)
                    .enter()
                    .append('circle')
                    .attr('class', d => `d3-multi-line-${d.group}`)
                    .attr('clip-path', 'url(#clip-multi-line)')
                    .attr('cx', d => xScale(d.key))
                    .attr('cy', d => yScale(d.value))
                    .attr('r', circleRadius)
                    .attr('fill', d => schemeCategory20(d.group))
                    .on('mouseover', showTip(circleTitle))
                    .on('mouseout', hideTip);

                if (isAxisXTime && _.isNumber(axisXTimeInterval)) {
                        const dateTimeStart = d.key,
                            dateTimeEnd = new Date(d.key.getTime() + axisXTimeInterval);

                        emit(this, 'range-updated', dateTimeStart, dateTimeEnd);
                }

                if (!isAxisPathShow) {
                    axisYLane.select('.domain')
                        .attr('display', 'none');

                    axisXLane.select('.domain')
                        .attr('display', 'none');
                }
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawMultiLine();
            },
            onResize() {
                this.safeDraw();
            }
        }
    }
</script>

<style>
    @import url(../../css/index.css);

    .d3-multi-line circle:hover,
    .d3-multi-line rect:hover,
    .d3-multi-line text:hover {
        cursor: pointer;
    }

    .d3-multi-line text {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
</style>
