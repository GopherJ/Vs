<template>
    <div class="d3-grouped-area" :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import { cloneDeep, isNull, isString, isUndefined } from 'lodash';
    import uuid from 'uuid/v1';
    import mixins from '../../mixins';
    import { selectTicksNumY } from '../../utils/select';
    import { brushX } from '../../plugins/brush';
    import isAxisTime from '../../utils/isAxisTime';
    import { responsiveAxisX } from '../../plugins/responsiveAxis';
    import axisShow from '../../plugins/axisShow';
    import groupBySum from '../../utils/groupBySum';
    import { lengendGenStatic } from '../../plugins/legendGen';
    import hash from '../../utils/hash';
    import { yRuler } from '../../plugins/ruler';
    import emit from '../../utils/emit';
    import { drawReferenceLineX } from '../../plugins/reference';
    import { showTip, hideTip } from '../../plugins/tooltip';

    export default {
        name: 'd3-grouped-area',
        mixins: [mixins],
        methods: {
            drawGroupedArea() {
                const __data__ = cloneDeep(this.data),
                    { left = 0, right = 0, top = 0, bottom = 0 } = this.margin,
                    {
                        fill = '#6eadc1',

                        crossWidth = 2,
                        crossColor = '#fff',

                        circleRadius = 5,
                        circleColor = '#6eadc1',

                        groupAreaTitle = d => `${d.key}<br>${d.group}<br>${d.value}`,

                        tickSize = 10,
                        tickPadding = 8,

                        axisFontSize = 12,
                        axisFontWeight = 400,
                        axisFontOpacity = 0.5,

                        axisXLaneHeight = 35,
                        axisYLaneWidth = 60,

                        axisXLabel = null,
                        axisYLabel = null,

                        axisXGroupLabelLaneHeight = 20,

                        axisXGroupLabelGap = 10,

                        axisXGroupLabelFontSize = 9,
                        axisXGroupLabelFontWeight = 400,
                        axisXGroupLabelFontOpacity = 0.5,

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
                    [w, h] = this.getElWidthHeight(), __offsetRight__ = 10,
                    g_w =  w - left - right - axisYLaneWidth - axisYLabelLaneWidth - __offsetRight__,
                    g_h = h -top - bottom - axisXLaneHeight - axisXLabelLaneHeight - axisXGroupLabelLaneHeight,
                    clipPathId = uuid(), isAxisXTime = isAxisTime(__data__), ticks = selectTicksNumY(g_h),
                    data = groupBySum(__data__), groups = Object.keys(data).map(x => ({ label: x, opacity: data[x].opacity }));

                if (![g_w, g_h].every(el => el > 0) || !isAxisXTime || !groups.length) return;

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

                const xScale = d3.scaleTime()
                    .domain(d3.extent(__data__, d => d.key))
                    .range([0, g_w]);

                const yScale = d3.scaleLinear()
                    .domain(negative ? d3.extent(__data__, d => d.value) : [0, d3.max(__data__, d => d.value)])
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

                const axisXGroupLabelLane = svg
                    .append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth + axisYLaneWidth}, ${top})`);

                axisXGroupLabelLane
                    .call(
                        lengendGenStatic,
                        svg,
                        groups,
                        g_w,
                        fill,
                        axisXGroupLabelLaneHeight,
                        crossColor,
                        crossWidth,
                        axisXGroupLabelFontSize,
                        axisXGroupLabelFontWeight,
                        axisXGroupLabelFontOpacity,
                        axisXGroupLabelGap
                    );

                const axisYLane = svg
                    .append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth}, ${top + axisXGroupLabelLaneHeight})`);

                const axisXLane = svg
                    .append('g')
                    .attr('transform', `translate(${left + axisYLaneWidth + axisYLabelLaneWidth}, ${top + g_h + axisXGroupLabelLaneHeight})`);

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
                    .append('g')
                    .attr('class', 'axis axis--x')
                    .call(xAxis)
                    .call(axisShow, isAxisPathShow, isAxisTickShow)
                    .attr('font-size', axisFontSize)
                    .attr('font-weight', axisFontWeight)
                    .attr('opacity', axisFontOpacity);

                axisXLane
                    .call(responsiveAxisX, xAxis, xScale);

                const axisXLabelLane = svg
                    .append('g')
                    .attr('transform', `translate(${left + axisYLaneWidth + axisYLabelLaneWidth}, ${top + g_h + axisXLaneHeight + axisXGroupLabelLaneHeight})`);

                const axisYLabelLane = svg
                    .append('g')
                    .attr('transform', `translate(${left}, ${top + axisXGroupLabelLaneHeight})`);

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
                    [left + axisYLabelLaneWidth + axisYLaneWidth, top + axisXGroupLabelLaneHeight],
                    [w - right - __offsetRight__, h - axisXLaneHeight - axisXLabelLaneHeight]
                ];

                const brushed = ({ start, end }) => emit(this, 'range-updated', start, end);

                svg
                    .call(brushX, extent, xScale, { brushed });

                const g = svg
                    .append('g')
                    .attr('clip-path', `url(#${clipPathId})`)
                    .attr('transform', `translate(${left + axisYLaneWidth + axisYLabelLaneWidth}, ${top + axisXGroupLabelLaneHeight})`);

                const area = d3.area()
                    .x(d => xScale(d.key))
                    .y0(yScale(0))
                    .y1(d => yScale(d.value));
                if (isString(curve) && !isUndefined(d3[curve])) area.curve(d3[curve]);

                g
                    .selectAll('path')
                    .data(groups)
                    .enter()
                    .append('path')
                    .attr('d', d => area(data[d.label].data))
                    .attr('class', d => hash(d.label))
                    .attr('fill', fill)
                    .attr('fill-opacity', d => d.opacity)
                    .attr('stroke', fill)
                    .attr('stroke-opacity', d => d.opacity);

                g.selectAll('circle')
                    .data(__data__)
                    .enter()
                    .append('circle')
                    .attr('class', d => hash(d.group))
                    .attr('visibility', 'hidden')
                    .attr('r', circleRadius)
                    .attr('cx', d => xScale(d.key))
                    .attr('cy', d => yScale(d.value))
                    .attr('fill', circleColor)
                    .attr('fill-opacity', d => groups.find(x => x.label === d.group).opacity)
                    .on('mouseover', showTip(groupAreaTitle))
                    .on('mouseout', hideTip);

                svg.call(drawReferenceLineX, g, g_w, g_h, xScale, __data__);
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawGroupedArea();
            },
            onResize() {
                this.safeDraw();
            }
        }
    }
</script>

<style>
    @import url(../../css/index.css);

    .d3-grouped-area path {
        pointer-events: none;
    }
    
    .d3-grouped-area circle {
        cursor: pointer;
    }

    .d3-grouped-area text {
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        cursor: pointer;
    }
</style>

