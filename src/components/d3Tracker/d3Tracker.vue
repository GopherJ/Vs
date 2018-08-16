<template>
    <div class="d3-tracker" :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import { isBoolean, isNull, cloneDeep } from 'lodash';
    import uuid from 'uuid/v1';
    import mixins from '../../mixins';
    import tracker from '../../mixins/tracker';
    import roundedRect from '../../plugins/roundedRect';
    import emit from '../../utils/emit';
    import zoom from '../../plugins/zoom';
    import cursor from '../../plugins/cursor';
    import { brushX } from '../../plugins/brush';
    import keybinding from '../../utils/keybinding';
    import { getTrackerLanes } from '../../utils/getTrackerLanes';
    import { selectPaddingInnerOuterY } from '../../utils/select';
    import getNextEntry from '../../utils/getNextEntry';
    import getPassingEntries from '../../utils/getPassingEntries';
    import clampRange from '../../utils/clampRange';
    import draw from './draw';

    export default {
        name: 'd3-tracker',
        mixins: [mixins, tracker],
        methods: {
            drawTracker() {
                const { dateTimeStart, dateTimeEnd, lanes } = getTrackerLanes(cloneDeep(this.data)),
                      {
                        intervalCornerRadius = 4,

                        symbolSize = 400,

                        tickSize = 10,
                        tickPadding = 8,

                        axisXLaneHeight = 40,

                        axisFontSize = 12,
                        axisFontWeight = 600,
                        axisFontOpacity = 0.5,

                        axisXLabel = null,

                        axisLabelFontSize = 12,
                        axisLabelFontWeight = 400,
                        axisLabelFontOpacity = 0.5,

                        backgroundColor = 'rgba(255, 255, 255, 0.125)',

                        borderRadius = 0,
                        borderWidth = 2,
                        borderColor = 'rgba(0, 0, 0, .125)',

                        boundingLineWidth = 2,
                        boundingLineColor = 'rgba(0, 0, 0, .125)',

                        referenceLineWidth = 4,
                        referenceLineColor = 'rgba(255, 56, 96, 1)',

                        overlayWidth = 30,

                        tickLen = 250,

                        speed = 1,

                        playJump = true
                    } = this.options,
                    {
                        axisXLabelLaneHeight = isNull(axisXLabel) ? 0 : 30,
                    } = this.options,
                    { left = 0, top = 0, right = 0, bottom = 0 } = this.margin,
                    [w, h] = this.getElWidthHeight(), __offset__  = borderWidth,
                    g_w = w - left - right - 2 * __offset__,
                    g_h = h - top - bottom - axisXLaneHeight - axisXLabelLaneHeight - 2 * __offset__,
                    [paddingInner, paddingOuter] = selectPaddingInnerOuterY(g_h),
                    clipPathId = uuid(), self = this, interval = Math.round(tickLen / speed);
                self.reference = dateTimeStart;

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
                    .attr('height', g_h + axisXLaneHeight);

                const xScale = d3.scaleTime()
                    .domain([dateTimeStart, dateTimeEnd])
                    .range([0, g_w]);
                self.scale = xScale;

                const yScale = d3.scaleBand()
                    .range([g_h, 0])
                    .domain(Object.keys(lanes))
                    .paddingInner(paddingInner)
                    .paddingOuter(paddingOuter);

                const xAxis = d3
                    .axisBottom(xScale)
                    .tickSize(tickSize)
                    .tickPadding(tickPadding);

                svg.append('path')
                    .attr('d', roundedRect(left + __offset__ / 2, top + __offset__ / 2, g_w + __offset__, g_h + axisXLaneHeight + axisXLabelLaneHeight +  __offset__, borderRadius, true, true, true, true))
                    .attr('fill', backgroundColor)
                    .attr('stroke', borderColor)
                    .attr('stroke-width', borderWidth)
                    .attr('pointer-events', 'none');

                const axisXLane = svg
                    .append('g')
                    .attr('transform', `translate(${left + __offset__}, ${top + g_h + __offset__})`);

                axisXLane
                    .call(xAxis)
                    .attr('class', 'axis axis--x')
                    .attr('font-size', axisFontSize)
                    .attr('font-weight', axisFontWeight)
                    .attr('fill-opacity', axisFontOpacity);

                axisXLane
                    .append('line')
                    .attr('x2', g_w);

                axisXLane
                    .selectAll('line')
                    .attr('stroke', boundingLineColor)
                    .attr('stroke-width', boundingLineWidth);

                const axisXLabelLane = svg
                    .append('g')
                    .attr('transform', `translate(${left + __offset__},${top + g_h + axisXLaneHeight + __offset__})`);

                axisXLabelLane
                    .append('text')
                    .attr('text-anchor', 'middle')
                    .attr('x', g_w / 2)
                    .attr('y', axisXLabelLaneHeight / 2)
                    .attr('fill', '#000')
                    .attr('dy', '0.32em')
                    .text(axisXLabel)
                    .attr('font-size', axisLabelFontSize)
                    .attr('font-weight', axisLabelFontWeight)
                    .attr('fill-opacity', axisLabelFontOpacity);

                const extent = [
                    [left + __offset__, top + __offset__],
                    [w - right - __offset__, h - axisXLaneHeight - __offset__ - axisXLabelLaneHeight]
                ];

                const brushed = ({ start, end }) => emit(self, 'range-updated', start, end);

                svg
                    .call(brushX, extent, self.scale, { brushed })
                    .call(cursor, axisXLane, [
                        [0, 0],
                        [g_w, axisXLaneHeight]
                    ])
                    .call(zoom, zooming);

                const g = svg
                    .append('g')
                    .attr('transform', `translate(${left + __offset__}, ${top + __offset__})`);

                function zooming() {
                    self.scale = d3.event.transform.rescaleX(xScale);

                    svg
                        .call(brushX, extent, self.scale, { brushed });

                    g
                        .call(
                            draw,
                            axisXLane,
                            xAxis,
                            self.scale,
                            yScale,
                            lanes,
                            self.reference,
                            g_h,
                            clipPathId,
                            symbolSize,
                            intervalCornerRadius,
                            overlayWidth,
                            referenceLineColor,
                            referenceLineWidth,
                            boundingLineColor,
                            boundingLineWidth,
                            onDrag
                    );
                }

                function onDrag(n, o) {
                    self.reference = self.scale.invert(n);

                    const entries = getPassingEntries(lanes, self.scale.invert(n), Math.abs(self.scale.invert(n) - self.scale.invert(o)), n > o);

                    emit(self, 'reference-updated', clampRange(dateTimeStart, dateTimeEnd, self.reference), entries);
                }

                function onSpace() {
                    self.pause = !self.pause;
                }

                function onPlayEnd() {
                    self.reference = dateTimeStart;

                    self.pause = true;
                    self.timer.stop();

                    emit(self, 'play-end');
                }

                self.play = function play() {
                    self.timer = d3.timer(function(_) {
                        const line = g.select('.line--reference'),
                            overlay = g.select('.overlay'),
                            xStart = self.scale(dateTimeStart),
                            xEnd = self.scale(dateTimeEnd),
                            xNext = self.scale(new Date(self.reference.valueOf() + tickLen));

                        if (xNext >= xEnd) {
                            line
                                .attr('x1', xStart)
                                .attr('x2', xStart);

                            overlay
                                .attr('x', xStart - overlayWidth / 2);

                            onPlayEnd();
                        } else {
                            line
                                .attr('x1', xNext)
                                .attr('x2', xNext);

                            overlay
                                .attr('x', xNext - overlayWidth / 2);

                            self.reference = self.scale.invert(xNext);

                            const entries = getPassingEntries(lanes, self.reference, tickLen);

                            if (!entries.length && playJump) {
                                const nextEntryFrom = getNextEntry(lanes, self.reference);

                                if (!nextEntryFrom) {
                                    const xNext = self.scale(self.reference);

                                    line
                                        .attr('x1', xNext)
                                        .attr('x2', xNext);

                                    overlay
                                        .attr('x', xNext - overlayWidth / 2);

                                    onPlayEnd();
                                } else {
                                    self.reference = nextEntryFrom;

                                    const xNext = self.scale(self.reference);

                                    line
                                        .attr('x1', xNext)
                                        .attr('x2', xNext);

                                    overlay
                                        .attr('x', xNext - overlayWidth / 2);
                                }
                            } else {
                                emit(self, 'reference-updated', clampRange(dateTimeStart, dateTimeEnd, self.reference), entries);
                            }
                        }
                    }, interval);
                };

                keybinding.onspace(onSpace);

                g
                    .call(
                        draw,
                        axisXLane,
                        xAxis,
                        self.scale,
                        yScale,
                        lanes,
                        self.reference,
                        g_h,
                        clipPathId,
                        symbolSize,
                        intervalCornerRadius,
                        overlayWidth,
                        referenceLineColor,
                        referenceLineWidth,
                        boundingLineColor,
                        boundingLineWidth,
                        onDrag
                    );
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawTracker();
            },
            onResize() {
                this.safeDraw();
            }
        }
    }
</script>

<style>
    @import url(../../css/index.css);

    .d3-tracker path {
        cursor: pointer;
    }

    .d3-tracker .axis.axis--x .domain {
        display: none;
    }

    .d3-tracker text {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: pointer;
    }

    .d3-tracker .entry--default {
        fill:#896bda;
        stroke: #896bda;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-tracker .entry--error {
        fill: #ff3860;;
        stroke: #ff3860;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-tracker .entry--success {
        fill: #23d160;;
        stroke: #23d160;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-tracker .entry--info {
        fill: #167df0;;
        stroke: #167df0;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-tracker .entry--warn {
        fill: #ffdd57;;
        stroke: #ffdd57;
        stroke-opacity: 1;
        cursor: pointer;
    }
</style>
