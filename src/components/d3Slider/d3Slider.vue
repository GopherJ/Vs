<template>
    <div class="d3-slider" :style="{ 'width' : width, 'height': height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import { isNumber, isDate, isString, debounce } from 'lodash';
    import isValidColor from '../../utils/isValidColor';
    import emit from '../../utils/emit';
    import axisShow from '../../plugins/axisShow';
    import { showTip, hideTip } from '../../plugins/tooltip';
    import { responsiveAxisX } from '../../plugins/responsiveAxis';
    import roundLine from '../../plugins/roundLine';

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

                if (!this.isTypeTheSame(min, max)) return;

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

                        isAxisShow = false,

                        axisFontSize = 12,
                        axisFontWeight = 400,
                        axisFontOpacity = 1,

                        hueAlpha = 0.2
                    } = this.options,
                    {
                        axisXLaneHeight = isAxisShow ? 30 : 0
                    } = this.options,
                    circleRadius = trackStrokeWidth,
                    __offsetLeft__ = 20,
                    __offsetRight__ = 20,
                    g_w = w - left - right - __offsetLeft__ - __offsetRight__,
                    g_h = h - top - bottom;

                if (g_h < 2 * circleRadius + circleStrokeWidth + axisXLaneHeight || g_w <= 4 * circleRadius + 2 * circleStrokeWidth) return;

                const isAxisDate = isDate(min),
                     isAxisColor = isString(min),
                    isAxisNumber = isNumber(min),
                    self = this;

                let hueMin = circleStrokeWidth / 2 + circleRadius,
                    hueMax = g_w - circleStrokeWidth / 2 - circleRadius,
                    hueActual = hueMin,
                    hueTarget = hueMin,
                    hueTimer = d3.timer(hueTween);

                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);

                const g = svg
                    .append('g')
                    .attr('transform', `translate(${left + __offsetLeft__}, ${top})`)
                    .attr('width', g_w)
                    .attr('height', g_h);

                const track = g
                    .append('line')
                    .attr('class', 'track')
                    .attr('x1', circleRadius + circleStrokeWidth / 2)
                    .attr('x2', g_w - circleRadius - circleStrokeWidth / 2)
                    .attr('y1', g_h / 2)
                    .attr('y2', g_h / 2)
                    .attr('stroke', trackStroke)
                    .attr('stroke-opacity', trackStrokeOpacity)
                    .attr('stroke-width', trackStrokeWidth)
                    .call(roundLine, trackRounded);

                const trackInset = g
                    .append('line')
                    .attr('class', 'track track--inset')
                    .attr('x1', circleRadius + circleStrokeWidth / 2)
                    .attr('x2', g_w - circleRadius - circleStrokeWidth / 2)
                    .attr('y1', g_h / 2)
                    .attr('y2', g_h / 2)
                    .attr('stroke', trackInsetStroke)
                    .attr('stroke-opacity', trackInsetStrokeOpacity)
                    .attr('stroke-width', trackInsetStrokeWidth)
                    .call(roundLine, trackRounded);

                const circle = g
                    .append('circle')
                    .attr('cx', circleStrokeWidth / 2 + circleRadius)
                    .attr('cy', g_h / 2)
                    .attr('r', circleRadius)
                    .attr('fill', circleFill)
                    .attr('stroke', circleStroke)
                    .attr('stroke-width', circleStrokeWidth)
                    .attr('stroke-opacity', circleStrokeOpacity);

                const xScale = (function(isAxisDate, isAxisColor, isAxisNumber) {
                    if (isAxisNumber) {
                        return d3.scaleLinear()
                            .domain([min, max])
                            .range([0, g_w - circleStrokeWidth - 2 * circleRadius])
                            .clamp(true);
                    }

                    if (isAxisDate) {
                        return d3.scaleTime()
                            .domain([min, max])
                            .range([0, g_w - circleStrokeWidth - 2 * circleRadius])
                            .clamp(true);
                    }

                    if (isAxisColor) {
                        return d3.scalePoint()
                            .domain([min, max])
                            .range([0, g_w - circleStrokeWidth - 2 * circleRadius]);
                    }
                })(isAxisDate, isAxisColor, isAxisNumber);

                if (isAxisShow) {
                    const xAxis = d3
                        .axisBottom(xScale);

                    const axisXLane = svg
                        .append('g')
                        .attr('transform',  `translate(${left + __offsetLeft__ + circleStrokeWidth / 2 + circleRadius}, ${top + g_h / 2 + circleRadius + circleStrokeWidth / 2})`)
                        .attr('class', 'axis axis--x')
                        .attr('width', g_w - circleStrokeWidth - 2 * circleRadius)
                        .attr('height', axisXLaneHeight);

                    axisXLane
                        .call(xAxis)
                        .call(responsiveAxisX, xAxis, xScale)
                        .call(axisShow, false, false)
                        .attr('font-size', axisFontSize)
                        .attr('opacity', axisFontOpacity)
                        .attr('font-weight', axisFontWeight);
                }

                function hueTween(x) {
                    const hueError = hueTarget - hueActual;

                    let val = isAxisColor
                            ? d3.interpolate(min, max)((hueActual - hueMin) / (hueMax - hueMin))
                            : xScale.invert(hueActual - circleRadius - circleStrokeWidth / 2);

                    if (Math.abs(hueError) < 1e-3) {
                        hueActual = hueTarget, hueTimer.stop(), hideTip();

                        emit(self, 'input', val);
                    }

                    else {
                        hueActual += hueAlpha * hueError;

                        circle
                            .attr('cx', hueActual);

                            showTip(typeof val === 'number'? val.toFixed(2) : val, circle.node())();

                        emit(self, 'input', val);
                    }
                }

                function hue(x) {
                    if (x >= circleRadius + circleStrokeWidth / 2 && x <= g_w - circleStrokeWidth / 2 - circleRadius)
                    hueTarget = x, hueTimer.restart(hueTween);
                }

                const trackOverlay = g
                    .append('rect')
                    .attr('x', 0)
                    .attr('y', g_h / 2 - circleRadius - circleStrokeWidth / 2)
                    .attr('width', g_w)
                    .attr('height', circleRadius * 2 + circleStrokeWidth)
                    .attr('fill', 'none')
                    .attr('pointer-events', 'all')
                    .attr('cursor', 'pointer')
                    .call(d3.drag()
                        .on('start.interrupt', function() {
                            trackOverlay.interrupt();
                        })
                        .on('start drag', function() {
                            hue(d3.event.x);
                    }));

                trackOverlay
                    .on('mouseover', function() {
                        let val = isAxisColor
                            ? d3.interpolate(min, max)((hueActual - hueMin) / (hueMax - hueMin))
                            : xScale.invert(hueActual - circleRadius - circleStrokeWidth / 2);

                        showTip(typeof val === 'number' ? val.toFixed(2) : val, circle.node())();
                    })
                    .on('mouseout', hideTip);
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

