<template>
    <div  class="d3-line" :style="{ 'width' : width, 'height' : height}"></div>
</template>

<script>
    import * as d3 from 'd3';
    import { cloneDeep, isNull, isUndefined, isNumber } from 'lodash';
    import uuid from 'uuid/v1';
    import mixins from '../../mixins';
    import { showTip, hideTip } from '../../plugins/tooltip';
    import { brushX } from '../../plugins/brush';
    import { responsiveAxisX } from '../../plugins/responsiveAxis';
    import wrap from '../../plugins/wrap';
    import tickFormat from '../../utils/tickFormat';
    import { selectTicksNumY } from '../../utils/select';
    import isAxisTime from '../../utils/isAxisTime';
    import isAxisNumber from '../../utils/isAxisNumber';
    import { firstTickTextAnchorStart, lastTickTextAnchorEnd } from '../../plugins/textAnchor';
    import axisShow from '../../plugins/axisShow';
    import emit from '../../utils/emit';

    export default {
        name: 'd3-line',
        mixins: [mixins],
        methods: {
            drawLine() {
                const data = cloneDeep(this.data),
                    { left = 0, top = 0, right = 0, bottom = 0 } = this.margin,
                    {
                        stroke = 'rgb(188, 82, 188)',
                        strokeWidth = 2,

                        axisXLaneHeight = 60,
                        axisYLaneWidth = 35,

                        axisFontSize = 12,
                        axisFontWeight = 400,
                        axisFontOpacity = 1,

                        tickSize = 10,
                        tickPadding = 8,

                        circleRadius = 5,
                        circleColor = 'rgb(188, 82, 188)',

                        circleTitle = d => `${d.value}`,

                        curve = 'curveMonotoneX',

                        axisXLabel = null,
                        axisYLabel = null,

                        axisLabelFontSize = 12,
                        axisLabelFontWeight = 400,
                        axisLabelFontOpacity = 0.5,

                        isAxisPathShow = true,

                        axisXTimeInterval = null,

                        axisYTickFormat = '.2s',

                        negative = false,

                        nice = false
                    } = this.options,
                    {
                        axisXLabelLaneHeight = isNull(axisXLabel) ? 0 : 30,
                        axisYLabelLaneWidth = isNull(axisYLabel) ? 0 : 30,
                    } = this.options,
                    [w, h] = this.getElWidthHeight(),
                    __offsetTop__ = 10,
                    __offsetRight__ = 10,
                    g_w = w - left - right - axisYLabelLaneWidth - axisYLaneWidth - __offsetRight__,
                    g_h = h - top - bottom - axisXLabelLaneHeight - axisXLaneHeight - __offsetTop__,
                    clipPathId = uuid();

                const isAxisXTime = isAxisTime(data),
                    isAxisXNumber = isAxisNumber(data),
                    axisXTickFormat = value => isAxisXTime ? tickFormat(value, axisXTimeInterval) : value,
                    ticks = selectTicksNumY(g_h);

                const xScale = d3.scalePoint()
                    .domain(data.map(d => d.key))
                    .range([0, g_w]);

                const yScale = d3.scaleLinear()
                    .domain(negative ? d3.extent(data, d => d.value) : [0, d3.max(data, d => d.value)])
                    .range([g_h, 0]);
                if (nice) yScale.nice();

                const lineGen = d3.line()
                    .x(d => xScale(d.key))
                    .y(d => yScale(d.value))
                    .defined(d => !isNull(d) && !isUndefined(d));

                if (!isNull(curve) && !isUndefined(d3[curve])) lineGen.curve(d3[curve]);

                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);

                const xAxis = d3
                    .axisBottom(xScale)
                    .tickFormat(axisXTickFormat)
                    .tickSize(tickSize)
                    .tickPadding(tickPadding);

                const yAxis = d3
                    .axisLeft(yScale)
                    .ticks(ticks)
                    .tickFormat(d3.format(axisYTickFormat))
                    .tickSize(tickSize)
                    .tickPadding(tickPadding);

                const axisXLane = svg
                    .append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth + axisYLaneWidth}, ${top + g_h + __offsetTop__})`)
                    .attr('width', g_w)
                    .attr('height', axisXLaneHeight);

                const axisYLane = svg
                    .append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth}, ${top + __offsetTop__})`)
                    .attr('width', axisYLaneWidth)
                    .attr('height', g_h);

                axisXLane
                    .append('g')
                    .attr('class', 'axis axis--x')
                    .call(xAxis)
                    .call(firstTickTextAnchorStart)
                    .call(lastTickTextAnchorEnd)
                    .attr('font-size', axisFontSize)
                    .attr('opacity', axisFontOpacity)
                    .attr('font-weight', axisFontWeight);

                axisYLane
                    .append('g')
                    .attr('transform', `translate(${axisYLaneWidth}, 0)`)
                    .attr('class', 'axis axis--y')
                    .call(yAxis)
                    .call(axisShow, isAxisPathShow, true)
                    .attr('font-size', axisFontSize)
                    .attr('opacity', axisFontOpacity)
                    .attr('font-weight', axisFontWeight);

                const axisXLabelLane = svg
                    .append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth + axisYLaneWidth}, ${top + g_h + axisXLaneHeight + __offsetTop__})`)
                    .attr('width', g_w)
                    .attr('height', axisXLabelLaneHeight);

                const axisYLabelLane = svg
                    .append('g')
                    .attr('transform', `translate(${left}, ${top + __offsetTop__})`)
                    .attr('width', axisYLabelLaneWidth)
                    .attr('height', g_h);

                axisXLabelLane
                    .append('text')
                    .attr('class', 'label label--x')
                    .attr('text-anchor', 'middle')
                    .attr('x', g_w / 2)
                    .attr('y', axisXLabelLaneHeight / 2)
                    .attr('dy', '0.32em')
                    .text(axisXLabel)
                    .attr('font-size', axisLabelFontSize)
                    .attr('font-weight', axisLabelFontWeight)
                    .attr('fill-opacity', axisLabelFontOpacity);

                axisYLabelLane
                    .append('text')
                    .attr('class', 'label label--y')
                    .attr('transform', 'rotate(-90)')
                    .attr('text-anchor', 'middle')
                    .attr('y', axisYLabelLaneWidth / 2)
                    .attr('x', -g_h / 2)
                    .text(axisYLabel)
                    .attr('font-size', axisLabelFontSize)
                    .attr('font-weight', axisLabelFontWeight)
                    .attr('fill-opacity', axisLabelFontOpacity);

                if (isAxisXTime || isAxisXNumber) {
                    const extent = [
                        [left + axisYLaneWidth + axisYLabelLaneWidth, top + __offsetTop__],
                        [w - right - __offsetRight__, h - axisXLaneHeight - axisXLabelLaneHeight]
                    ];

                    axisXLane
                        .call(responsiveAxisX, xAxis, xScale);

                    svg.call(brushX.bind(this), extent, xScale, data)
                }

                axisXLane
                    .call(axisShow, isAxisPathShow, true)
                    .selectAll('text')
                    .call(wrap, xScale.step());

                svg.append('defs')
                    .append('clipPath')
                    .attr('id', clipPathId)
                    .append('rect')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', g_w)
                    .attr('height', g_h);

                const g = svg.append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth + axisYLaneWidth}, ${top + __offsetTop__})`)
                    .attr('width', g_w)
                    .attr('height', g_h);

                g.append('path')
                    .datum(data)
                    .attr('d', lineGen)
                    .attr('clip-path', `url(#${clipPathId})`)
                    .attr('fill', 'none')
                    .attr('stroke', stroke)
                    .attr('stroke-width', strokeWidth)
                    .attr('pointer-events', 'none');

                const circles = g.selectAll('circle')
                    .data(data)
                    .enter()
                    .append('circle')
                    .attr('r', circleRadius)
                    .attr('cx', d => xScale(d.key))
                    .attr('cy', d => yScale(d.value))
                    .attr('fill', circleColor)
                    .attr('clip-path', `url(#${clipPathId})`)
                    .on('mouseover', showTip(circleTitle))
                    .on('mouseout', hideTip);

                if (isAxisXTime && isNumber(axisXTimeInterval)) {
                    circles.on('mousedown', (d) => {
                        const dateTimeStart = d.key,
                            dateTimeEnd = new Date(d.key.valueOf() + axisXTimeInterval);

                        emit(this, 'range-updated', dateTimeStart, dateTimeEnd);
                    });
                }
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawLine();
            },
            onResize() {
                this.safeDraw();
            }
        }
    }
</script>

<style>
    @import url(../../css/index.css);

    .d3-line text {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: pointer;
    }

    .d3-line circle {
        cursor: pointer;
    }

    .d3-line path {
        pointer-events: none;
    }
</style>
