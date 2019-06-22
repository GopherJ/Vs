<template>
    <div class="d3-vertical-bar" :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import { isNull, isNumber } from 'lodash';
    import uuid from 'uuid/v1';
    import mixins from '../../mixins';
    import { showTip, hideTip } from '../../plugins/tooltip';
    import emit from '../../utils/emit';
    import { responsiveAxisX } from '../../plugins/responsiveAxis';
    import tickFormat from '../../utils/tickFormat';
    import { brushX } from '../../plugins/brush';
    import wrap from '../../plugins/wrap';
    import { selectPaddingInnerOuterX, selectTicksNumY } from '../../utils/select';
    import isAxisTime from '../../utils/isAxisTime';
    import isAxisNumber from '../../utils/isAxisNumber';
    import axisShow from '../../plugins/axisShow';
    import { yRuler } from '../../plugins/ruler';

    export default {
        name: 'd3-vertical-bar',
        mixins: [mixins],
        methods: {
            drawVerticalBar() {
                const { left = 0, right = 0, top = 0, bottom = 0 } = this.margin,
                    {
                        fill = '#6eadc1',
                        stroke = '#6eadc1',
                        fillOpacity = 0.6,
                        strokeOpacity = 1,

                        barTitle = d => `${d.value}`,

                        tickSize = 10,
                        tickPadding = 8,

                        axisFontSize = 12,
                        axisFontWeight = 400,
                        axisFontOpacity = 0.5,

                        axisYLabel = null,
                        axisXLabel = null,

                        axisLabelFontSize = 14,
                        axisLabelFontWeight = 600,
                        axisLabelFontOpacity = 1,

                        axisXLaneHeight = 60,
                        axisYLaneWidth = 35,

                        axisXInterval = null,

                        isAxisPathShow = true,
                        isAxisTickShow = true,

                        animationDuration = 1000,
                        delay = 50,

                        axisYTickFormat = '.2s',

                        negative = false,

                        nice = true,

                        yAxisRuler = true
                    } = this.options,
                    {
                        axisXLabelLaneHeight = isNull(axisXLabel) ? 0 : 60,
                        axisYLabelLaneWidth = isNull(axisYLabel) ? 0 : 60,
                    } = this.options,
                    data = [...(this.data)],
                    __offsetTop__ = 10, __offsetRight__ = 10, [w, h] = this.getElWidthHeight(),
                    g_w = w - left - right - axisYLabelLaneWidth - axisYLaneWidth - __offsetRight__,
                    g_h = h - top - bottom - axisXLaneHeight - axisXLabelLaneHeight - __offsetTop__,
                    clipPathId = uuid(), isAxisXTime = isAxisTime(data), isAxisXNumber = isAxisNumber(data),
                    axisXTickFormat = value => isAxisXTime ? tickFormat(value, axisXInterval) : value,
                    ticks = selectTicksNumY(g_h), [paddingInner, paddingOuter] = selectPaddingInnerOuterX(g_w);

                if (![g_w, g_h].every(el => el > 0)) return;

                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);

                svg.append('defs')
                    .append('clipPath')
                    .attr('id', clipPathId)
                    .append('rect')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', g_w)
                    .attr('height', g_h);

                const yScale = d3.scaleLinear()
                    .range([g_h, 0])
                    .domain(negative ? d3.extent(data, d => d.value) : [0, d3.max(data, d => d.value)]);
                if (nice) yScale.nice();

                const xScale = d3.scaleBand()
                    .range([0, g_w])
                    .paddingInner([paddingInner])
                    .paddingOuter([paddingOuter])
                    .domain(data.map(d => d.key));

                const axisXLane = svg
                    .append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth + axisYLaneWidth},${top + g_h + __offsetTop__})`);

                const axisYLane = svg
                    .append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth}, ${top + __offsetTop__})`);

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

                axisXLane.append('g')
                    .attr('class', 'axis axis--x')
                    .call(xAxis)
                    .attr('font-size', axisFontSize)
                    .attr('font-weight', axisFontWeight)
                    .attr('opacity', axisFontOpacity);

                axisYLane.append('g')
                    .attr('class', 'axis axis--y')
                    .attr('transform', `translate(${axisYLaneWidth}, 0)`)
                    .call(yAxis)
                    .call(axisShow, isAxisPathShow, isAxisTickShow)
                    .attr('font-size', axisFontSize)
                    .attr('font-weight', axisFontWeight)
                    .attr('opacity', axisFontOpacity);
                if (yAxisRuler) axisYLane.call(yRuler, yScale, g_w, d3.format(axisYTickFormat), ticks, tickSize, tickPadding);

                const axisXLabelLane = svg
                    .append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth + axisYLaneWidth}, ${top + g_h + axisXLaneHeight + __offsetTop__})`);

                const axisYLabelLane = svg
                    .append('g')
                    .attr('transform', `translate(${left}, ${top + __offsetTop__})`);

                axisXLabelLane
                    .append('text')
                    .attr('class', 'label label--x')
                    .attr('text-anchor', 'middle')
                    .attr('x', g_w / 2)
                    .attr('y', axisXLabelLaneHeight / 2)
                    .attr('dy', '0.32em')
                    .attr('fill', '#000')
                    .attr('fill-opacity', axisLabelFontOpacity)
                    .text(axisXLabel)
                    .attr('font-size', axisLabelFontSize)
                    .attr('font-weight', axisLabelFontWeight);

                axisYLabelLane
                    .append('text')
                    .attr('class', 'label label--y')
                    .attr('transform', 'rotate(-90)')
                    .attr('text-anchor', 'middle')
                    .attr('y', axisYLabelLaneWidth / 2)
                    .attr('x', -g_h / 2)
                    .attr('fill', '#000')
                    .attr('fill-opacity', axisLabelFontOpacity)
                    .text(axisYLabel)
                    .attr('font-size', axisLabelFontSize)
                    .attr('font-weight', axisLabelFontWeight);

                if (isAxisXTime || isAxisXNumber) {
                    const extent = [
                        [left + axisYLaneWidth + axisYLabelLaneWidth, top + __offsetTop__],
                        [w - right - __offsetRight__, h - axisXLaneHeight - axisXLabelLaneHeight]
                    ];

                    const brushed = ({ start, end }) => emit(this, 'range-updated', start, end);

                    axisXLane
                        .call(responsiveAxisX, xAxis, xScale);

                    svg
                        .call(brushX, extent, xScale, { brushed }, data);
                }

                const g = svg
                    .append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth + axisYLaneWidth}, ${top + __offsetTop__})`);

                const enter = g.selectAll('rect')
                    .data(data)
                    .enter();

                const rects = enter
                    .append('rect')
                    .attr('clip-path', `url(#${clipPathId})`)
                    .attr('x', d => xScale(d.key))
                    .attr('y', g_h)
                    .attr('height', 0)
                    .attr('width', xScale.bandwidth())
                    .attr('fill', fill)
                    .attr('stroke', stroke)
                    .attr('fill-opacity', fillOpacity)
                    .attr('stroke-opacity', strokeOpacity);

                let lastI = 0;
                rects
                    .transition()
                    .duration(isNumber(animationDuration) ? animationDuration : 0)
                    .delay(d => {
                         return d. value !== 0
                            ? (lastI++) * (isNumber(delay) ? delay : 0)
                            : 0;
                    })
                    .attr('y', d => yScale(d.value))
                    .attr('height', d => g_h - yScale(d.value));

                rects
                    .on('mouseover', showTip(barTitle))
                    .on('mouseout', hideTip);

                if ((isAxisXTime || isAxisXNumber) && isNumber(axisXInterval)) {
                    rects.on('mousedown', d => {
                        const start = d.key,
                            end = isAxisXTime ? new Date(d.key.valueOf() + axisXInterval) : (d.key + axisXInterval);

                        emit(this, 'range-updated', start, end);
                    });
                }

                axisXLane
                    .call(axisShow, isAxisPathShow, isAxisTickShow)
                    .selectAll('text')
                    .call(wrap, xScale.bandwidth());
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawVerticalBar();
            },
            onResize() {
                this.safeDraw();
            }
        }
    }
</script>

<style>
    @import url(../../css/index.css);

    .d3-vertical-bar rect:not(.overlay):hover {
        cursor: pointer;
    }

    .d3-vertical-bar text {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: pointer;
    }
</style>

