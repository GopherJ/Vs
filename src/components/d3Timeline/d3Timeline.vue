<template>
    <div class="d3-timeline" :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import uuid from 'uuid/v1';
    import { isNull, cloneDeep } from 'lodash';
    import mixins from '../../mixins';
    import roundedRect from '../../plugins/roundedRect';
    import zoom from '../../plugins/zoom';
    import emit from '../../utils/emit';
    import cursor from '../../plugins/cursor';
    import drawGen from './drawGen';
    import { selectPaddingInnerOuterY } from '../../utils/select';
    import { getTimelineGroups } from '../../utils/getTimelineGroups';
    import { brushX } from '../../plugins/brush';
    import { drawCurrentReferenceX } from '../../plugins/drawCurrentReference';

    export default {
        name: 'd3-timeline',
        data() {
            return {
                scale: null,
                timer: null,
                zoom: null,
                w: null,
                svg: null,
                initScale: null
            }
        },
        mixins: [mixins],
        methods: {
             updateTimeRange(dateTimeStart, dateTimeEnd) {
                const k = this.w / (this.initScale(dateTimeEnd) - this.initScale(dateTimeStart));
                const translateX = -this.initScale(dateTimeStart);

                this.svg
                    .transition()
                    .duration(360)
                    .call(this.zoom.transform, () => {
                        return d3.zoomIdentity
                            .scale(k)
                            .translate(translateX, 0);
                    });
            },
            drawTimeline() {
                const { dateTimeStart, dateTimeEnd, data, groups } = getTimelineGroups(cloneDeep(this.data)),
                      {
                        intervalCornerRadius = 4,

                        symbolSize = 400,

                        groupLabelFontSize = 12,
                        groupLabelFontWeight = 400,
                        groupLabelFontOpacity = 1,

                        groupLaneWidth = 200,

                        tickSize = 10,
                        tickPadding = 8,

                        axisXLaneHeight = 40,

                        axisFontSize = 12,
                        axisFontWeight = 600,
                        axisFontOpacity = 0.5,

                        axisXLabel = null,

                        axisLabelFontSize = 14,
                        axisLabelFontWeight = 600,
                        axisLabelFontOpacity = 1,

                        backgroundColor = 'rgba(255, 255, 255, 0.125)',

                        borderRadius = 0,
                        borderWidth = 2,
                        borderColor = 'rgba(0, 0, 0, .125)',

                        boundingLineWidth = 2,
                        boundingLineColor = 'rgba(0, 0, 0, .125)',

                        currentTimeLineWidth = 4,
                        currentTimeLineColor = 'rgba(255, 56, 96, 1)',

                        liveTimer = true,
                        liveTimerTick = 250,

                        scaleExtent = [0.05, Infinity]
                    } = this.options,
                    {
                      axisXLabelLaneHeight = isNull(axisXLabel) ? 0 : 30,
                    } = this.options,
                    { left = 0, top = 0, right = 0, bottom = 0 } = this.margin,
                    [w, h] = this.getElWidthHeight(), __offset__  = borderWidth,
                    g_w = w - left - right - groupLaneWidth - 2 * __offset__,
                    g_h = h - top - bottom - axisXLaneHeight - axisXLabelLaneHeight - 2 * __offset__,
                    entryClipPathId = uuid(), groupLabelClipPathId = uuid(), self = this;
                self.w = g_w;

                if (![g_w, g_h].every(el => el > 0) || !groups.length) return;

                const groupHeight = g_h / groups.length,
                    [paddingInner, paddingOuter] = selectPaddingInnerOuterY(groupHeight);

                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);
                self.svg = svg;

                const defs = svg
                    .append('defs');

                defs
                    .append('clipPath')
                    .attr('id', entryClipPathId)
                    .append('path')
                    .attr('d', roundedRect(0, 0, g_w, g_h + axisXLaneHeight, borderRadius - __offset__ / 2, false, true, false, true));

                defs
                    .append('clipPath')
                    .attr('id', groupLabelClipPathId)
                    .append('path')
                    .attr('d', roundedRect(0, 0, groupLaneWidth, g_h + axisXLaneHeight, borderRadius - __offset__ / 2, true, false, true, false));

                const xScale = d3.scaleTime()
                    .domain([dateTimeStart, dateTimeEnd])
                    .range([0, g_w]);
                self.scale = xScale;
                self.initScale = xScale.copy();

                const yScale = (i) => d3.scaleBand()
                    .range([groupHeight * (i + 1), groupHeight * i])
                    .paddingInner(paddingInner)
                    .paddingOuter(paddingOuter);

                const xAxis = d3
                    .axisBottom(xScale)
                    .tickSize(tickSize)
                    .tickPadding(tickPadding);

                svg
                    .append('path')
                    .attr('d', roundedRect(left + __offset__ / 2, top + __offset__ / 2, g_w + groupLaneWidth + __offset__, g_h + axisXLaneHeight + __offset__, borderRadius, true, true, true, true))
                    .attr('fill', backgroundColor)
                    .attr('stroke', borderColor)
                    .attr('stroke-width', borderWidth)
                    .attr('pointer-events', 'none');

                svg
                    .append('g')
                    .attr('class', 'label--group')
                    .attr('clip-path', `url(#${groupLabelClipPathId})`)
                    .attr('transform', `translate(${left + __offset__}, ${top + __offset__})`)
                    .selectAll('text')
                    .data(groups)
                    .enter()
                    .append('text')
                    .attr('x', groupLaneWidth / 2)
                    .attr('y', (d, i) =>  (2 * i + 1) * groupHeight / 2 )
                    .attr('dy', '0.32em')
                    .attr('text-anchor', 'middle')
                    .attr('font-size', groupLabelFontSize)
                    .attr('font-weight', groupLabelFontWeight)
                    .attr('fill-opacity', groupLabelFontOpacity)
                    .text(d => d)
                    .attr('fill', '#000');

                svg
                    .append('g')
                    .attr('class', 'line--x')
                    .attr('transform', `translate(${left + __offset__}, ${top + __offset__})`)
                    .selectAll('line')
                    .data(groups)
                    .enter()
                    .append('line')
                    .attr('y1', (d, i) => (i + 1) * groupHeight)
                    .attr('y2', (d, i) => (i + 1) * groupHeight)
                    .attr('x2', g_w + groupLaneWidth)
                    .attr('stroke', boundingLineColor)
                    .attr('stroke-width', boundingLineWidth);

                svg
                    .append('g')
                    .attr('class', 'line--y')
                    .attr('transform', `translate(${left + __offset__ + groupLaneWidth}, ${top + __offset__})`)
                    .append('line')
                    .attr('y2', g_h)
                    .attr('stroke', boundingLineColor)
                    .attr('stroke-width', boundingLineWidth);

                const axisXLane = svg
                    .append('g')
                    .attr('transform', `translate(${left + groupLaneWidth + __offset__}, ${top + g_h + __offset__})`)
                    .attr('class', 'axis axis--x')
                    .attr('font-size', axisFontSize)
                    .attr('font-weight', axisFontWeight)
                    .attr('fill-opacity', axisFontOpacity);

                const axisXLabelLane = svg
                    .append('g')
                    .attr('transform', `translate(${left + __offset__},${top + g_h + axisXLaneHeight + 2 * __offset__})`);

                axisXLabelLane
                    .append('text')
                    .attr('x', (g_w + groupLaneWidth) / 2)
                    .attr('y', axisXLabelLaneHeight / 2)
                    .attr('fill', '#000')
                    .attr('dy', '0.32em')
                    .attr('text-anchor', 'middle')
                    .text(axisXLabel)
                    .attr('font-size', axisLabelFontSize)
                    .attr('font-weight', axisLabelFontWeight)
                    .attr('fill-opacity', axisLabelFontOpacity);

                const brushExtent = [
                    [left + __offset__ + groupLaneWidth, top + __offset__],
                    [w - right - __offset__, h - axisXLaneHeight - __offset__ - axisXLabelLaneHeight]
                ];

                const zoomExtent = [
                    [left + __offset__ + groupLaneWidth, top + __offset__],
                    [w - right - __offset__, h - __offset__ - axisXLabelLaneHeight]
                ];

                const drawFn = drawGen(
                    axisXLane,
                    xAxis,
                    yScale,
                    data,
                    groups,
                    g_h,
                    symbolSize,
                    intervalCornerRadius,
                    currentTimeLineColor,
                    currentTimeLineWidth,
                    boundingLineColor,
                    boundingLineWidth
                );

                const brushed = ({ start, end }) => emit(this, 'range-updated', start, end);

                const zooming = () => {
                    self.scale = d3.event.transform.rescaleX(xScale);

                    svg
                        .call(brushX, brushExtent, self.scale, { brushed });

                    g.call(drawFn, self.scale);
                };

                const zoomend = () => {
                    const start = self.scale.invert(0),
                        end = self.scale.invert(g_w);

                    self.$emit('range-updated', start, end);
                };

                svg
                    .call(brushX, brushExtent, xScale, { brushed })
                    .call(cursor, axisXLane, [
                        [0, 0],
                        [g_w, axisXLaneHeight]
                    ]);
                self.zoom = zoom(svg, { zooming, zoomend }, scaleExtent, zoomExtent);

                const g = svg.append('g')
                    .attr('clip-path', `url(#${entryClipPathId})`)
                    .attr('transform', `translate(${left + __offset__ + groupLaneWidth}, ${top + __offset__})`);

                g.call(drawFn, self.scale);

                if (liveTimer) {
                    self.timer = setInterval(() => {
                        g.call(drawCurrentReferenceX, self.scale, g_h, currentTimeLineColor, currentTimeLineWidth);
                    }, liveTimerTick);
                }
            },
            safeDraw() {
                if (this.timer !== null) {
                    clearInterval(this.timer);
                }

                this.ifExistsSvgThenRemove();
                this.drawTimeline();
            },
            onResize() {
                this.safeDraw();
            }
        },
        beforeDestroy() {
            if (this.timer !== null) {
                clearInterval(this.timer);
            }
        }
    }
