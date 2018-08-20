<template>
    <div class="d3-player" :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import { isBoolean, isNull, cloneDeep } from 'lodash';
    import uuid from 'uuid/v1';
    import moment from 'moment';
    import player from '../../mixins/player';
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
    import roundLine from '../../plugins/roundLine';
    import shape from '../../plugins/shape';
    import { smoothMoveX } from '../../plugins/smoothMove';
    import { showTip, hideTip } from '../../plugins/tooltip';
    import draw from './draw';

    export default {
        name: 'd3-player',
        mixins: [player],
        methods: {
            drawPlayer() {
                const { dateTimeStart, dateTimeEnd, lanes } = getTrackerLanes(cloneDeep(this.data)),
                    {
                        intervalCornerRadius = 4,

                        symbolSize = 200,

                        tickSize = 10,
                        tickPadding = 8,

                        axisXLaneHeight = 40,

                        axisFontSize = 12,
                        axisFontWeight = 600,
                        axisFontOpacity = 0.5,

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

                        playJump = false,

                        scaleExtent = [-Infinity, Infinity],

                        axisXControlLaneHeight = 40,
                        axisXControlLaneMarginTop = 10,
                        axisXControlLaneGap = 20,

                        trackStroke = '#000',
                        trackStrokeWidth = 10,
                        trackStrokeOpacity = 0.3,

                        trackRounded = true,

                        trackInsetStroke = '#ddd',
                        trackInsetStrokeOpacity = 1,
                        trackInsetStrokeWidth = 8,

                        circleFill = '#fff',
                        circleStroke = '#000',
                        circleStrokeOpacity = 0.5,
                        circleStrokeWidth = 1.25,

                        btnBorderLineWidth = 2,
                        btnBorderLineColor = 'rgba(0, 0, 0, .125)',
                        btnBorderRadius = 2,

                        btnFillColor = '#ccc',

                        btnFontSize = 14,
                        btnFontWeight = 400,
                        btnFontColor = '#000',

                        timeLabelWidth = 400,

                        playBtnWidth = 100,

                        speedBtnWidth = 100,
                    } = this.options,
                    circleRadius = trackStrokeWidth,
                    { left = 0, top = 0, right = 0, bottom = 0 } = this.margin,
                    [w, h] = this.getElWidthHeight(), __offset__  = borderWidth,
                    g_w = w - left - right - 2 * __offset__,
                    g_h = h - top - bottom - axisXLaneHeight - axisXControlLaneHeight - 2 * __offset__ - axisXControlLaneMarginTop,
                    [paddingInner, paddingOuter] = selectPaddingInnerOuterY(g_h),
                    clipPathId = uuid(), self = this, interval = Math.max(tickLen / this.speed, 16);
                self.reference = dateTimeStart;

                if (![g_w, g_h].every(el => el > 0)) return;

                const hueMin = circleStrokeWidth / 2 + circleRadius,
                      hueMax = w - left - right - 3 * axisXControlLaneGap - 3 * btnBorderLineWidth - playBtnWidth - timeLabelWidth - speedBtnWidth - circleStrokeWidth / 2 - circleRadius,
                    interpolate = hueActual => d3.interpolate(dateTimeStart, dateTimeEnd)((hueActual - hueMin) / (hueMax - hueMin));

                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);

                svg.append('defs')
                    .append('clipPath')
                    .attr('id', clipPathId)
                    .append('path')
                    .attr('d', roundedRect(0, 0, g_w, g_h + axisXLaneHeight, borderRadius - __offset__ / 2, true, true, true, true));

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
                    .attr('d', roundedRect(left + __offset__ / 2, top + __offset__ / 2, g_w + __offset__, g_h + axisXLaneHeight + __offset__, borderRadius, true, true, true, true))
                    .attr('fill', backgroundColor)
                    .attr('stroke', borderColor)
                    .attr('stroke-width', borderWidth)
                    .attr('pointer-events', 'none');

                svg.append('g')
                    .attr('class', 'line--x')
                    .attr('transform', `translate(${left + __offset__}, ${top + __offset__ + g_h})`)
                    .append('line')
                    .attr('x1', g_w)
                    .attr('stroke', boundingLineColor)
                    .attr('stroke-width', boundingLineWidth);

                const axisXLane = svg
                    .append('g')
                    .attr('transform', `translate(${left + __offset__}, ${top + g_h + __offset__})`);

                axisXLane
                    .call(xAxis)
                    .attr('class', 'axis axis--x')
                    .attr('font-size', axisFontSize)
                    .attr('font-weight', axisFontWeight)
                    .attr('fill-opacity', axisFontOpacity);

                const axisXControlLane = svg
                    .append('g')
                    .attr('transform', `translate(${left + btnBorderLineWidth / 2}, ${top + g_h + axisXLaneHeight + 2 * __offset__ + axisXControlLaneMarginTop + btnBorderLineWidth / 2})`);

                const playBtnRect = axisXControlLane
                    .append('path')
                    .attr('fill', btnFillColor)
                    .attr('stroke', btnBorderLineColor)
                    .attr('stroke-width', btnBorderLineWidth)
                    .attr('d', roundedRect(0, 0, playBtnWidth, axisXControlLaneHeight - btnBorderLineWidth, btnBorderRadius, true, true, true, true));

                const playBtn = axisXControlLane
                    .append('g')
                    .attr('transform', `translate(${(playBtnWidth - (axisXControlLaneHeight - btnBorderLineWidth)) / 2}, 0)`)
                    .append('path')
                    .attr('data-state', 'PAUSE')
                    .attr('pointer-events', 'none')
                    .attr('fill', btnFontColor)
                    .attr('d', shape.triangle(axisXControlLaneHeight - btnBorderLineWidth, axisXControlLaneHeight - btnBorderLineWidth));

                playBtnRect
                    .on('click', () => {
                        const state = playBtn.attr('data-state'),
                            w = axisXControlLaneHeight - btnBorderLineWidth,
                            h = w;

                        playBtn.attr('data-state', state === 'PAUSE' ? 'PLAYING' : 'PAUSE');

                        playBtn.transition().duration(360).attr('d', state === 'PAUSE'
                            ? shape.pause(w, h)
                            : shape.triangle(w, h)
                        );
                    });

                const sliderLane = axisXControlLane
                    .append('g')
                    .attr('transform', `translate(${playBtnWidth + axisXControlLaneGap + btnBorderLineWidth / 2}, 0)`);

                sliderLane
                    .append('line')
                    .attr('class', 'track')
                    .attr('x1', hueMin)
                    .attr('x2', hueMax)
                    .attr('y1', (axisXControlLaneHeight - btnBorderLineWidth) / 2)
                    .attr('y2', (axisXControlLaneHeight - btnBorderLineWidth) / 2)
                    .attr('stroke', trackStroke)
                    .attr('stroke-opacity', trackStrokeOpacity)
                    .attr('stroke-width', trackStrokeWidth)
                    .call(roundLine, trackRounded);

               sliderLane
                   .append('line')
                   .attr('class', 'track track--inset')
                   .attr('x1', hueMin)
                   .attr('x2', hueMax)
                   .attr('y1', (axisXControlLaneHeight - btnBorderLineWidth) / 2)
                   .attr('y2', (axisXControlLaneHeight - btnBorderLineWidth) / 2)
                   .attr('stroke', trackInsetStroke)
                   .attr('stroke-opacity', trackInsetStrokeOpacity)
                   .attr('stroke-width', trackInsetStrokeWidth)
                   .call(roundLine, trackRounded);

               const circle = sliderLane
                   .append('circle')
                   .attr('cx', hueMin)
                   .attr('cy', (axisXControlLaneHeight - btnBorderLineWidth) / 2)
                   .attr('r', circleRadius)
                   .attr('fill', circleFill)
                   .attr('stroke', circleStroke)
                   .attr('stroke-width', circleStrokeWidth)
                   .attr('stroke-opacity', circleStrokeOpacity)
                   .attr('pointer-events', 'none');

                const onMoving = hueActual => {
                    self.val = new Date(Math.round(interpolate(hueActual)));
                    self.updateTimeLabel();
                };

                const onMoved = () => {
                    if (self.val !== null) self.$emit('input', self.val);
                };

                const hue = smoothMoveX(circle, hueMin, hueMax, onMoving, onMoved);

                const trackOverlay = sliderLane
                    .append('rect')
                    .attr('y', (axisXControlLaneHeight - btnBorderLineWidth) / 2 - circleRadius - circleStrokeWidth / 2)
                    .attr('width', w - left - right - 3 * btnBorderLineWidth - playBtnWidth - 3 * axisXControlLaneGap - timeLabelWidth - speedBtnWidth)
                    .attr('height', circleRadius * 2 + circleStrokeWidth)
                    .attr('fill', 'none')
                    .attr('pointer-events', 'all')
                    .attr('cursor', 'crosshair')
                    .call(d3.drag()
                        .on('start.interrupt', () => trackOverlay.interrupt())
                        .on('start drag', () =>  hue(d3.event.x))
                    );

                trackOverlay
                    .on('mouseover', () => showTip(self.val, circle.node())())
                    .on('mouseout', hideTip);

                axisXControlLane
                    .append('g')
                    .attr('transform', `translate(${w - left - right  - 3 * btnBorderLineWidth / 2 - axisXControlLaneGap - timeLabelWidth - speedBtnWidth}, 0)`)
                    .append('path')
                    .attr('fill', btnFillColor)
                    .attr('stroke', btnBorderLineColor)
                    .attr('stroke-width', btnBorderLineWidth)
                    .attr('d', roundedRect(0, 0, timeLabelWidth, axisXControlLaneHeight - btnBorderLineWidth, btnBorderRadius, true, true, true, true));

                axisXControlLane
                    .append('text')
                    .attr('class', 'label--time')
                    .attr('text-anchor', 'middle')
                    .attr('dy', '0.32em')
                    .attr('x', w - left - right  - 3 * btnBorderLineWidth / 2 - axisXControlLaneGap - timeLabelWidth / 2 - speedBtnWidth)
                    .attr('y', (axisXControlLaneHeight - btnBorderLineWidth) / 2)
                    .text(self.getTimeLabel())
                    .attr('font-size', btnFontSize)
                    .attr('font-weight', btnFontWeight)
                    .attr('fill', btnFontColor);

                axisXControlLane
                    .append('g')
                    .attr('transform', `translate(${w - left - right - btnBorderLineWidth / 2 - speedBtnWidth}, 0)`)
                    .append('path')
                    .attr('fill', btnFillColor)
                    .attr('stroke', btnBorderLineColor)
                    .attr('stroke-width', btnBorderLineWidth)
                    .attr('d', roundedRect(0, 0, speedBtnWidth, axisXControlLaneHeight - btnBorderLineWidth, btnBorderRadius, true, true, true, true));

                axisXControlLane
                    .append('g')
                    .attr('transform', `translate(${w - left - right - btnBorderLineWidth / 2 - speedBtnWidth / 2 - 12}, ${(axisXControlLaneHeight - btnBorderLineWidth) / 2 - 12})`)
                    .append('path')
                    .attr('d', shape.speed());

                const brushExtent = [
                    [left + __offset__, top + __offset__],
                    [w - right - __offset__, h - axisXLaneHeight - __offset__ - axisXControlLaneHeight - axisXControlLaneMarginTop]
                ];

                const zoomExtent = [
                    [left + __offset__, top + __offset__],
                    [w - right - __offset__, h - __offset__ - axisXControlLaneHeight - axisXControlLaneMarginTop]
                ];

                const brushed = ({ start, end }) => emit(self, 'range-updated', start, end);

                svg
                    .call(brushX, brushExtent, self.scale, { brushed })
                    .call(cursor, axisXLane, [
                        [0, 0],
                        [g_w, axisXLaneHeight]
                    ])
                    .call(zoom, { zooming }, scaleExtent, zoomExtent);

                const g = svg
                    .append('g')
                    .attr('clip-path', `url(#${clipPathId})`)
                    .attr('transform', `translate(${left + __offset__}, ${top + __offset__})`);

                function zooming() {
                    self.scale = d3.event.transform.rescaleX(xScale);

                    svg
                        .call(brushX, brushExtent, self.scale, { brushed });

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

                    const entries = getPassingEntries(lanes, self.reference, Math.abs(self.scale.invert(n) - self.scale.invert(o)), n > o);

                    emit(self, 'reference-updated', clampRange(dateTimeStart, dateTimeEnd, self.reference), entries)
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
                    self.timer = d3.interval(function(_) {
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
            updateTimeLabel() {
                d3.select(this.$el)
                    .select('.label--time')
                    .text(() => this.getTimeLabel());
            },
            getTimeLabel() {
                const FORMAT = 'YYYY-MM-DD HH:mm:ss.SSS';

                return moment(this.val).format(FORMAT);
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawPlayer();
            },
            onResize() {
                this.safeDraw();
            }
        },
    }
</script>

<style>
    @import url(../../css/index.css);

    .d3-player path {
        cursor: pointer;
    }

    .d3-player .axis.axis--x .domain {
        display: none;
    }

    .d3-player text {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: pointer;
    }

    .d3-player .entry--default {
        fill:#896bda;
        stroke: #896bda;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-player .entry--error {
        fill: #ff3860;;
        stroke: #ff3860;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-player .entry--success {
        fill: #23d160;;
        stroke: #23d160;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-player .entry--info {
        fill: #167df0;;
        stroke: #167df0;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-player .entry--warn {
        fill: #ffdd57;;
        stroke: #ffdd57;
        stroke-opacity: 1;
        cursor: pointer;
    }
</style>
