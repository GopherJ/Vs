<template>
    <div class="d3-horizontal-slider" :style="{ 'width' : width, 'height': height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import { isNumber, isDate, isString } from 'lodash';
    import mixins from '../../mixins/slider';
    import roundLine from '../../plugins/roundLine';
    import { showTip, hideTip } from '../../plugins/tooltip';
    import { smoothMoveX } from '../../plugins/smoothMove';

    export default {
        name: 'd3-horizontal-slider',
        mixins: [mixins],
        methods: {
            drawHorizontalSlider() {
                const min = this.min, max = this.max,
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
                    } = this.options,
                    circleRadius = trackStrokeWidth,
                    [w, h] = this.getElWidthHeight(),
                    __offsetLeft__ = 0, __offsetRight__ = 0,
                    g_w = w - left - right - __offsetLeft__ - __offsetRight__,
                    g_h = h - top - bottom, self = this;

                if (!this.isTheSameType(min, max) || g_h < 2 * circleRadius + circleStrokeWidth || g_w <= 4 * circleRadius + 2 * circleStrokeWidth) return;

                const hueMin = circleStrokeWidth / 2 + circleRadius,
                      hueMax = g_w - circleStrokeWidth / 2 - circleRadius,
                    interpolate = hueActual => d3.interpolate(min, max)((hueActual - hueMin) / (hueMax - hueMin));

                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);

                const g = svg
                    .append('g')
                    .attr('transform', `translate(${left + __offsetLeft__}, ${top})`);

                g
                    .append('line')
                    .attr('class', 'track')
                    .attr('x1', hueMin)
                    .attr('x2', hueMax)
                    .attr('y1', g_h / 2)
                    .attr('y2', g_h / 2)
                    .attr('stroke', trackStroke)
                    .attr('stroke-opacity', trackStrokeOpacity)
                    .attr('stroke-width', trackStrokeWidth)
                    .call(roundLine, trackRounded);

                g
                    .append('line')
                    .attr('class', 'track track--inset')
                    .attr('x1', hueMin)
                    .attr('x2', hueMax)
                    .attr('y1', g_h / 2)
                    .attr('y2', g_h / 2)
                    .attr('stroke', trackInsetStroke)
                    .attr('stroke-opacity', trackInsetStrokeOpacity)
                    .attr('stroke-width', trackInsetStrokeWidth)
                    .call(roundLine, trackRounded);

                const circle = g
                    .append('circle')
                    .attr('cx', hueMin)
                    .attr('cy', g_h / 2)
                    .attr('r', circleRadius)
                    .attr('fill', circleFill)
                    .attr('stroke', circleStroke)
                    .attr('stroke-width', circleStrokeWidth)
                    .attr('stroke-opacity', circleStrokeOpacity)
                    .attr('pointer-events', 'none');

                const onMoving = hueActual => {
                    self.val = interpolate(hueActual);
                };

                const onMoved = () => {
                    if (self.val !== null) self.$emit('input', self.val);
                };

                const hue = smoothMoveX(circle, hueMin, hueMax, onMoving, onMoved);

                const trackOverlay = g
                    .append('rect')
                    .attr('x', 0)
                    .attr('y', g_h / 2 - circleRadius - circleStrokeWidth / 2)
                    .attr('width', g_w)
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
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawHorizontalSlider();
            },
            onResize() {
                this.safeDraw();
            }
        }
    }
</script>

<style>
    .d3-horizontal-slider text {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: pointer;
    }
</style>

