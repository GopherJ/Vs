<template>
    <div class="d3-area" :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import { isNull, isNumber, isString, isUndefined } from 'lodash';
    import uuid from 'uuid/v1';
    import mixins from '../../mixins';
    import { selectTicksNumY } from '../../utils/select';
    import { brushX } from '../../plugins/brush';
    import isAxisTime from '../../utils/isAxisTime';
    import { responsiveAxisX } from '../../plugins/responsiveAxis';
    import axisShow from '../../plugins/axisShow';
    import { yRuler } from '../../plugins/ruler';
    import emit from '../../utils/emit';
    import { drawReferenceLineX } from '../../plugins/reference';
    import { showTip, hideTip } from '../../plugins/tooltip';

    export default {
        name: 'd3-area',
        mixins: [mixins],
        methods: {
            drawArea() {
                const { left = 0, right = 0, top = 0, bottom = 0 } = this.margin,
                    {
                        fill = '#6eadc1',
                        stroke = '#6eadc1',
                        fillOpacity = 0.6,
                        strokeOpacity = 1,

                        circleRadius = 5,
                        circleColor = '#6eadc1',

                        areaTitle = d => `${d.key}<br>${d.value}`,

                        tickSize = 10,
                        tickPadding = 8,

                        axisFontSize = 12,
                        axisFontWeight = 400,
                        axisFontOpacity = 0.5,

                        axisXLaneHeight = 35,
                        axisYLaneWidth = 60,

                        axisXLabel = null,
                        axisYLabel = null,

                        axisLabelFontSize = 14,
                        axisLabelFontWeight = 600,
                        axisLabelFontOpacity = 1,

                        isAxisPathShow = false,
                        isAxisTickShow = true,

                        negative = false,

                        nice = false,

                        axisYTickFormat = '.2s',

                        curve =  'curveLinear',

                        yAxisRuler = true
                    } = this.options,
                    {
                        axisXLabelLaneHeight = isNull(axisXLabel) ? 0 : 35,
                        axisYLabelLaneWidth = isNull(axisYLabel) ? 0 : 60
                    } = this.options,
                    data = [...(this.data)],
                    __offsetTop__ = 10, __offsetRight__ = 10, [w, h] = this.getElWidthHeight(),
                    g_w =  w - left - right - axisYLaneWidth - axisYLabelLaneWidth - __offsetRight__,
                    g_h = h -top - bottom - axisXLaneHeight - axisXLabelLaneHeight - __offsetTop__,
                    clipPathId = uuid(), isAxisXTime = isAxisTime(data), ticks = selectTicksNumY(g_h);

                    if (![g_w, g_h].every(el => el > 0) || !isAxisXTime) return;

                    const svg = d3.select(this.$el)
                        .append('svg')
                        .attr('width', w)
                        .attr('height', h);

                    svg.append('defs')
                        .append('clipPath')
                        .attr('id', clipPathId)
                        .append('rect')
                        .attr('width', g_w)
                        .attr('height', g_h);

                    const xScale = d3.scaleTime()
                        .domain(d3.extent(data, d => d.key))
                        .range([0, g_w]);

                    const yScale = d3.scaleLinear()
                        .domain(negative ? d3.extent(data, d => isNumber(d.value) ? d.value : +d.value) : [0, d3.max(data, d => isNumber(d.value) ? d.value : +d.value)])
                        .range([g_h, 0]);
                    if (nice) yScale.nice();

                    const xAxis = d3
                        .axisBottom(xScale)
                        .tickSize(tickSize)
                        .tickPadding(tickPadding);

                    const yAxis = d3
                        .axisLeft(yScale)
                        .ticks(ticks)
                        .tickSize(tickSize)
                        .tickFormat(d3.format(axisYTickFormat))
                        .tickPadding(tickPadding);

                    const axisXLane = svg
                        .append('g')
                        .attr('transform', `translate(${left + axisYLaneWidth + axisYLabelLaneWidth}, ${top + g_h + __offsetTop__})`);

                    const axisYLane = svg
                        .append('g')
                        .attr('transform', `translate(${left + axisYLabelLaneWidth}, ${top + __offsetTop__})`);

                    axisXLane
                        .append('g')
                        .attr('class', 'axis axis--x')
                        .call(xAxis)
                        .call(axisShow, isAxisPathShow, isAxisTickShow)
                        .attr('font-size', axisFontSize)
                        .attr('font-weight', axisFontWeight)
                        .attr('opacity', axisFontOpacity);

                    axisYLane
                        .append('g')
                        .attr('transform', `translate(${axisYLaneWidth}, 0)`)
                        .attr('class', 'axis axis--y')
                        .call(yAxis)
                        .call(axisShow, isAxisPathShow, isAxisTickShow)
                        .attr('font-size', axisFontSize)
                        .attr('font-weight', axisFontWeight)
                        .attr('opacity', axisFontOpacity);
                    if (yAxisRuler) axisYLane.call(yRuler, yScale, g_w, d3.format(axisYTickFormat), ticks, tickSize, tickPadding);

                    axisXLane
                        .call(responsiveAxisX, xAxis, xScale);

                    const axisXLabelLane = svg
                        .append('g')
                        .attr('transform', `translate(${left + axisYLaneWidth + axisYLabelLaneWidth}, ${top + g_h + axisXLaneHeight + __offsetTop__})`);

                    const axisYLabelLane = svg
                        .append('g')
                        .attr('transform', `translate(${left}, ${top + __offsetTop__})`);

                    axisXLabelLane
                        .append('text')
                        .attr('text-anchor', 'middle')
                        .attr('x', g_w / 2)
                        .attr('y', axisXLabelLaneHeight / 2)
                        .attr('dy', '0.32em')
                        .text(axisXLabel)
                        .attr('fill', '#000')
                        .attr('font-size', axisLabelFontSize)
                        .attr('font-weight', axisLabelFontWeight)
                        .attr('fill-opacity', axisLabelFontOpacity);

                    axisYLabelLane
                        .append('text')
                        .attr('text-anchor', 'middle')
                        .attr('transform', 'rotate(-90)')
                        .attr('y', axisYLabelLaneWidth / 2)
                        .attr('x', -g_h / 2)
                        .text(axisYLabel)
                        .attr('fill', '#000')
                        .attr('font-size', axisLabelFontSize)
                        .attr('font-weight', axisLabelFontWeight)
                        .attr('fill-opacity', axisLabelFontOpacity);

                    const extent = [
                        [left + axisYLabelLaneWidth + axisYLaneWidth, top + __offsetTop__],
                        [w - right - __offsetRight__, h - axisXLaneHeight - axisXLabelLaneHeight]
                    ];

                    const brushed = ({ start, end }) => emit(this, 'range-updated', start, end);

                    svg
                        .call(brushX, extent, xScale, { brushed });

                    const g = svg
                        .append('g')
                        .attr('clip-path', `url(#${clipPathId})`)
                        .attr('transform', `translate(${left + axisYLaneWidth + axisYLabelLaneWidth}, ${top + __offsetTop__})`);

                    const area = d3.area()
                        .x(d => xScale(d.key))
                        .y0(yScale(0))
                        .y1(d => yScale(isNumber(d.value) ? d.value : +d.value));
                    if (isString(curve) && !isUndefined(d3[curve])) area.curve(d3[curve]);

                    g
                        .append('path')
                        .datum(data)
                        .attr('d', area)
                        .attr('fill', fill)
                        .attr('fill-opacity', fillOpacity)
                        .attr('stroke', stroke)
                        .attr('stroke-opacity', strokeOpacity);

                   g.selectAll('circle')
                        .data(data)
                        .enter()
                        .append('circle')
                        .attr('visibility', 'hidden')
                        .attr('r', circleRadius)
                        .attr('cx', d => xScale(d.key))
                        .attr('cy', d => yScale(isNumber(d.value) ? d.value : +d.value))
                        .attr('fill', circleColor)
                        .on('mouseover', showTip(areaTitle))
                        .on('mouseout', hideTip);

                   svg.call(drawReferenceLineX, g, g_w, g_h, xScale, data);
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawArea();
            },
            onResize() {
                this.safeDraw();
            }
        }
    }
</script>

<style>
    @import url(../../css/index.css);

    .d3-area path {
        pointer-events: none;
    }

    .d3-area circle {
        cursor: pointer;
    }

    .d3-area text {
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        cursor: pointer;
    }
</style>
