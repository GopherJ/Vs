<template>
    <div class="d3-area" :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import _ from 'lodash';
    import mixins from '../../mixins';
    import { showTip, hideTip } from '../../utils/tooltip';
    import { selectTicksNumY } from '../../utils/select';
    import { brushX } from '../../utils/brush';
    import isAxisTime from '../../utils/isAxisTime';

    export default {
        name: 'd3-area',
        mixins: [mixins],
        methods: {
            drawArea() {
                const data = _.cloneDeep(this.data),
                    {
                        left = 0, right = 0, top = 0, bottom = 0
                    } = this.margin,
                    {
                        fill = '#6eadc1',
                        stroke = '#6eadc1',
                        fillOpacity = 0.6,
                        strokeOpacity = 1,

                        areaTitle = d => `${d.value}`,

                        tickSize = 10,
                        tickPadding = 8,

                        axisFontSize = 12,
                        axisFontWeight = 400,
                        aixsFontOpacity = 1,

                        axisXLaneHeight = 60,
                        axisYLaneWidth = 60,

                        axisXLabel = null,
                        axisYLabel = null,

                        axisLabelFontSize = 12,
                        axisLabelFontWeight = 400,
                        axisLabelFontOpacity = 0.5,

                        isAxisPathShow = true,

                        negative = false,

                        nice = true,

                        axisYTickFormat = '.2s',

                        curve =  'curveLinear'
                    } = this.options,
                    {
                        axisXLabelLaneHeight = _.isNull(axisXLabel) ? 0 : 30,
                        axisYLabelLaneWidth = _.isNull(axisYLabel) ? 0 : 30
                    } = this.options,
                    [w, h] = this.getElWidthHeight(),
                    __offsetTop__ = 10,
                    g_w =  w - left - right - axisYLaneWidth - axisYLabelLaneWidth,
                    g_h = h -top - bottom - axisXLaneHeight - axisXLabelLaneHeight - __offsetTop__;

                    if (![g_w, g_h].every(el => el > 0)) {
                        return;
                    }

                    const ticks = selectTicksNumY(g_h);

                    const svg = d3.select(this.$el)
                        .append('svg')
                        .attr('width', w)
                        .attr('height', h);

                    const xScale = d3.scaleTime()
                        .domain(d3.extent(data, d => d.key))
                        .range([0, g_w]);

                    const yScale = d3.scaleLinear()
                        .domain(negative ? d3.extent(data, d => d.valuel) : [0, d3.max(data, d => d.value)])
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

                    const axisYLane = svg
                        .append('g')
                        .attr('transform', `translate(${left + axisYLabelLaneWidth}, ${top + __offsetTop__})`)
                        .attr('width', axisYLaneWidth)
                        .attr('height', g_h);

                    const axisXLane = svg
                        .append('g')
                        .attr('transform', `translate(${left + axisYLaneWidth + axisYLabelLaneWidth}, ${top + g_h + __offsetTop__})`)
                        .attr('width', g_w)
                        .attr('height', axisXLaneHeight);

                    axisYLane
                        .append('g')
                        .attr('transform', `translate(${axisYLaneWidth}, 0)`)
                        .attr('class', 'axis axis--y')
                        .call(yAxis)
                        .attr('font-size', axisFontSize)
                        .attr('font-weight', axisFontWeight)
                        .attr('fill-opacity', aixsFontOpacity);

                    axisXLane
                        .append('g')
                        .attr('class', 'axis axis--x')
                        .call(xAxis)
                        .attr('font-size', axisFontSize)
                        .attr('font-weight', axisFontWeight)
                        .attr('fill-opacity', aixsFontOpacity);

                    const axisXLabelLane = svg
                        .append('g')
                        .attr('transform', `translate(${left + axisYLaneWidth + axisYLabelLaneWidth}, ${top + g_h + axisXLaneHeight + __offsetTop__})`)
                        .attr('width', g_w)
                        .attr('height', axisXLabelLaneHeight);

                    const axisYLabelLane = svg
                        .append('g')
                        .attr('transform', `translate(${left}, ${top + __offsetTop__})`)
                        .attr('width', axisYLabelLaneWidth)
                        .attr('height', g_h);

                    axisXLabelLane
                        .append('text')
                        .attr('text-anchor', 'middle')
                        .attr('x', g_w / 2)
                        .attr('y', axisXLabelLaneHeight / 2)
                        .attr('dy', '0.32em')
                        .text(axisXLabel)
                        .attr('fill', '#000')
                        .attr('font-size', axisLabelFontSize)
                        .attr('font-weight', axisFontWeight)
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
                        [w - right, h - axisXLaneHeight - axisXLabelLaneHeight]
                    ];

                    svg.call(brushX.bind(this), extent, xScale, data);

                    const g = svg
                        .append('g')
                        .attr('transform', `translate(${left + axisYLaneWidth + axisYLabelLaneWidth}, ${top + __offsetTop__})`)
                        .attr('width', g_w)
                        .attr('height', g_h);

                    const area = d3.area()
                        .x(d => xScale(d.key))
                        .y0(yScale(0))
                        .y1(d => yScale(d.value));
                    if (_.isString(curve) && !_.isUndefined(d3[curve])) area.curve(d3[curve]);

                    g
                        .append('path')
                        .datum(data)
                        .attr('d', area)
                        .attr('fill', fill)
                        .attr('fill-opacity', fillOpacity)
                        .attr('stroke', stroke)
                        .attr('stroke-opacity', strokeOpacity);
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
