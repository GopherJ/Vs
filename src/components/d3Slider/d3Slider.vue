<template>
    <div class="d3-slider" :style="{ 'width' : width, 'height': height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import { isNumber, isDate, isString, debounce } from 'lodash';
    import { showTip, hideTip } from '../../utils/tooltip';
    import { lastTickTextAnchorEnd, firstTickTextAnchorStart } from '../../utils/textAnchor';
    import isValidColor from '../../utils/isValidColor';
    import axisShow from '../../utils/axisShow';
    import emit from '../../utils/emit';

    export default {
        name: 'd3-slider',
        props: {
            min: {
                type: [Number, Date, String],
                default: 1,
                validator: val => typeof val !== 'string' || isValidColor(val)
            },
            max: {
                type: [Number, Date, String],
                default: 10,
                validator:  val => typeof val !== 'string' || isValidColor(val)
            },
            width: {
                type: String,
                default: '100%'
            },
            height: {
                type: String,
                default: '100px'
            },
            margin: {
                type: Object,
                default: () => ({})
            },
            options: {
                type: Object,
                default: () => ({})
            }
        },
        methods: {
            isTypeTheSame(a, b) {
                return isNumber(a) && isNumber(b)
                    || isDate(a) && isDate(b)
                    || isString(a) && isString(b);
            },
            ifExistsSvgThenRemove() {
                const svgSelection = d3.select(this.$el).select('svg');
                if (svgSelection.empty()) {
                    return;
                }

                svgSelection.remove();
            },
            getElWidthHeight() {
                return [this.$el.clientWidth, this.$el.clientHeight];
            },
            drawSlider() {
                const min = this.min,
                    max = this.max;

                if (!this.isTypeTheSame(min, max)) {
                    console.warn('invalid min | max');
                    return;
                }

                const [w, h] = this.getElWidthHeight(),
                    { left = 0, right = 0, top = 0, bottom = 0 } = this.margin,
                    {
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

                        isAxisShow = true,

                        axisFontSize = 12,
                        axisFontWeight = 400,
                        axisFontOpacity = 1,

                        hueAlpha = 0.2
                    } = this.options,
                    {
                        axisXLaneHeight = isAxisShow ? 30 : 0
                    } = this.options,
                    circleRadius = trackStrokeWidth,
                    g_w = w - left - right,
                    g_h = h - top - bottom - axisXLaneHeight,
                    isAxisDate = isDate(min),
                    isAxisColor = isString(min),
                    isAxisNumber = isNumber(min),
                    self = this;

                    const svg = d3.select(this.$el)
                        .append('svg')
                        .attr('width', w)
                        .attr('height', h);

                    const g = svg
                        .append('g')
                        .attr('transform', `translate(${left}, ${top})`)
                        .attr('width', g_w)
                        .attr('height', g_h);

                    const track = g
                        .append('line')
                        .attr('class', 'track')
                        .attr('x1', trackStrokeWidth / 2)
                        .attr('x2', g_w - trackStrokeWidth)
                        .attr('y1', g_h - circleRadius - circleStrokeWidth / 2)
                        .attr('y2', g_h - circleRadius - circleStrokeWidth / 2)
                        .attr('stroke', trackStroke)
                        .attr('stroke-opacity', trackStrokeOpacity)
                        .attr('stroke-width', trackStrokeWidth);

                    const trackInset = g
                        .append('line')
                        .attr('class', 'track track--inset')
                        .attr('x1', trackStrokeWidth / 2)
                        .attr('x2', g_w - trackStrokeWidth)
                        .attr('y1', g_h - circleRadius - circleStrokeWidth / 2)
                        .attr('y2', g_h - circleRadius - circleStrokeWidth / 2)
                        .attr('stroke', trackInsetStroke)
                        .attr('stroke-opacity', trackInsetStrokeOpacity)
                        .attr('stroke-width', trackInsetStrokeWidth);

                    if (trackRounded) {
                        track
                            .attr('stroke-linecap', 'round');
                        trackInset
                            .attr('stroke-linecap', 'round');
                    }

                    const circle = g
                        .append('circle')
                        .attr('cx', circleStrokeWidth / 2 + circleRadius)
                        .attr('cy', g_h - circleRadius - circleStrokeWidth / 2)
                        .attr('r', circleRadius)
                        .attr('fill', circleFill)
                        .attr('stroke', circleStroke)
                        .attr('stroke-width', circleStrokeWidth)
                        .attr('stroke-opacity', circleStrokeOpacity);

                    const xScale = (function(isAxisDate, isAxisColor, isAxisNumber) {
                        if (isAxisNumber) {
                            return d3.scaleLinear()
                                .domain([min, max])
                                .range([0, g_w - circleStrokeWidth  - 2 * circleRadius])
                                .clamp(true);
                        }

                        if (isAxisDate) {
                            return d3.scaleTime()
                                .domain([min, max])
                                .range([0, g_w - circleStrokeWidth  - 2 * circleRadius])
                                .clamp(true);
                        }

                        if (isAxisColor) {
                            return d3.scalePoint()
                                .domain([min, max])
                                .range([0, g_w - circleStrokeWidth  - 2 * circleRadius]);
                        }
                    })(isAxisDate, isAxisColor, isAxisNumber);

                    const xAxis = d3
                        .axisBottom(xScale);

                    const axisXLane = svg
                        .append('g')
                        .attr('transform',  `translate(${left + circleStrokeWidth / 2 + circleRadius}, ${top + g_h})`)
                        .attr('class', 'axis axis--x')
                        .attr('width', g_w - circleStrokeWidth - 2 * circleRadius)
                        .attr('height', axisXLaneHeight);

                    axisXLane
                        .call(xAxis)
                        .call(firstTickTextAnchorStart)
                        .call(lastTickTextAnchorEnd)
                        .call(axisShow, false, false)
                        .attr('font-size', axisFontSize)
                        .attr('opacity', axisFontOpacity)
                        .attr('font-weight', axisFontWeight);

                    let hueMin = circleStrokeWidth / 2 + circleRadius,
                        hueMax = g_w - circleStrokeWidth / 2 - circleRadius,
                        hueActual = hueMin,
                        hueTarget = hueMin,
                        hueTimer = d3.timer(hueTween);

                    function hueTween(x) {
                        const hueError = hueTarget - hueActual;
                        if (Math.abs(hueError) < 1e-3) hueActual = hueTarget, hueTimer.stop();
                        else hueActual += hueAlpha * hueError;

                        circle
                            .attr('cx', hueActual);

                        emit(self, 'drag-end', isAxisColor
                            ? d3.interpolate(min, max)((hueActual - hueMin) / (hueMax - hueMin))
                            : xScale.invert(hueActual));
                    };

                    function hue(x) {
                        if (x >= circleRadius + circleStrokeWidth / 2 && x <= g_w - circleStrokeWidth / 2 - circleRadius)
                        hueTarget = x;
                        hueTimer.restart(hueTween);
                    };


                    const trackOverlay = g
                        .append('rect')
                        .attr('x', 0)
                        .attr('y', g_h - circleRadius * 2 - circleStrokeWidth)
                        .attr('width', g_w)
                        .attr('height', circleRadius * 2 + circleStrokeWidth)
                        .attr('fill', 'none')
                        .attr('pointer-events', 'all')
                        .attr('cursor', 'crosshair')
                        .call(d3.drag()
                            .on('start.interrupt', function() {
                                trackOverlay.interrupt();
                            })
                            .on('start drag', function() {
                                hue(d3.event.x);
                        }));
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawSlider();
            },
            onResize() {
                this.safeDraw();
            }
        },
        watch: {
            width() {
                this.$nextTick(() => {
                    this.safeDraw();
                });
            },
            height() {
                this.$nextTick(() => {
                    this.safeDraw();
                });
            },
            min() {
                this.$nextTick(() => {
                    this.safeDraw();
                });
            },
            max() {
                this.$nextTick(() => {
                    this.safeDraw();
                });
            },
            margin: {
                deep: true,
                handler() {
                    this.$nextTick(() => {
                        this.safeDraw();
                    });
                }
            }
        },
        mounted() {
            this.safeDraw();

            this._handler = debounce((e) => {
                this.onResize();
            }, 500);

            window.addEventListener('resize', this._handler);
        },
        beforeDestroy() {
            window.removeEventListener('resize', this._handler);
        }
    }
</script>

<style>
    .d3-slider text {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: pointer;
    }
</style>

