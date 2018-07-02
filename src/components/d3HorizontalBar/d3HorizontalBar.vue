<template>
    <div class="d3-horizontal-bar" :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import _ from 'lodash';
    import mixins from '../../mixins';
    import { showTip, hideTip } from '../../utils/tooltip';
    import tickFormat from '../../utils/tickFormat';
    import emit from '../../utils/emit';
    import { selectTicksNumX, selectPaddingInnerOuterY } from '../../utils/select';
    import { lastTickTextAnchorEnd } from '../../utils/textAnchor';
    import { responsiveAxisY } from '../../utils/responsiveAxis';
    import { brushY } from '../../utils/brush';
    import isAxisTime from '../../utils/isAxisTime';
    import isAxisNumber from '../../utils/isAxisNumber';
    import axisShow from '../../utils/axisShow';

    export default {
        name: 'd3-horizontal-bar',
        mixins: [mixins],
        methods: {
            drawVerticalBar() {
                const [w, h] = this.getElWidthHeight(),
                    data = _.cloneDeep(this.data),
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

                        isAxisPathShow = true,

                        axisYTimeInterval = null,

                        axisXTickFormat = '.2s',

                        negative = false,

                        nice = false
                    } = this.options,
                    {
                        axisXLabelLaneHeight = _.isNull(axisXLabel) ? 0 : 30,
                        axisYLabelLaneWidth = _.isNull(axisYLabel) ? 0 : 30,
                    } = this.options,
                    { left = 0, right = 0, top = 0, bottom = 0 } = this.margin,
                    __offsetRight__ = 10,
                    __offsetBottom__ = 10,
                    g_w = w - left - right - axisYLabelLaneWidth - axisYLaneWidth - __offsetRight__,
                    g_h = h - top - bottom - axisXLaneHeight - axisXLabelLaneHeight - __offsetBottom__;

                if (![g_w, g_h].every(el => el > 0)) return;

                const isAxisYTime = isAxisTime(data),
                    isAxisYNumber = isAxisNumber(data),
                    axisYTickFormat = value => isAxisYTime ? tickFormat(value, axisYTimeInterval) : value,
                    ticks = selectTicksNumX(g_w),
                    [paddingInner, paddingOuter] = selectPaddingInnerOuterY(g_h);

                const xScale = d3.scaleLinear()
                    .range([0, g_w])
                    .domain(negative ? d3.extent(data, d => d.value) : [0, d3.max(data, d => d.value)]);
                if (nice) xScale.nice();

                const yScale = d3.scaleBand()
                    .domain(data.map(d => d.key))
                    .range([0, g_h])
                    .paddingInner([paddingInner])
                    .paddingOuter([paddingOuter]);

                const xAxis = d3
                    .axisTop(xScale)
                    .ticks(ticks)
                    .tickFormat(d3.format(axisXTickFormat))
                    .tickSize(tickSize)
                    .tickPadding(tickPadding);

                const yAxis = d3
                    .axisLeft(yScale)
                    .tickFormat(axisYTickFormat)
                    .tickSize(tickSize)
                    .tickPadding(tickPadding);

                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);

                svg.append('defs')
                    .append('clipPath')
                    .attr('id', 'clip-horizontal-bar')
                    .append('rect')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', g_w)
                    .attr('height', g_h);

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
                    .call(xAxis)
                    .call(lastTickTextAnchorEnd)
                    .attr('font-size', axisFontSize)
                    .attr('font-weight', axisFontWeight)
                    .attr('fill-opacity', axisFontOpacity);

                axisYLane.append('g')
                    .attr('class', 'axis axis--y')
                    .attr('transform', `translate(${axisYLaneWidth}, 0)`)
                    .call(yAxis)
                    .call(axisShow, isAxisPathShow, true)
                    .attr('font-size', axisFontSize)
                    .attr('font-weight', axisFontWeight)
                    .attr('fill-opacity', axisFontOpacity);

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

                if (isAxisYTime || isAxisYNumber) {
                    const extent = [
                        [left + axisYLabelLaneWidth + axisYLaneWidth, top + axisXLaneHeight + axisXLabelLaneHeight],
                        [w - right - __offsetRight__, h - bottom - __offsetBottom__]
                    ];

                    axisYLane
                        .call(responsiveAxisY, yAxis, yScale);

                    svg
                        .call(brushY.bind(this), extent, yScale, data);
                }

                const g = svg
                    .append('g')
                    .attr('transform', `translate(${left + axisXLabelLaneHeight + axisYLaneWidth}, ${top + axisXLabelLaneHeight + axisXLaneHeight})`)
                    .attr('width', `${g_w}`)
                    .attr('height', `${g_h}`);

                const enter = g.selectAll('rect')
                    .data(data)
                    .enter();

                const rects = enter
                    .append('rect')
                    .attr('clip-path', 'url(#clip-horizontal-bar)')
                    .attr('y', d => yScale(d.key))
                    .attr('x', 0)
                    .attr('width', 0)
                    .attr('height', yScale.bandwidth())
                    .attr('fill', fill)
                    .attr('stroke', stroke)
                    .attr('fill-opacity', fillOpacity)
                    .attr('stroke-opacity', strokeOpacity);

                rects
                    .on('mouseover', showTip(barTitle))
                    .on('mouseout', hideTip);

                if (isAxisYTime && _.isNumber(axisYTimeInterval)) {
                    rects.on('mousedown', d => {
                            const dateTimeStart = d.key,
                                dateTimeEnd = new Date(d.key.getTime() + axisYTimeInterval);

                            emit(this, 'range-updated', dateTimeStart, dateTimeEnd);
                        });
                }

                rects
                    .transition()
                    .duration(_.isNumber(animationDuration) ? animationDuration : 0)
                    .delay((d, i) => i * (d.value === 0 ? 0 : (_.isNumber(delay) ? delay : 0)))
                    .attr('width', d => xScale(d.value));

                axisXLane
                    .call(axisShow, isAxisPathShow, true);
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

    .d3-horizontal-bar rect:hover {
        cursor: pointer;
    }

    .d3-horizontal-bar text {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: pointer;
    }
</style>