</script>

<style>
    @import url(../../css/index.css);

    .d3-timeline path {
        cursor: pointer;
    }

    .d3-timeline .axis.axis--x .domain {
        display: none;
    }

    .d3-timeline text {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: pointer;
    }

    .d3-timeline .entry--interval--default {
        fill:#896bda;
        stroke: #896bda;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-timeline .entry--point--default {
        fill:#896bda;
        stroke: #896bda;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-timeline .entry--interval--error {
        fill: #ff3860;;
        stroke: #ff3860;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-timeline .entry--point--error {
        fill: #ff3860;;
        stroke: #ff3860;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-timeline .entry--interval--success {
        fill: #23d160;;
        stroke: #23d160;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-timeline .entry--point--success {
        fill: #23d160;;
        stroke: #23d160;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-timeline .entry--interval--info {
        fill: #167df0;;
        stroke: #167df0;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-timeline .entry--point--info {
        fill: #167df0;;
        stroke: #167df0;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-timeline .entry--interval--warn {
        fill: #ffdd57;;
        stroke: #ffdd57;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-timeline .entry--point--warn {
        fill: #ffdd57;;
        stroke: #ffdd57;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-timeline .entry--interval--warning {
        fill: #ffdd57;;
        stroke: #ffdd57;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-timeline .entry--point--warning {
        fill: #ffdd57;;
        stroke: #ffdd57;
        stroke-opacity: 1;
        cursor: pointer;
    }
</style>
