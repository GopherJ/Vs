<template>
    <div class="d3-scatter-plot" :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import _ from 'lodash';
    import mixins from '../../mixins';
    import { showTip, hideTip } from '../../utils/tooltip';
    import { brushX } from '../../utils/brushX';
    import isAxisTime from '../../utils/isAxisTime';
    import { responsiveAxisX } from '../../utils/responsiveAxis';
    import wrap from '../../utils/wrap';
    import { firstTickTextAnchorStart, lastTickTextAnchorEnd } from '../../utils/textAnchor';
    import tickFormat from '../../utils/tickFormat';
    import { selectTicksNumY } from '../../utils/select';

    export default {
        name: 'd3-scatter-plot',
        mixins: [mixins],
        methods: {
            drawScatterPlot() {
                const [w, h] = this.getElWidthHeight();

                const data = _.cloneDeep(this.data),
                    {left = 0, top = 0, right = 0, bottom = 0} = this.margin,
                    {
                        axisXLaneHeight = 60,
                        axisYLaneWidth = 35,

                        axisFontSize = 12,
                        axisFontWeight = 400,
                        axisFontOpacity = 1,

                        tickSize = 10,
                        tickPadding = 8,

                        circleTitle = d => `${d.value}`,

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
                        axisXLabelLaneHeight = _.isNull(axisXLabel) ? 0 : 30,
                        axisYLabelLaneWidth = _.isNull(axisYLabel) ? 0 : 30,
                    } = this.options,
                    __offsetTop__ = 10,
                    __offsetRight__ = 10,
                    g_w = w - left - right - axisYLabelLaneWidth - axisYLaneWidth - __offsetRight__,
                    g_h = h - top - bottom - axisXLabelLaneHeight - axisXLaneHeight - __offsetTop__;
                const isAxisXTime = isAxisTime(data),
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
                    .defined(d => !_.isNull(d) && !_.isUndefined(d));
                if (!_.isNull(curve) && !_.isUndefined(d3[curve])) {
                    lineGen
                        .curve(d3[curve]);
                }
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
                    .attr('fill-opacity', axisFontOpacity)
                    .attr('font-weight', axisFontWeight);
                axisYLane
                    .append('g')
                    .attr('transform', `translate(${axisYLaneWidth}, 0)`)
                    .attr('class', 'axis axis--y')
                    .call(yAxis)
                    .attr('font-size', axisFontSize)
                    .attr('fill-opacity', axisFontOpacity)
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
                if (isAxisXTime) {
                    const extent = [
                        [left + axisYLaneWidth + axisYLabelLaneWidth, top + __offsetTop__],
                        [w - right - __offsetRight__, h - axisXLaneHeight - axisXLabelLaneHeight]
                    ];
                    axisXLane
                        .call(responsiveAxisX, xAxis, xScale);
                    svg.call(brushX.bind(this), extent, xScale, data);
                }
                axisXLane
                    .selectAll('text')
                    .call(wrap, xScale.step());
                svg.append('defs')
                    .append('clipPath')
                    .attr('id', 'clip-line')
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
                    .attr('clip-path', 'url(#clip-line)')
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
                    .attr('clip-path', 'url(#clip-line)')
                    .on('mouseover', (d) => {
                        showTip(circleTitle(d));
                    })
                    .on('mouseout', hideTip);
                if (isAxisXTime && _.isNumber(axisXTimeInterval)) {
                    circles
                        .on('mousedown', (d) => {
                            const dateTimeStart = d.key,
                                dateTimeEnd = new Date(d.key.getTime() + axisXTimeInterval);
                            emit(this, 'range-updated', dateTimeStart, dateTimeEnd);
                        });
                }
                if (!isAxisPathShow) {
                    axisXLane.select('.domain')
                        .attr('display', 'none');
                    axisYLane.select('.domain')
                        .attr('display', 'none');
                }
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawScatterPlot();
            },
            onResize() {
                this.safeDraw();
            }
        }
    }
</script>

<style>
    @import url(../../css/index.css);

    .d3-scatter-plot circle:hover {
        cursor: pointer;
    }

    .d3-scatter-plot text {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: pointer;
    }
</style>
