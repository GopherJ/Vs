<template>
    <div :style="{ 'width' : width, 'height' : height}" class="d3-line"></div>
</template>

<script>
    import * as d3 from 'd3';
    import _ from 'lodash';
    import mixins from '../../mixins';
    import {showTip, hideTip} from '../../util/tooltip';
    import brush from '../../util/brush';
    import responsiveAxis from '../../util/responsiveAxis';
    import wrap from '../../util/wrap';
    import timeFormat from '../../util/timeFormat';
    import {selectTicksNumY} from '../../util/select';
    import {
        transformFirstTickTextToTextAnchorStart,
        transformLastTickTextToTextAnchorEnd
    } from '../../util/transformTick';

    export default {
        name: 'd3-line',
        mixins: [mixins],
        methods: {
            drawLine() {
                const [w, h] = this.getElWidthHeight();

                const data = _.cloneDeep(this.data),
                    {left = 0, top = 0, right = 0, bottom = 0} = this.margin,
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
                        circleColor = 'rgba(188, 82, 188)',

                        circleTitle = d => `${d.value}`,

                        curve = 'curveCardinal',

                        axisXLabel = null,
                        axisYLabel = null,

                        axisLabelFontSize = 12,
                        axisLabelFontWeight = 400,
                        axisLabelFontOpacity = 0.5,

                        isAxisPathShow = true,

                        isAxisXTime = true,
                        axisXTimeInterval = null,
                        sort = true,

                        breakWords = true,

                        axisYTickFormat = '.2s'
                    } = this.options,
                    {
                        axisXLabelLaneHeight = _.isNull(axisXLabel) ? 0 : 30,
                        axisYLabelLaneWidth = _.isNull(axisYLabel) ? 0 : 30,
                    } = this.options,
                    offsetTop = 10,
                    offsetRight = 10,
                    g_w = w - left - right - axisYLabelLaneWidth - axisYLaneWidth - offsetRight,
                    g_h = h - top - bottom - axisXLabelLaneHeight - axisXLaneHeight - offsetTop,
                    ticks = selectTicksNumY(g_h);

                const axisXTickFormat = (value) => {
                    if (!isAxisXTime || _.isString(value)) {
                        return value;
                    }

                    return _.isNumber(value)
                        ? timeFormat(new Date(value), axisXTimeInterval)
                        : timeFormat(value, axisXTimeInterval);
                };

                if (isAxisXTime && sort) {
                    data.sort((a, b) => a.key > b.key ? 1 : -1);
                }

                const xScale = d3.scalePoint()
                    .domain(data.map(d => d.key))
                    .range([0, g_w]);

                const yScale = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d.value)])
                    .range([g_h, 0]);

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
                    .attr('width', `${w}`)
                    .attr('height', `${h}`);

                if (isAxisXTime) {
                    const extent = [
                        [left + axisYLaneWidth + axisYLabelLaneWidth, top + offsetTop],
                        [w - right - offsetRight, h - axisXLaneHeight - axisXLabelLaneHeight]
                    ];

                    svg.call(brush.bind(this), extent, xScale, data);
                }

                svg.append('defs')
                    .append('clipPath')
                    .attr('id', 'clip-line')
                    .append('rect')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', g_w)
                    .attr('height', g_h);

                const g = svg.append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth + axisYLaneWidth}, ${top + offsetTop})`)
                    .attr('width', `${g_w}`)
                    .attr('height', `${g_h}`);

                const xAxis = d3
                    .axisBottom(xScale)
                    .tickFormat(axisXTickFormat)
                    .tickSize(tickSize)
                    .tickPadding(tickPadding);

                const axisXLane = svg
                    .append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth + axisYLaneWidth}, ${top + g_h + offsetTop})`)
                    .attr('width', g_w)
                    .attr('height', axisXLaneHeight);

                const axisYLane = svg
                    .append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth}, ${top + offsetTop})`)
                    .attr('width', axisYLaneWidth)
                    .attr('height', g_h);

                axisXLane
                    .append('g')
                    .attr('class', 'axis axis--x')
                    .call(xAxis)
                    .attr('font-size', axisFontSize)
                    .attr('fill-opacity', axisFontOpacity)
                    .attr('font-weight', axisFontWeight);

                axisYLane
                    .append('g')
                    .attr('transform', `translate(${axisYLaneWidth}, 0)`)
                    .attr('class', 'axis axis--y')
                    .call(d3
                        .axisLeft(yScale)
                        .ticks(ticks)
                        .tickFormat(d3.format(axisYTickFormat))
                        .tickSize(tickSize)
                        .tickPadding(tickPadding))
                    .attr('font-size', axisFontSize)
                    .attr('fill-opacity', axisFontOpacity)
                    .attr('font-weight', axisFontWeight);

                if (isAxisXTime) {
                    transformFirstTickTextToTextAnchorStart(svg);
                    transformLastTickTextToTextAnchorEnd(svg);

                    axisXLane
                        .call(responsiveAxis, xAxis, xScale);
                }

                if (breakWords) {
                    axisXLane
                        .selectAll('text')
                        .call(wrap, xScale.step());
                }

                if (!isAxisPathShow) {
                    axisXLane.select('.domain')
                        .attr('display', 'none');

                    axisYLane.select('.domain')
                        .attr('display', 'none');
                }

                const axisXLabelLane = svg
                    .append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth + axisYLaneWidth}, ${top + g_h + axisXLaneHeight + offsetTop})`)
                    .attr('width', g_w)
                    .attr('height', axisXLabelLaneHeight);

                const axisYLabelLane = svg
                    .append('g')
                    .attr('transform', `translate(${left}, ${top + offsetTop})`)
                    .attr('width', axisYLabelLaneWidth)
                    .attr('height', g_h);

                g.append('path')
                    .datum(data)
                    .attr('d', lineGen)
                    .attr('clip-path', 'url(#clip-line)')
                    .attr('fill', 'transparent')
                    .attr('stroke', stroke)
                    .attr('stroke-width', strokeWidth);

                g.selectAll('circle')
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
