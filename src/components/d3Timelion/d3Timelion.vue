<template>
    <div class="d3-timelion" :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import { isNull, isNumber } from 'lodash';
    import moment from 'moment';
    import uuid from 'uuid/v1';
    import mixins from '../../mixins';
    import { showTip, hideTip } from '../../plugins/tooltip';
    import tickFormat from '../../utils/tickFormat';
    import { responsiveAxisX } from '../../plugins/responsiveAxis';
    import wrap from '../../plugins/wrap';
    import emit from '../../utils/emit';
    import INTERVAL from '../../utils/interval';
    import { selectPaddingInnerOuterX, selectTicksNumY } from '../../utils/select';
    import isAxisTime from '../../utils/isAxisTime';
    import { brushX } from '../../plugins/brush';
    import axisShow from '../../plugins/axisShow';
    import { yRuler } from '../../plugins/ruler';

    const tpl = `
                <option value='Auto'>Auto</option>
                <option value="${INTERVAL.Millisecond}">Millisecond</option>
                <option value="${INTERVAL.Second}">Second</option>
                <option value="${INTERVAL.Minute}">Minute</option>
                <option value="${INTERVAL.Hour}">Hourly</option>
                <option value="${INTERVAL.Day}">Daily</option>
                <option value="${INTERVAL.Week}">Weekly</option>
                <option value="${INTERVAL.Month}">Monthly</option>
                <option value="${INTERVAL.Year}">Yearly</option>`;

    export default {
        name: 'd3-timelion',
        data() {
            return {
                interval: 'Auto'
            }
        },
        mixins: [mixins],
        methods: {
            updateTimeRangeLabel({ start, end }) {
                d3.select(this.$el)
                    .select('.label--time')
                    .text(() => this.getTimeRangeLabel(start, end));
            },
            drawTimelion() {
                const { left = 0, top = 0, right = 0, bottom = 0 } = this.margin,
                    {
                        fill = '#6eadc1',
                        stroke = '#6eadc1',
                        fillOpacity = 0.6,
                        strokeOpacity = 1,

                        barTitle = d => `${d.key}<br>${d.value}`,

                        tickSize = 10,
                        tickPadding = 8,

                        axisXLaneHeight = 35,
                        axisYLaneWidth = 60,

                        axisXLabel = null,
                        axisYLabel = null,

                        axisFontSize = 12,
                        axisFontWeight = 400,
                        axisFontOpacity = 0.5,

                        axisLabelFontSize = 14,
                        axisLabelFontWeight = 600,
                        axisLabelFontOpacity = 1,

                        timeRangeLabelFontSize = 12,
                        timeRangeLabelFontWeight = 400,
                        timeRangeLabelFontOpacity = 0.5,

                        axisXInterval = null,

                        isAxisPathShow = false,
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
                    [w, h] = this.getElWidthHeight(), __timeRangeLabelLaneHeight__ = 40, __offsetRight__ = 10,
                    g_w = w - left - right - axisYLabelLaneWidth - axisYLaneWidth - __offsetRight__,
                    g_h = h - top - bottom - axisXLaneHeight - axisXLabelLaneHeight - __timeRangeLabelLaneHeight__,
                    clipPathId = uuid(), isAxisXTime = isAxisTime(data), axisXTickFormat = value => tickFormat(value, axisXInterval),
                    ticks = selectTicksNumY(g_h), [paddingInner, paddingOuter] = selectPaddingInnerOuterX(g_w), isMobile = g_w <= 560;
                const self = this;

                if (![g_w, g_h].every(el => el > 0) || !isAxisXTime) return;

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
                    .attr('width', w)
                    .attr('height', h);

                const xScale = d3.scaleBand()
                    .domain(data.map(d => d.key))
                    .range([0, g_w])
                    .paddingInner([paddingInner])
                    .paddingOuter([paddingOuter]);

                const yScale = d3.scaleLinear()
                    .domain(negative ? d3.extent(data, d => d.value) : [0, d3.max(data, d => d.value)])
                    .range([g_h, 0]);
                if (nice) yScale.nice();

                const xAxis = d3
                    .axisBottom(xScale)
                    .tickSize(tickSize)
                    .tickPadding(tickPadding)
                    .tickFormat(axisXTickFormat);

                const yAxis = d3
                    .axisLeft(yScale)
                    .ticks(ticks)
                    .tickFormat(d3.format(axisYTickFormat))
                    .tickSize(tickSize)
                    .tickPadding(tickPadding);

                const axisXLane = svg
                    .append('g')
                    .attr('transform', `translate(${left + axisXLabelLaneHeight + axisYLaneWidth}, ${top + g_h + __timeRangeLabelLaneHeight__})`);

                axisXLane
                    .append('g')
                    .attr('class', 'axis axis--x')
                    .call(xAxis)
                    .attr('font-size', axisFontSize)
                    .attr('opacity', axisFontOpacity)
                    .attr('font-weight', axisFontWeight)
                    .call(responsiveAxisX, xAxis, xScale)
                    .call(axisShow, isAxisPathShow, isAxisTickShow)
                    .selectAll('text')
                    .call(wrap, xScale.bandwidth());

                const axisYLane = svg
                    .append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth}, ${top + __timeRangeLabelLaneHeight__})`);

                axisYLane
                    .append('g')
                    .attr('class', 'axis axis--y')
                    .attr('transform', `translate(${axisYLaneWidth}, 0)`)
                    .call(yAxis)
                    .call(axisShow, isAxisPathShow, isAxisTickShow)
                    .attr('font-size', axisFontSize)
                    .attr('opacity', axisFontOpacity)
                    .attr('font-weight', axisFontWeight);
                if (yAxisRuler) axisYLane.call(yRuler, yScale, g_w, d3.format(axisYTickFormat), ticks, tickSize, tickPadding);

                const axisXLabelLane = svg
                    .append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth + axisYLaneWidth}, ${top + g_h + axisXLaneHeight + __timeRangeLabelLaneHeight__})`);

                const axisYLabelLane = svg
                    .append('g')
                    .attr('transform', `translate(${left}, ${top + __timeRangeLabelLaneHeight__})`);

                axisXLabelLane
                    .append('text')
                    .attr('x', g_w / 2)
                    .attr('y', axisXLabelLaneHeight / 2)
                    .attr('dy', '0.32em')
                    .attr('text-anchor', 'middle')
                    .attr('fill', '#000')
                    .text(axisXLabel)
                    .attr('font-size', axisLabelFontSize)
                    .attr('fill-opacity', axisLabelFontOpacity)
                    .attr('font-weight', axisLabelFontWeight);

                axisYLabelLane
                    .append('text')
                    .attr('text-anchor', 'middle')
                    .attr('transform', 'rotate(-90)')
                    .attr('y', axisYLabelLaneWidth / 2)
                    .attr('x', -g_h / 2)
                    .text(axisYLabel)
                    .attr('font-size', axisLabelFontSize)
                    .attr('fill-opacity', axisLabelFontOpacity)
                    .attr('font-weight', axisLabelFontWeight);

                const timeRangeLabelLane = svg
                    .append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth + axisYLaneWidth}, ${top})`);

                const [dateTimeStart, dateTimeEnd] = d3.extent(data.map(d => d.key));

                const timeRangeLabel = timeRangeLabelLane
                    .append('text')
                    .attr('class', 'label--time')
                    .attr('text-anchor', 'middle')
                    .attr('x', g_w / 2 - 75)
                    .attr('y', __timeRangeLabelLaneHeight__ / 2)
                    .attr('dy', '0.32em')
                    .attr('fill', '#000')
                    .attr('font-size', timeRangeLabelFontSize)
                    .attr('font-weight', timeRangeLabelFontWeight)
                    .attr('fill-opacity', timeRangeLabelFontOpacity)
                    .attr('clip-path', `url(#${clipPathId})`)
                    .text(() => this.getTimeRangeLabel(dateTimeStart, dateTimeEnd));

                if (!isMobile) {
                    const timeRangeLabelRect = timeRangeLabel.node().getBBox();

                    const foreignObject = timeRangeLabelLane
                        .append('foreignObject');

                    foreignObject
                        .attr('transform', `translate(${timeRangeLabelRect.x + timeRangeLabelRect.width}, ${top})`)
                        .attr('width', g_w - timeRangeLabelRect.x - timeRangeLabelRect.width);

                    foreignObject
                        .attr('height', __timeRangeLabelLaneHeight__)
                        .append('xhtml:select')
                        .attr('pointer-events', 'none')
                        .on('change', () => {
                            const targetVal = d3.event.target.value,
                                val = targetVal === 'Auto' ? targetVal : Number.parseInt(targetVal, 10);

                            this.interval = val;
                            emit(self, 'interval-updated', this.interval);
                        })
                        .html(tpl)
                        .property('value', this.interval);
                }

                const extent = [
                    [left + axisYLabelLaneWidth + axisYLaneWidth, top + __timeRangeLabelLaneHeight__],
                    [w - right - __offsetRight__, g_h + top + __timeRangeLabelLaneHeight__]
                ];

                const brushed = ({ start, end }) => emit(this, 'range-updated', start, end);
                const brushing = this.updateTimeRangeLabel;

                svg.call(brushX, extent, xScale, { brushed, brushing }, data);

                const g = svg
                    .append('g')
                    .attr('transform', `translate(${left + axisXLabelLaneHeight + axisYLaneWidth}, ${top + __timeRangeLabelLaneHeight__})`);

                const enter = g.selectAll('rect')
                    .data(data)
                    .enter();

                const rects = enter
                    .append('rect')
                    .attr('x', d => xScale(d.key))
                    .attr('width', xScale.bandwidth())
                    .attr('y', g_h)
                    .attr('height', 0)
                    .attr('fill', fill)
                    .attr('fill-opacity', fillOpacity)
                    .attr('stroke', stroke)
                    .attr('stroke-opacity', strokeOpacity);

                rects
                    .on('mousedown', (d) => {
                        if (!isNumber(axisXInterval)) return;

                        const start = d.key,
                            end = new Date(d.key.valueOf() + axisXInterval);

                        emit(this, 'range-updated', start, end);
                    })
                    .on('mouseover', showTip(barTitle))
                    .on('mouseout', hideTip);

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
            },
            getTimeRangeLabel(dateTimeStart, dateTimeEnd) {
                const FORMAT = 'YYYY-MM-DD HH:mm:ss.SSS';

                return `From ${moment(dateTimeStart).format(FORMAT)} To ${moment(dateTimeEnd).format(FORMAT)}`;
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawTimelion();
            },
            onResize() {
                this.safeDraw();
            }
        }
    }
</script>

<style>
    @import url(../../css/index.css);

    .d3-timelion select {
        outline: none;
    }

    .d3-timelion rect:not(.overlay):hover {
        cursor: pointer;
    }

    .d3-timelion text {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: pointer;
    }

    .d3-timelion select {
        float: left;
        width: 145px;
        margin-left: 5px;
        height: 36px;
        padding: 5px 15px;
        background-color: #fff;
        background-image: none;
        border: 2px solid #ecf0f1;
        border-radius: 4px;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
        transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    }

    .d3-timelion select:focus {
        cursor: pointer;
        border: 2px solid #ccc;
    }

    .d3-timelion select:hover {
        cursor: pointer;
    }

    .d3-timelion select:-moz-focusring {
        color: transparent;
        text-shadow: 0 0 0 #000;
    }

    .d3-timelion option:not(:checked) {
        color: black;
    }
</style>
