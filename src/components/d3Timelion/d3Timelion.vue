<template>
    <div class="d3-timelion" :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import _ from 'lodash';
    import moment from 'moment';
    import mixins from '../../mixins';
    import {showTip, hideTip} from '../../util/tooltip';
    import timeFormat from '../../util/timeFormat';
    import {responsiveAxisX} from '../../util/responsiveAxis';
    import wrap from '../../util/wrap';
    import emit from '../../util/emit';
    import INTERVAL from '../../util/interval';
    import {selectPaddingInnerOuterX, selectTicksNumY} from '../../util/select';

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
            updateTimeRangeLabel(dateTimeStart, dateTimeEnd) {
                d3.select(this.$el)
                    .select('.label--time')
                    .text(() => this.getTimeRangeLabel(dateTimeStart, dateTimeEnd));
            },
            drawTimelion() {
                const data = _.cloneDeep(this.data),
                    [w, h] = this.getElWidthHeight(),
                    {left = 0, top = 0, right = 0, bottom = 0} = this.margin,
                    {
                        fill = '#6eadc1',
                        stroke = '#6eadc1',
                        fillOpacity = 0.6,
                        strokeOpacity = 1,

                        barTitle = d => `${d.value}`,

                        tickSize = 10,
                        tickPadding = 8,

                        axisXLaneHeight = 60,
                        axisYLaneWidth = 35,

                        axisXLabel = null,
                        axisYLabel = null,

                        axisFontSize = 12,
                        axisFontWeight = 400,
                        axisFontOpacity = 1,

                        axisLabelFontSize = 12,
                        axisLabelFontWeight = 400,
                        axisLabelFontOpacity = 0.5,

                        timeRangeLabelLaneHeight = 40,

                        timeRangeLabelFontSize = 12,
                        timeRangeLabelFontWeight = 400,
                        timeRangeLabelFontOpacity = 0.5,

                        axisXTimeInterval = null,
                        sort = true,

                        isAxisPathShow = true,

                        animationDuration = 1000,
                        delay = 50,

                        axisYTickFormat = '.2s'
                    } = this.options,
                    {
                        axisXLabelLaneHeight = _.isNull(axisXLabel) ? 0 : 60,
                        axisYLabelLaneWidth = _.isNull(axisYLabel) ? 0 : 60,
                    } = this.options,
                    g_w = w - left - right - axisYLabelLaneWidth - axisYLaneWidth,
                    g_h = h - top - bottom - axisXLaneHeight - axisXLabelLaneHeight - timeRangeLabelLaneHeight,
                    ticksY = selectTicksNumY(g_h),
                    [paddingInner, paddingOuter] = selectPaddingInnerOuterX(g_w),
                    isMobile = g_w <= 560,
                    self = this;

                if (![g_w, g_h].every(el => el > 0)) {
                    return;
                }

                const axisXTickFormat = (value) => {
                    return _.isNumber(value)
                        ? timeFormat(new Date(value), axisXTimeInterval)
                        : timeFormat(value, axisXTimeInterval);
                };

                if (sort) {
                    data.sort((a, b) => a.key > b.key ? 1 : -1);
                }

                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);

                svg.append('defs')
                    .append('clipPath')
                    .attr('id', 'clip-timelion')
                    .append('rect')
                    .attr('width', w)
                    .attr('height', h);

                const b = svg.append('g')
                    .attr('class', 'brush');

                const extent = [
                    [left + axisYLabelLaneWidth + axisYLaneWidth, top + timeRangeLabelLaneHeight],
                    [w - right, g_h + top + timeRangeLabelLaneHeight]
                ];

                const brushX = d3.brushX()
                    .extent(extent)
                    .on('brush', brushing)
                    .on('end', brushed);

                b.call(brushX);

                function brushing() {
                    if (d3.event && d3.event.selection) {
                        const [x1, x2] = Array.prototype.map
                            .call(d3.event.selection, el => el - extent[0][0]);

                        const bisecLeft = d3.bisector((d, x) => xScale(d.key) + xScale.bandwidth() - x).left;

                        let idx1 = bisecLeft(data, x1),
                            idx2 = bisecLeft(data, x2);

                        if (idx2 > data.length - 1) {
                            idx2 -= 1;
                        }

                        const dateTimeStart = _.isNumber(data[idx1].key) ? new Date(data[idx1].key) : data[idx1].key,
                            dateTimeEnd = _.isNumber(data[idx2].key) ? new Date(data[idx2].key) : data[idx2].key;

                        self.updateTimeRangeLabel(dateTimeStart, dateTimeEnd);
                    }
                }

                function brushed() {
                    if (d3.event && d3.event.selection) {
                        const [x1, x2] = Array.prototype.map
                            .call(d3.event.selection, el => el - extent[0][0]);

                        const bisecLeft = d3.bisector((d, x) => xScale(d.key) + xScale.bandwidth() - x).left;

                        let idx1 = bisecLeft(data, x1),
                            idx2 = bisecLeft(data, x2);

                        if (idx2 > data.length - 1) {
                            idx2 -= 1;
                        }

                        const dateTimeStart = _.isNumber(data[idx1].key) ? new Date(data[idx1].key) : data[idx1].key,
                            dateTimeEnd = _.isNumber(data[idx2].key) ? new Date(data[idx2].key) : data[idx2].key;

                        emit(self, 'range-updated', dateTimeStart, dateTimeEnd);

                        brushX.move(b, null);
                    }
                }

                const g = svg.append('g')
                    .attr('transform', `translate(${left + axisXLabelLaneHeight + axisYLaneWidth}, ${top + timeRangeLabelLaneHeight})`)
                    .attr('width', g_w)
                    .attr('height', g_h);

                const xScale = d3.scaleBand()
                    .domain(data.map(d => d.key))
                    .range([0, g_w])
                    .paddingInner([paddingInner])
                    .paddingOuter([paddingOuter]);

                const yScale = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d.value)])
                    .range([g_h, 0]);

                const [dateTimeStart, dateTimeEnd] = d3.extent(data.map(d => _.isNumber(d.key) ? new Date(d.key) : d.key));

                const axisXLane = svg.append('g')
                    .attr('transform', `translate(${left + axisXLabelLaneHeight + axisYLaneWidth}, ${top + g_h + timeRangeLabelLaneHeight})`)
                    .attr('width', g_w)
                    .attr('height', axisXLaneHeight);

                const xAxis = d3
                    .axisBottom(xScale)
                    .tickSize(tickSize)
                    .tickPadding(tickPadding)
                    .tickFormat(axisXTickFormat);

                axisXLane
                    .append('g')
                    .attr('class', 'axis axis--x')
                    .call(xAxis)
                    .attr('font-size', axisFontSize)
                    .attr('fill-opacity', axisFontOpacity)
                    .attr('font-weight', axisFontWeight);

                axisXLane
                    .call(responsiveAxisX, xAxis, xScale);

                axisXLane
                    .selectAll('text')
                    .call(wrap, xScale.bandwidth());

                const axisYLane = svg
                    .append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth}, ${top + timeRangeLabelLaneHeight})`)
                    .attr('width', axisYLaneWidth)
                    .attr('height', g_h);

                axisYLane
                    .append('g')
                    .attr('class', 'axis axis--y')
                    .attr('transform', `translate(${axisYLaneWidth}, 0)`)
                    .call(d3
                        .axisLeft(yScale)
                        .ticks(ticksY)
                        .tickFormat(d3.format(axisYTickFormat))
                        .tickSize(tickSize)
                        .tickPadding(tickPadding))
                    .attr('font-size', axisFontSize)
                    .attr('fill-opacity', axisFontOpacity)
                    .attr('font-weight', axisFontWeight);

                if (!isAxisPathShow) {
                    axisXLane
                        .selectAll('.domain')
                        .attr('display', 'none');

                    axisYLane
                        .selectAll('.domain')
                        .attr('display', 'none');
                }

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
                        if (_.isNumber(axisXTimeInterval)) {
                            const dateTimeStart = _.isNumber(d.key) ? new Date(d.key) : new Date(d.key.getTime()),
                                dateTimeEnd = _.isNumber(d.key) ? new Date(d.key + axisXTimeInterval) : new Date(d.key.getTime() + axisXTimeInterval);

                            emit(this, 'range-updated', dateTimeStart, dateTimeEnd);
                        }
                    })
                    .on('mouseover', d => {
                        showTip(barTitle(d));
                    })
                    .on('mouseout', hideTip);

                rects
                    .transition()
                    .duration(animationDuration)
                    .delay((d, i) => i * delay)
                    .attr('y', d => yScale(d.value))
                    .attr('height', d => g_h - yScale(d.value));

                const axisYLabelLane = svg.append('g')
                    .attr('transform', `translate(${left}, ${top + timeRangeLabelLaneHeight})`)
                    .attr('width', axisYLabelLaneWidth)
                    .attr('height', g_h);

                const axisXLabelLane = svg.append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth + axisYLaneWidth}, ${top + g_h + axisXLaneHeight + timeRangeLabelLaneHeight})`)
                    .attr('width', g_w)
                    .attr('height', axisXLabelLaneHeight);

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

                const timeRangeLabelLane = svg.append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth + axisYLaneWidth}, ${top})`)
                    .attr('width', g_w)
                    .attr('height', timeRangeLabelLaneHeight);

                const timeRangeLabel = timeRangeLabelLane.append('text')
                    .attr('class', 'label--time')
                    .attr('text-anchor', 'middle')
                    .attr('x', g_w / 2)
                    .attr('y', timeRangeLabelLaneHeight / 2)
                    .attr('dy', '0.32em')
                    .attr('fill', '#000')
                    .attr('font-size', timeRangeLabelFontSize)
                    .attr('font-weight', timeRangeLabelFontWeight)
                    .attr('fill-opacity', timeRangeLabelFontOpacity)
                    .attr('clip-path', 'url(#clip-timelion)')
                    .text(() => this.getTimeRangeLabel(dateTimeStart, dateTimeEnd));

                const timeRangeLabelPos = timeRangeLabel.node().getBBox();

                const foreignObject = timeRangeLabelLane
                    .append('foreignObject');

                if (!isMobile) {
                    foreignObject
                        .attr('transform', `translate(${timeRangeLabelPos.x + timeRangeLabelPos.width}, ${top})`)
                        .attr('width', g_w - timeRangeLabelPos.x - timeRangeLabelPos.width);

                } else {
                    foreignObject
                        .attr('transform', `translate(${timeRangeLabelPos.x + timeRangeLabelPos.width / 2}, ${top + timeRangeLabelLaneHeight})`)
                        .attr('width', g_w - timeRangeLabelPos.x - timeRangeLabelPos.width / 2);

                }

                foreignObject
                    .attr('height', timeRangeLabelLaneHeight)
                    .append('xhtml:select')
                    .on('change', () => {
                        const targetVal = d3.event.target.value,
                            val = targetVal === 'Auto' ? targetVal : Number.parseInt(targetVal, 10);

                        this.interval = val;
                        emit(self, 'interval-updated', this.interval);
                    })
                    .html(tpl)
                    .property('value', this.interval);
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

    .d3-timelion rect:hover {
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
        height: 32px;
        padding: 5px 15px;
        background-color: #fff;
        background-image: none;
        border: 1px solid #ecf0f1;
        border-top-width: 2px;
        border-right-width: 2px;
        border-bottom-width: 2px;
        border-left-width: 2px;
        border-radius: 4px;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
        transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    }

    .d3-timelion select:focus {
        border: 2px solid #ccc;
    }

    .d3-timelion select:-moz-focusring {
        color: transparent;
        text-shadow: 0 0 0 #000;
    }

    .d3-timelion option:not(:checked) {
        color: black;
    }
</style>
