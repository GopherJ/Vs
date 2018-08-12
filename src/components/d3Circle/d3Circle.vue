<template>
    <div class="d3-circle" :style="{ 'width' : width, 'height' : height}"></div>
</template>

<script>
    import * as d3 from 'd3';
    import { showTip, hideTip } from '../../plugins/tooltip';
    import mixins from '../../mixins/circle';

    export default {
        name: 'd3-circle',
        mixins: [mixins],
        methods: {
            drawCircle() {
                const data = this.data,
                    { left = 0, top = 0, right = 0, bottom = 0 } = this.margin,
                    [w, h] = this.getElWidthHeight(),
                    g_w = w - left - right,
                    g_h = h - top - bottom,
                    outerRadius = Math.min(g_w, g_h) / 2,
                    {
                        innerRadiusRatio = 0.8,

                        circleBackground = 'rgb(230, 237, 244)',
                        circleForeground = 'rgb(0, 181, 241)',

                        labelColor = 'rgb(0, 181, 241)',

                        labelFontSize = 50,
                        labelFontWeight = 900,
                        labelFontOpacity = 0.5,

                        precision = 2,

                        animationDuration = 1000,
                        circleTitle = d =>`${d}`
                    } = this.options;

                if (![g_w, g_h].every(el => el > 0) || innerRadiusRatio >= 1) return;

                const label = d3.format(`.${precision}%`)(data),
                    innerRadius = innerRadiusRatio * outerRadius;

                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);

                const g = svg
                    .append('g')
                    .attr('transform', `translate(${left}, ${top})`);

                const o = g
                    .append('g')
                    .attr('transform', `translate(${g_w / 2}, ${g_h / 2})`);

                const arcGen = d3.arc()
                    .innerRadius(innerRadius)
                    .outerRadius(outerRadius);

                const interpolateStart = {
                    startAngle: 0,
                    endAngle: 0
                };

                const interpolateEnd = {
                    startAngle: 0,
                    endAngle: 2 * Math.PI * data
                };

                const arcBackgroundPath = arcGen({
                    startAngle: 0,
                    endAngle: 2 * Math.PI
                });

                o.append('text')
                    .datum(data)
                    .attr('text-anchor', 'middle')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('dy', '0.32em')
                    .text(label)
                    .attr('fill', labelColor)
                    .attr('fill-opacity', labelFontOpacity)
                    .attr('font-size', labelFontSize)
                    .attr('font-weight', labelFontWeight)
                    .on('mouseover', showTip(circleTitle))
                    .on('mouseout', hideTip);

                o.append('g')
                    .append('path')
                    .attr('class', 'arc arc--background')
                    .attr('d', arcBackgroundPath)
                    .attr('fill', circleBackground);

                o.append('g')
                    .append('path')
                    .attr('class', 'arc arc--foreground')
                    .attr('fill', circleForeground)
                    .transition()
                    .duration(animationDuration)
                    .attrTween('d', function () {
                        const interpolator = d3.interpolate(interpolateStart, interpolateEnd);

                        return t => arcGen(interpolator(t));
                    });
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawCircle();
            },
            onResize() {
                this.safeDraw();
            }
        }
    }
</script>

<style>
    @import url(../../css/index.css);

    .d3-circle text {
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .d3-circle path {
        cursor: pointer;
    }
</style>
