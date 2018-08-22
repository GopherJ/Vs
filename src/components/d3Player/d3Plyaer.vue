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
    import { smoothMoveX, smoothMoveY } from '../../plugins/smoothMove';
    import { showTip, hideTip } from '../../plugins/tooltip';
    import diagbox from '../../plugins/diagbox';
    import disableZoomOn from '../../plugins/disableZoomOn';
    import drawGen from './drawGen';

    export default {
        name: 'd3-player',
        mixins: [player],
        methods: {
            drawPlayer() {

                ////////////////////////////////////////////////////////////////////////////////
                ////                          initialisation                                ////
                ////////////////////////////////////////////////////////////////////////////////

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

                        tickLen = 1000000,

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

                        speedSliderLaneWidth = 40,
                        speedSliderLaneHeight = 200,
                        speedSliderTriangleLength = 10
                    } = this.options,
                    circleRadius = trackStrokeWidth,
                    { left = 0, top = 0, right = 0, bottom = 0 } = this.margin,
                    [w, h] = this.getElWidthHeight(), __offset__  = borderWidth,
                    g_w = w - left - right - 2 * __offset__,
                    g_h = h - top - bottom - axisXLaneHeight - axisXControlLaneHeight - 2 * __offset__ - axisXControlLaneMarginTop,
                    c_w = w - left - right - btnBorderLineWidth,
                    c_h = axisXControlLaneHeight - btnBorderLineWidth,
                    [paddingInner, paddingOuter] = selectPaddingInnerOuterY(g_h),
                    clipPathId = uuid(), self = this;
                self.reference = moment(dateTimeStart);

                if (![g_w, g_h].every(el => el > 0)) return;

                ////////////////////////////////////////////////////////////////////////////////
                ////                             svg container                              ////
                ////////////////////////////////////////////////////////////////////////////////

                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);

                ////////////////////////////////////////////////////////////////////////////////
                ////                               clip path                                ////
                ////////////////////////////////////////////////////////////////////////////////

                svg.append('defs')
                    .append('clipPath')
                    .attr('id', clipPathId)
                    .append('path')
                    .attr('d', roundedRect(0, 0, g_w, g_h + axisXLaneHeight, borderRadius - __offset__ / 2, true, true, true, true));

                ////////////////////////////////////////////////////////////////////////////////
                ////                              xScale, yScale                            ////
                ////////////////////////////////////////////////////////////////////////////////

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

                ////////////////////////////////////////////////////////////////////////////////
                ////                                   border                               ////
                ////////////////////////////////////////////////////////////////////////////////

                svg.append('g')
                    .attr('class', 'border--path')
                    .append('path')
                    .attr('d', roundedRect(left + __offset__ / 2, top + __offset__ / 2, g_w + __offset__, g_h + axisXLaneHeight + __offset__, borderRadius, true, true, true, true))
                    .attr('fill', backgroundColor)
                    .attr('stroke', borderColor)
                    .attr('stroke-width', borderWidth)
                    .attr('pointer-events', 'none');

                ////////////////////////////////////////////////////////////////////////////////
                ////                              domain line                               ////
                ////////////////////////////////////////////////////////////////////////////////

                svg.append('g')
                    .attr('class', 'line--x')
                    .attr('transform', `translate(${left + __offset__}, ${top + __offset__ + g_h})`)
                    .append('line')
                    .attr('x1', g_w)
                    .attr('stroke', boundingLineColor)
                    .attr('stroke-width', boundingLineWidth);

                ////////////////////////////////////////////////////////////////////////////////
                ////                                   xAxis                                ////
                ////////////////////////////////////////////////////////////////////////////////

                const axisXLane = svg
                    .append('g')
                    .attr('class', 'axis axis--x')
                    .attr('transform', `translate(${left + __offset__}, ${top + g_h + __offset__})`);

                axisXLane
                    .call(xAxis)
                    .attr('font-size', axisFontSize)
                    .attr('font-weight', axisFontWeight)
                    .attr('fill-opacity', axisFontOpacity);

                ////////////////////////////////////////////////////////////////////////////////
                ////                            control lane                                ////
                ////////////////////////////////////////////////////////////////////////////////

                const axisXControlLane = svg
                    .append('g')
                    .attr('class', 'lane--control')
                    .attr('transform', `translate(${left + btnBorderLineWidth / 2}, ${top + g_h + axisXLaneHeight + 2 * __offset__ + axisXControlLaneMarginTop + btnBorderLineWidth / 2})`);

                ////////////////////////////////////////////////////////////////////////////////
                ////                                time slider                             ////
                ////////////////////////////////////////////////////////////////////////////////

                const timeSliderHueMin = circleStrokeWidth / 2 + circleRadius,
                    timeSliderHueMax = c_w - 3 * axisXControlLaneGap - 2 * btnBorderLineWidth - playBtnWidth - timeLabelWidth - speedBtnWidth - circleStrokeWidth / 2 - circleRadius,
                    timeSliderInterpolate = timeSliderHueActual => d3.interpolateDate(dateTimeStart, dateTimeEnd)((timeSliderHueActual - timeSliderHueMin) / (timeSliderHueMax - timeSliderHueMin)),
                    timeSliderInterpolateInvert = date => d3.interpolate(timeSliderHueMin, timeSliderHueMax)((date - dateTimeStart) / (dateTimeEnd - dateTimeStart));

                const timeSliderLane = axisXControlLane
                    .append('g')
                    .attr('class', 'slider--time')
                    .attr('transform', `translate(${playBtnWidth + axisXControlLaneGap + btnBorderLineWidth / 2}, 0)`);

                timeSliderLane
                    .append('line')
                    .attr('class', 'track')
                    .attr('x1', timeSliderHueMin)
                    .attr('x2', timeSliderHueMax)
                    .attr('y1', c_h / 2)
                    .attr('y2', c_h / 2)
                    .attr('stroke', trackStroke)
                    .attr('stroke-opacity', trackStrokeOpacity)
                    .attr('stroke-width', trackStrokeWidth)
                    .call(roundLine, trackRounded);

                timeSliderLane
                    .append('line')
                    .attr('class', 'track track--inset')
                    .attr('x1', timeSliderHueMin)
                    .attr('x2', timeSliderHueMax)
                    .attr('y1', c_h / 2)
                    .attr('y2', c_h / 2)
                    .attr('stroke', trackInsetStroke)
                    .attr('stroke-opacity', trackInsetStrokeOpacity)
                    .attr('stroke-width', trackInsetStrokeWidth)
                    .call(roundLine, trackRounded);

                const timeSliderHandler = timeSliderLane
                    .append('circle')
                    .attr('cx', timeSliderHueMin)
                    .attr('cy', c_h / 2)
                    .attr('r', circleRadius)
                    .attr('fill', circleFill)
                    .attr('stroke', circleStroke)
                    .attr('stroke-width', circleStrokeWidth)
                    .attr('stroke-opacity', circleStrokeOpacity)
                    .attr('pointer-events', 'none');

                const onTimeSliderHanderMoving = timeSliderHueActual => {
                    self.val = timeSliderInterpolate(timeSliderHueActual);
                    self.updateTimeLabel();
                };

                const onTimeSliderHandlerMoved = () => {
                    if (self.val !== null) self.$emit('reference-updated', self.val);
                };

                const timeSliderHue = smoothMoveX(timeSliderHandler, timeSliderHueMin, timeSliderHueMax, onTimeSliderHanderMoving, onTimeSliderHandlerMoved);

                const timeSliderHandlerOverlay = timeSliderLane
                    .append('rect')
                    .attr('class', 'track track--overlay')
                    .attr('y', c_h / 2 - timeSliderHueMin)
                    .attr('width', c_w - 2 * btnBorderLineWidth - playBtnWidth - 3 * axisXControlLaneGap - timeLabelWidth - speedBtnWidth)
                    .attr('height', 2 * timeSliderHueMin)
                    .attr('fill', 'none')
                    .attr('pointer-events', 'all')
                    .attr('cursor', 'crosshair')
                    .call(d3.drag()
                        .on('start.interrupt', () => timeSliderHandlerOverlay.interrupt())
                        .on('start drag', () =>  timeSliderHue(d3.event.x))
                    );

                timeSliderHandlerOverlay
                    .on('mouseover', () => showTip(self.val, timeSliderHandler.node())())
                    .on('mouseout', hideTip);

               ////////////////////////////////////////////////////////////////////////////////
               ////                                play btn                                ////
               ////////////////////////////////////////////////////////////////////////////////


                const playBtnLane = axisXControlLane
                    .append('g')
                    .attr('class', 'btn--play');

                const playBtnRect = playBtnLane
                    .append('path')
                    .attr('fill', btnFillColor)
                    .attr('stroke', btnBorderLineColor)
                    .attr('stroke-width', btnBorderLineWidth)
                    .attr('d', roundedRect(0, 0, playBtnWidth, axisXControlLaneHeight - btnBorderLineWidth, btnBorderRadius, true, true, true, true));

                const playBtnIcon = playBtnLane
                    .append('path')
                    .attr('transform', `translate(${(playBtnWidth - c_h) / 2}, 0)`)
                    .attr('data-state', 'PAUSE')
                    .attr('pointer-events', 'none')
                    .attr('fill', btnFontColor)
                    .attr('d', shape.triangle(c_h, c_h));

                self.play = () => {
                    if (dateTimeEnd.diff(self.reference) >= tickLen) {
                        self.reference.add(tickLen, 'milliseconds');
                    } else {
                        self.reference = moment(dateTimeStart);
                        self.timer.stop();
                    }

                    timeSliderHue(timeSliderInterpolateInvert(self.reference));
                };

                const onPlaying = () => {
                    const interval = Math.max(tickLen / this.speed, 16),
                        curVal = moment(self.val);

                    if (self.reference.diff(curVal) !== 0) self.reference = curVal;

                    self.timer = d3.interval(self.play, interval);
                };

                const onPlayBtnClicked = () => {
                    const state = playBtnIcon.attr('data-state');

                    if (state === 'PLAYING') {
                        playBtnIcon
                            .attr('data-state', 'PAUSE')
                            .transition()
                            .duration(360)
                            .attr('d', shape.triangle(c_h, c_h));

                        self.timer.stop();
                    }

                    else {
                        playBtnIcon
                            .attr('data-state', 'PLAYING')
                            .transition()
                            .duration(360)
                            .attr('d', shape.pause(c_h, c_h));

                        onPlaying();
                    }
                };

                playBtnRect
                    .on('click', onPlayBtnClicked);

                ////////////////////////////////////////////////////////////////////////////////
                ////                                time label                              ////
                ////////////////////////////////////////////////////////////////////////////////

                const timeLabelLane = axisXControlLane
                    .append('g')
                    .attr('class', 'label--time')
                    .attr('transform', `translate(${c_w - 3 * btnBorderLineWidth / 2 - axisXControlLaneGap - timeLabelWidth - speedBtnWidth}, 0)`);

                const timeLabelRect = timeLabelLane
                    .append('path')
                    .attr('fill', btnFillColor)
                    .attr('stroke', btnBorderLineColor)
                    .attr('stroke-width', btnBorderLineWidth)
                    .attr('d', roundedRect(0, 0, timeLabelWidth, c_h, btnBorderRadius, true, true, true, true));

                const timeLabelText = timeLabelLane
                    .append('text')
                    .attr('text-anchor', 'middle')
                    .attr('dy', '0.32em')
                    .attr('x', timeLabelWidth / 2)
                    .attr('y', c_h / 2)
                    .text(self.getTimeLabel())
                    .attr('font-size', btnFontSize)
                    .attr('font-weight', btnFontWeight)
                    .attr('fill', btnFontColor);

                ////////////////////////////////////////////////////////////////////////////////
                ////                                speed btn                               ////
                ////////////////////////////////////////////////////////////////////////////////

                const speedBtnLane = axisXControlLane
                    .append('g')
                    .attr('class', 'btn--speed')
                    .attr('transform', `translate(${c_w - speedBtnWidth}, 0)`);

                const speedBtnRect = speedBtnLane
                    .append('path')
                    .attr('fill', btnFillColor)
                    .attr('stroke', btnBorderLineColor)
                    .attr('stroke-width', btnBorderLineWidth)
                    .attr('d', roundedRect(0, 0, speedBtnWidth, c_h, btnBorderRadius, true, true, true, true));

                speedBtnRect
                    .on('click', () => {
                        const speedSliderLineSelection = axisXControlLane.select('.slider--speed'),
                            DISPLAY = speedSliderLineSelection.style('display');

                        speedSliderLineSelection
                            .style('display', DISPLAY === 'inline' ? 'none' : 'inline');
                    });

                const speedBtnIcon =  speedBtnLane
                    .append('path')
                    .attr('pointer-events', 'none')
                    .attr('transform', `translate(${speedBtnWidth / 2 - 12}, ${c_h / 2 - 12})`)
                    .attr('fill', btnFontColor)
                    .attr('d', shape.speed());

                ////////////////////////////////////////////////////////////////////////////////
                ////                             speed slider                               ////
                ////////////////////////////////////////////////////////////////////////////////

                const speedSliderPaddingTop = 20,
                    speedSliderPaddingBottom = 20,
                    speedSliderHueMin = circleStrokeWidth / 2 + circleRadius + speedSliderPaddingTop,
                    speedSliderHueMax = speedSliderLaneHeight - circleStrokeWidth / 2 - circleRadius - speedSliderPaddingBottom,
                    speedSliderInterpolate = speedSliderHueActual => d3.interpolateRound(1, Math.floor(tickLen / 16))((speedSliderHueActual - speedSliderHueMin) / (speedSliderHueMax - speedSliderHueMin));

                const speedSliderLane = axisXControlLane
                    .append('g')
                    .attr('class', 'slider--speed')
                    .style('display', 'none')
                    .attr('transform', `translate(${c_w - speedBtnWidth / 2 - speedSliderLaneWidth / 2}, ${-(speedSliderTriangleLength * Math.sqrt(3) / 2 + speedSliderLaneHeight)})`);

                const speedSliderDiagbox = speedSliderLane
                    .append('path')
                    .attr('fill', '#fff')
                    .attr('stroke', btnBorderLineColor)
                    .attr('stroke-width', btnBorderLineWidth)
                    .attr('d', diagbox(0, 0, speedSliderLaneWidth, speedSliderLaneHeight, speedSliderTriangleLength, btnBorderRadius, true, true, true, true));

                speedSliderLane
                    .append('line')
                    .attr('class', 'track')
                    .attr('y1', speedSliderHueMin)
                    .attr('y2', speedSliderHueMax)
                    .attr('x1', speedSliderLaneWidth / 2)
                    .attr('x2', speedSliderLaneWidth / 2)
                    .attr('stroke', trackStroke)
                    .attr('stroke-opacity', trackStrokeOpacity)
                    .attr('stroke-width', trackStrokeWidth)
                    .call(roundLine, trackRounded);

                speedSliderLane
                    .append('line')
                    .attr('class', 'track track--inset')
                    .attr('y1', speedSliderHueMin)
                    .attr('y2', speedSliderHueMax)
                    .attr('x1', speedSliderLaneWidth / 2)
                    .attr('x2', speedSliderLaneWidth / 2)
                    .attr('stroke', trackInsetStroke)
                    .attr('stroke-opacity', trackInsetStrokeOpacity)
                    .attr('stroke-width', trackInsetStrokeWidth)
                    .call(roundLine, trackRounded);

                const speedSliderHandler = speedSliderLane
                    .append('circle')
                    .attr('cy', speedSliderHueMin)
                    .attr('cx', speedSliderLaneWidth / 2)
                    .attr('r', circleRadius)
                    .attr('fill', circleFill)
                    .attr('stroke', circleStroke)
                    .attr('stroke-width', circleStrokeWidth)
                    .attr('stroke-opacity', circleStrokeOpacity)
                    .attr('pointer-events', 'none');

                const onSpeedSliderMoving = hueActual => {
                    self.speed = speedSliderInterpolate(hueActual);
                };

                const onSpeedSliderMoved = (_) => {
                    const interval = Math.max(tickLen / this.speed, 16);

                    if (self.timer !== null) {
                        self.timer.stop();
                        self.timer = d3.interval(self.play, interval);
                    }
                };

                const speedSliderHue = smoothMoveY(speedSliderHandler, speedSliderHueMin, speedSliderHueMax, onSpeedSliderMoving, onSpeedSliderMoved);

                const speedSliderTrackOverlay = speedSliderLane
                    .append('rect')
                    .attr('x', speedSliderLaneWidth / 2 - speedSliderHueMin)
                    .attr('width', 2 * speedSliderHueMin)
                    .attr('height', speedSliderLaneHeight)
                    .attr('fill', 'none')
                    .attr('pointer-events', 'all')
                    .attr('cursor', 'crosshair')
                    .call(d3.drag()
                        .on('start.interrupt', () => speedSliderTrackOverlay.interrupt())
                        .on('start drag', () =>  speedSliderHue(d3.event.y))
                    );

                speedSliderTrackOverlay
                    .on('mouseover', () => showTip(self.speed, speedSliderHandler.node())())
                    .on('mouseout', hideTip);


                ////////////////////////////////////////////////////////////////////////////////
                ////                                 main                                   ////
                ////////////////////////////////////////////////////////////////////////////////

                const brushExtent = [
                    [left + __offset__, top + __offset__],
                    [w - right - __offset__, h - axisXLaneHeight - __offset__ - axisXControlLaneHeight - axisXControlLaneMarginTop]
                ];

                const zoomExtent = [
                    [left + __offset__, top + __offset__],
                    [w - right - __offset__, h - __offset__ - axisXControlLaneHeight - axisXControlLaneMarginTop]
                ];

                const drawFn = drawGen(
                    axisXLane,
                    xAxis,
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
                    boundingLineWidth
                );

                const brushed = ({ start, end }) => emit(self, 'range-updated', start, end);

                const zooming = () => {
                    self.scale = d3.event.transform.rescaleX(xScale);

                    svg
                        .call(brushX, brushExtent, self.scale, { brushed });

                    g.call(drawFn, self.scale);
                };

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

                g.call(drawFn, self.scale);
            },
            updateTimeLabel() {
                d3.select(this.$el)
                    .select('.label--time text')
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
