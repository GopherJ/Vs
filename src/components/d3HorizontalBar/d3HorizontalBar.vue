<template>
    <div class="d3-horizontal-bar" :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import mixins from '../../mixins';
    import {showTip, hideTip} from '../../utils/tooltip';
    import timeFormat from '../../utils/timeFormat';
    import emit from '../../utils/emit';
    import {selectTicksNumX, selectPaddingInnerOuterY} from '../../utils/select';
    import {transformLastTickTextToTextAnchorEnd} from '../../utils/transformTick';
    import {responsiveAxisY} from '../../utils/responsiveAxis';
    import isValidDate from '../../utils/isValidDate';
    import {brushY} from '../../utils/brush';
    import _ from 'lodash';

    export default {
        name: 'd3-horizontal-bar',
        mixins: [mixins],
        methods: {
            drawVerticalBar() {
                const [w, h] = this.getElWidthHeight();

                const data = _.cloneDeep(this.data),
                    {
                        fill = '#6eadc1',
                        stroke = '#6eadc1',
                        fillOpacity = 0.6,
                        strokeOpacity = 1,

                        barTitle = d => `${d.value}`,

                        axisFontSize = 12,
                        axisFontWeight = 400,
                        axisFontOpacity = 1,

                        tickSize = 10,
                        tickPadding = 8,

                        axisXLabel = null,
                        axisYLabel = null,

                        axisLabelFontSize = 12,
                        axisLabelFontWeight = 400,
                        axisLabelFontOpacity = 0.5,

                        axisXLaneHeight = 30,
                        axisYLaneWidth = 120,

                        animationDuration = 1000,
                        delay = 50,

                        isShadowed = false,
                        shadowColor = 'rgb(230, 237, 244)',

                        isAxisPathShow = true,

                        isAxisYTime = true,
                        axisYTimeInterval = null,
                        sort = true,

                        axisXTickFormat = '.2s'
                    } = this.options,
                    {
                        axisXLabelLaneHeight = _.isNull(axisXLabel) ? 0 : 30,
                        axisYLabelLaneWidth = _.isNull(axisYLabel) ? 0 : 30,
                    } = this.options,
                    {left = 0, right = 0, top = 0, bottom = 0} = this.margin,
                    offsetRight = 10,
                    g_w = w - left - right - axisYLabelLaneWidth - axisYLaneWidth - offsetRight,
                    g_h = h - top - bottom - axisXLaneHeight - axisXLabelLaneHeight,
                    self = this;

                if (![g_w, g_h].every(el => el > 0)) {
                    return;
                }

                const ticks = selectTicksNumX(g_w),
                    [paddingInner, paddingOuter] = selectPaddingInnerOuterY(g_h);

                const axisYTickFormat = (value) => {
                    if (!isAxisYTime || _.isString(value)) {
                        return value;
                    }

                    return _.isNumber(value)
                        ? timeFormat(new Date(value), axisYTimeInterval)
                        : timeFormat(value, axisYTimeInterval);
                };

                if (isAxisYTime && sort) {
                    data.sort((a, b) => a.key > b.key ? 1 : -1);
                }

                const xScale = d3.scaleLinear()
                    .range([0, g_w])
                    .domain([0, d3.max(data, d => d.value)]);

                const yScale = d3.scaleBand()
                    .range([0, g_h])
                    .paddingInner([paddingInner])
                    .paddingOuter([paddingOuter])
                    .domain(data.map(d => d.key));

                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', `${w}`)
                    .attr('height', `${h}`);

                if (isAxisYTime) {
                    const b = svg.append('g')
                        .attr('class', 'brush');

                    const extent = [
                        [left + axisYLabelLaneWidth + axisYLaneWidth, top + axisXLaneHeight + axisXLabelLaneHeight],
                        [w - right - offsetRight, h - bottom]
                    ];

                    const brushX = d3.brushY()
                        .extent(extent)
                        .on('end', brushed);

                    b.call(brushX);

                    function brushed() {
                        if (d3.event && d3.event.selection) {
                            const [x1, x2] = Array.prototype.map
                                .call(d3.event.selection, el => el - extent[0][1]);

                            const bisecLeft = d3.bisector((d, x) => yScale(d.key) + yScale.bandwidth() - x).left;

                            let idx1 = bisecLeft(data, x1),
                                idx2 = bisecLeft(data, x2);

                            if (idx2 > data.length - 1) {
                                idx2 -= 1;
                            }

                            const dateTimeStart = _.isNumber(data[idx1].key) ? new Date(data[idx1].key) : data[idx1].key,
                                dateTimeEnd = _.isNumber(data[idx2].key) ? new Date(data[idx2].key) : data[idx2].key;

                            if ([dateTimeStart, dateTimeEnd].every(el => isValidDate(el))) {
                                emit(self, 'range-updated', dateTimeStart, dateTimeEnd);
                            }
                            brushX.move(b, null);
                        }
                    }
                }

                const g = svg
                    .append('g')
                    .attr('transform', `translate(${left + axisXLabelLaneHeight + axisYLaneWidth}, ${top + axisXLabelLaneHeight + axisXLaneHeight})`)
                    .attr('width', `${g_w}`)
                    .attr('height', `${g_h}`);

                const axisXLabelLane = svg
                    .append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth + axisYLaneWidth}, ${top})`)
                    .attr('width', g_w)
                    .attr('height', axisXLabelLaneHeight);

                const axisYLabelLane = svg
                    .append('g')
                    .attr('transform', `translate(${left}, ${top + axisXLaneHeight + axisXLabelLaneHeight})`)
                    .attr('width', axisYLabelLaneWidth)
                    .attr('height', g_h);

                const axisXLane = svg
                    .append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth + axisYLaneWidth},${top + axisXLabelLaneHeight})`)
                    .attr('width', g_w)
                    .attr('height', axisXLaneHeight);

                const axisYLane = svg
                    .append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth}, ${top + axisXLabelLaneHeight + axisXLaneHeight})`)
                    .attr('width', axisYLaneWidth)
                    .attr('height', g_h);

                axisXLane.append('g')
                    .attr('class', 'axis axis--x')
                    .attr('transform', `translate(0, ${axisXLaneHeight})`)
                    .call(d3
                        .axisTop(xScale)
                        .ticks(ticks)
                        .tickFormat(d3.format(axisXTickFormat))
                        .tickSize(tickSize)
                        .tickPadding(tickPadding))
                    .attr('font-size', axisFontSize)
                    .attr('font-weight', axisFontWeight)
                    .attr('fill-opacity', axisFontOpacity);

                transformLastTickTextToTextAnchorEnd(svg);

                const yAxis = d3
                    .axisLeft(yScale)
                    .tickFormat(axisYTickFormat)
                    .tickSize(tickSize)
                    .tickPadding(tickPadding);

                axisYLane.append('g')
                    .attr('class', 'axis axis--y')
                    .attr('transform', `translate(${axisYLaneWidth}, 0)`)
                    .call(yAxis)
                    .attr('font-size', axisFontSize)
                    .attr('font-weight', axisFontWeight)
                    .attr('fill-opacity', axisFontOpacity);

                if (isAxisYTime) {
                    axisYLane
                        .call(responsiveAxisY, yAxis, yScale);
                }

                if (!isAxisPathShow) {
                    axisXLane.select('.domain')
                        .attr('display', 'none');

                    axisYLane.select('.domain')
                        .attr('display', 'none');
                }

                const enter = g.selectAll('rect')
                    .data(data)
                    .enter();

                if (isShadowed && _.isString(shadowColor)) {
                    enter.append('rect')
                        .attr('x', 0)
                        .attr('y', d => yScale(d.key))
                        .attr('height', yScale.bandwidth())
                        .attr('width', g_w)
                        .attr('fill', shadowColor);
                }

                const rects = enter
                    .append('rect')
                    .attr('y', d => yScale(d.key))
                    .attr('x', 0)
                    .attr('width', 0)
                    .attr('height', yScale.bandwidth())
                    .attr('fill', fill)
                    .attr('stroke', stroke)
                    .attr('fill-opacity', fillOpacity)
                    .attr('stroke-opacity', strokeOpacity);

                rects
                    .on('mousedown', d => {
                        if (isAxisYTime && _.isNumber(axisYTimeInterval)) {
                            const dateTimeStart = _.isNumber(d.key) ? new Date(d.key) : new Date(d.key.getTime()),
                                dateTimeEnd = _.isNumber(d.key) ? new Date(d.key + axisYTimeInterval) : new Date(d.key.getTime() + axisYTimeInterval);

                            emit(this, 'range-updated', dateTimeStart, dateTimeEnd);
                        }
                    })
                    .on('mouseover', (d) => {
                        showTip(barTitle(d));
                    })
                    .on('mouseout', hideTip);

                rects
                    .transition()
                    .duration(animationDuration)
                    .delay((d, i) => i * (d.value === 0 ? 0 : (_.isNumber(delay) ? delay : 0)))
                    .attr('width', d => xScale(d.value));

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

    .d3-vertical-bar rect:hover {
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

