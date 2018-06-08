<template>
    <div class="d3-tracker" :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import _ from 'lodash';
    import mixins from '../../mixins';
    import { showTip, hideTip } from '../../utils/tooltip';
    import { selectPaddingInnerOuterY } from '../../utils/select';
    import { Point, Interval, getTrackerLanes } from '../../utils/getTrackerLanes';
    import roundedRect from '../../utils/roundedRect';
    import emit from '../../utils/emit';
    import { brushX } from '../../utils/brush';
    import zoom from '../../utils/zoom';
    import cursor from '../../utils/cursor';

    export default {
        name: 'd3-tracker',
        data() {
            return {
                timer: null,
                reference: null,
                scale: null,
                pause: true,
                play: null
            }
        },
        mixins: [mixins],
        methods: {
            getTimeRange(dateTimeStart, dateTimeEnd) {
                const reference = this.reference;

                if (reference > dateTimeEnd) {
                    return [dateTimeStart, reference];
                }

                if (reference < dateTimeStart) {
                    return [reference, dateTimeEnd];
                }

                return [dateTimeStart, reference];
            },
            setPause(n) {
                if (_.isBoolean(n)) this.pause = n;
                else this.pause = !this.pause;
            },
            findPassingEntries(lanes) {
                const entries = [],
                    referenceTimestamp = this.reference.getTime();

                for (let i = 0, l = lanes.length; i < l; i += 1) {
                    const lane = lanes[i];

                    for (let I = 0, L = lane.length; I < L; I += 1) {
                        const entry = lane[I];

                        if (entry instanceof Point) continue;

                        const fromTimestamp = entry.from.getTime(),
                            toTimestamp = entry.to.getTime();

                        if (referenceTimestamp >= fromTimestamp && referenceTimestamp <= toTimestamp) {
                            entries.push(entry);
                        }
                    }
                }

                return entries;
            },
            getNextEntryFrom(lanes) {
                let from;

                for (let i = 0, l = lanes.length; i < l; i += 1) {
                    const lane = lanes[i];

                    for (let I = 0, L = lane.length; I < L; I += 1) {
                        const entry = lane[I];

                        if (entry instanceof Interval && entry.from > this.reference) {
                            from = !from ? entry.from : (from > entry.from ? entry.from : from);
                        }
                    }
                }

                return from;
            },
            drawTracker() {
                const [w, h] = this.getElWidthHeight(),
                    self = this;
                const { dateTimeStart, dateTimeEnd, lanes } = getTrackerLanes(_.cloneDeep(this.data));

                const {
                        intervalCornerRadius = 4,

                        symbolSize = 400,

                        tickSize = 10,
                        tickPadding = 8,

                        axisXLaneHeight = 40,

                        axisFontSize = 12,
                        axisFontWeight = 600,
                        axisFontOpacity = 1,

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

                        overlayWidth = 60,

                        playDuration = 10000,
                        playJump = false
                    } = this.options,
                    {
                        axisXLabelLaneHeight = _.isNull(axisXLabel) ? 0 : 30,
                    } = this.options,
                    { left = 0, top = 0, right = 0, bottom = 0 } = this.margin,
                    __offset__  = borderWidth,
                    g_w = w - left - right - 2 * __offset__,
                    g_h = h - top - bottom - axisXLaneHeight - axisXLabelLaneHeight - 2 * __offset__,
                    [paddingInner, paddingOuter] = selectPaddingInnerOuterY(g_h),
                    isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
                self.reference = dateTimeStart;

                if (![g_w, g_h].every(el => el > 0)) return;

                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);

                svg.append('defs')
                    .append('clipPath')
                    .attr('id', 'clip-tracker')
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
                    .attr('transform', `translate(${left + __offset__},${top + g_h + axisXLaneHeight + __offset__})`)
                    .attr('width', g_w)
                    .attr('height', axisXLabelLaneHeight);

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

                svg
                    .call(brushX.bind(self), extent, self.scale)
                    .call(cursor, axisXLane, [
                        [0, 0],
                        [g_w, axisXLaneHeight]
                    ])
                    .call(zoom, zooming);

                const g = svg
                    .append('g')
                    .attr('transform', `translate(${left + __offset__}, ${top + __offset__})`)
                    .attr('width', g_w)
                    .attr('height', g_h);

                function zooming() {
                    hideTip();

                    const newXScale = d3.event.transform.rescaleX(xScale);
                    self.scale = newXScale;

                    svg
                        .call(brushX.bind(self), extent, self.scale);

                    axisXLane
                        .call(xAxis.scale(newXScale))
                        .selectAll('line')
                        .attr('stroke', boundingLineColor)
                        .attr('stroke-width', boundingLineWidth);

                    drawTicks(newXScale);
                    drawEntries(newXScale);
                    drawReference(newXScale);
                }

                function drawReference(xScale) {
                    const x = xScale(self.reference);

                    const overlaySelection = g.select('.overlay'),
                        lineReferenceSelection = g.select('.line--reference');

                    if (!overlaySelection.empty()) overlaySelection.remove();
                    if (!lineReferenceSelection.empty()) lineReferenceSelection.remove();

                    const line = g
                        .append('line')
                        .attr('pointer-events', 'none')
                        .attr('class', 'line--reference')
                        .attr('clip-path', `url(#clip-tracker)`)
                        .attr('x1', x)
                        .attr('y1', 0)
                        .attr('x2', x)
                        .attr('y2', g_h)
                        .attr('stroke', referenceLineColor)
                        .attr('stroke-width', referenceLineWidth);

                    const overlay = g
                        .append('rect')
                        .attr('class', 'overlay')
                        .attr('pointer-events', 'all')
                        .attr('clip-path', `url(#clip-tracker)`)
                        .attr('fill', 'none')
                        .attr('x', x - overlayWidth / 2)
                        .attr('y', 0)
                        .attr('width', overlayWidth)
                        .attr('height', g_h)
                        .attr('cursor', 'move');

                    overlay
                        .call(d3.drag()
                            .on('drag', function() {
                                  const  x = d3.event.x;

                                  overlay
                                    .attr('x', x - overlayWidth / 2);

                                  line
                                    .attr('x1', x)
                                    .attr('x2', x);

                                  self.reference = self.scale.invert(x);
                                  const entries = self.findPassingEntries(lanes);

                                 emit(self, 'reference-updated', self.getTimeRange(dateTimeStart, dateTimeEnd), entries);
                            }));
                }

                function drawTicks(xScale) {
                    const ticks = xScale.ticks(),
                        ticksSelection = g.selectAll('.line--tick');

                    if (!ticksSelection.empty()) ticksSelection.remove();

                    g.selectAll('.line--tick')
                        .data(ticks)
                        .enter()
                        .append('line')
                        .attr('class', 'line--tick')
                        .attr('clip-path', `url(#clip-tracker)`)
                        .attr('x1', d => xScale(d))
                        .attr('x2', d => xScale(d))
                        .attr('y1', 0)
                        .attr('y2', g_h)
                        .attr('stroke', boundingLineColor)
                        .attr('stroke-width', boundingLineWidth)
                        .attr('pointer-events', 'none');
                }

                function drawEntries(xScale) {
                    const entriesSelection = g.selectAll('.entry');
                    if (!entriesSelection.empty()) entriesSelection.remove();

                    for (let i = 0, l = lanes.length; i < l; i += 1) {
                        const lane = lanes[i],
                            Y = yScale(i.toString()), H = yScale.bandwidth();

                        for (let I = 0, L = lane.length; I < L; I += 1) {
                            const entry = lane[I];
                            if (entry instanceof Point) {
                                const point = g
                                    .append('g')
                                    .attr('class', 'entry')
                                    .attr('clip-path', `url(#clip-tracker)`)
                                    .append('path')
                                    .attr('transform', `translate(${xScale(entry.at)}, ${Y + H / 2})`)
                                    .attr('class', `entry--${entry.className ? entry.className : 'default'}`)
                                    .attr('d', () => {
                                        const symbolGen = d3.symbol().size(symbolSize);

                                        return symbolGen.type(d3[entry.symbol] || d3['symbolCircle'])();
                                    })

                                if (entry.title) {
                                    point
                                        .on('mouseover', showTip(entry.title))
                                        .on('mouseout', hideTip);
                                }
                            }

                            if (entry instanceof Interval) {
                                const X = xScale(entry.from),
                                    W = xScale(entry.to) - xScale(entry.from);

                                const interval = g
                                    .append('g')
                                    .attr('class', 'entry')
                                    .attr('clip-path', `url(#clip-tracker)`)
                                    .append('path')
                                    .attr('class', `entry--${entry.className ? entry.className : 'default'}`)
                                    .attr('d', roundedRect(X, Y, W, H, intervalCornerRadius, true, true, true, true));

                                if (entry.title) {
                                    interval
                                        .on('mouseover', showTip(entry.title))
                                        .on('mouseout', hideTip);
                                }

                                const text = g
                                    .append('text')
                                    .attr('clip-path', `url(#clip-tracker)`)
                                    .attr('class', 'entry entry--label')
                                    .attr('text-anchor', 'middle')
                                    .attr('pointer-events', 'none')
                                    .attr('x', X + W / 2)
                                    .attr('y', Y + H / 2)
                                    .text(entry.label || null)
                                    .attr('fill', '#fff')
                                    .attr('dy', '0.32em');

                                if (text.node().getComputedTextLength() > W) {
                                    text.remove();
                                }
                            }
                        }
                    }
                }

                self.play = function play() {
                    let start = self.scale(dateTimeStart),
                        end = self.scale(dateTimeEnd),
                        speed = (end - start) / playDuration * 16;

                    self.timer = d3.timer(function(elapsed) {
                        const line = g.select('.line--reference'),
                            overlay = g.select('.overlay');

                        const xPrevious = +line.attr('x1'),
                            start = self.scale(dateTimeStart),
                            end = self.scale(dateTimeEnd);

                        if (xPrevious >= end) {
                            line
                                .attr('x1', start)
                                .attr('x2', start);

                            overlay
                                .attr('x', start - overlayWidth / 2);

                            self.reference = self.scale.invert(start);
                            self.pause = true;

                            self.timer.stop();
                        } else {
                            const xNext = xPrevious + speed;

                            line
                                .attr('x1', xNext)
                                .attr('x2', xNext);

                            overlay
                                .attr('x', xNext - overlayWidth / 2);

                            self.reference = self.scale.invert(xNext);
                            const entries = self.findPassingEntries(lanes);

                            if (!entries.length && playJump) {
                                const nextEntryFrom = self.getNextEntryFrom(lanes);

                                if (!nextEntryFrom) {
                                    self.reference = dateTimeStart;
                                    const xNext = self.scale(self.reference);

                                    line
                                        .attr('x1', xNext)
                                        .attr('x2', xNext);

                                    overlay
                                        .attr('x', xNext - overlayWidth / 2);

                                    self.pause = true;

                                    self.timer.stop();
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
                                emit(self, 'reference-updated', self.getTimeRange(dateTimeStart, dateTimeEnd), entries);
                            }
                        }
                    }, 16);
                }

                if (isFirefox) {
                    d3.select('body').on('keypress', () => {
                        const ev = d3.event;
                        if (ev.keyCode !== 0 || ev.shiftKey || ev.ctrlKey || ev.altKey) return;

                        if (ev.target === document.body) ev.preventDefault();

                        self.pause = !self.pause;
                    });
                } else {
                    d3.select('body').on('keydown', () => {
                        const ev = d3.event;
                        if (ev.keyCode !== 32) return;

                        if (ev.target === document.body) ev.preventDefault();

                        self.pause = !self.pause;
                    });
                }

                drawTicks(xScale);
                drawEntries(xScale);
                drawReference(xScale);
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawTracker();
            },
            onResize() {
                this.safeDraw();
            }
        },
        watch: {
            pause(n, o) {
                if (n) this.timer.stop();
                if (!n) this.play();

                this.$emit('change', n);
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
