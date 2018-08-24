<template>
    <div class="d3-vertical-slider" :style="{ 'width' : width, 'height': height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import { isNumber, isDate, isString } from 'lodash';
    import mixins from '../../mixins/slider';
    import roundLine from '../../plugins/roundLine';
    import { showTip, hideTip } from '../../plugins/tooltip';
    import { smoothMoveY } from '../../plugins/smoothMove';

    export default {
        name: 'd3-vertical-slider',
        mixins: [mixins],
        methods: {
            drawVerticalSlider() {
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
                    __offsetTop__ = 0, __offsetBottom__ = 0,
                    g_h = h - top - bottom - __offsetBottom__ - __offsetTop__,
                    g_w = w - left - right, self = this;

                if (!this.isTheSameType(min, max) || g_w < 2 * circleRadius + circleStrokeWidth || g_h <= 4 * circleRadius + 2 * circleStrokeWidth) return;

                const hueMin = circleStrokeWidth / 2 + circleRadius,
                    hueMax = g_h - circleStrokeWidth / 2 - circleRadius,
                    interpolate = hueActual => d3.interpolate(max, min)((hueActual - hueMin) / (hueMax - hueMin));

                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);

                const g = svg
                    .append('g')
                    .attr('transform', `translate(${left}, ${top + __offsetTop__})`);

                g
                    .append('line')
                    .attr('class', 'track')
                    .attr('y1', hueMin)
                    .attr('y2', hueMax)
                    .attr('x1', g_w / 2)
                    .attr('x2', g_w / 2)
                    .attr('stroke', trackStroke)
                    .attr('stroke-opacity', trackStrokeOpacity)
                    .attr('stroke-width', trackStrokeWidth)
                    .call(roundLine, trackRounded);

                g
                    .append('line')
                    .attr('class', 'track track--inset')
                    .attr('y1', hueMin)
                    .attr('y2', hueMax)
                    .attr('x1', g_w / 2)
                    .attr('x2', g_w / 2)
                    .attr('stroke', trackInsetStroke)
                    .attr('stroke-opacity', trackInsetStrokeOpacity)
                    .attr('stroke-width', trackInsetStrokeWidth)
                    .call(roundLine, trackRounded);

                const circle = g
                    .append('circle')
                    .attr('cy', hueMax)
                    .attr('cx', g_w / 2)
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

                const hue = smoothMoveY(circle, hueMin, hueMax, onMoving, onMoved);

                const trackOverlay = g
                    .append('rect')
                    .attr('y', 0)
                    .attr('x', g_w / 2 - circleRadius - circleStrokeWidth / 2)
                    .attr('width', circleRadius * 2 + circleStrokeWidth)
                    .attr('height', g_h)
                    .attr('fill', 'none')
                    .attr('pointer-events', 'all')
                    .attr('cursor', 'crosshair')
                    .call(d3.drag()
                        .on('start.interrupt', () => trackOverlay.interrupt())
                        .on('start drag', () =>  hue(d3.event.y))
                    );

                trackOverlay
                    .on('mouseover', () => showTip(self.val, circle.node())())
                    .on('mouseout', hideTip);
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawVerticalSlider();
            },
            onResize() {
                this.safeDraw();
            }
        }
    }
</script>

<style>
    .d3-vertical-slider text {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: pointer;
    }
</style>

