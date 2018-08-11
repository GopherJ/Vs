<template>
    <div class="d3-metric" :style="{ 'width' : width, 'height' : height}"></div>
</template>

<script>
    import * as d3 from 'd3';
    import { isNull, isNumber } from 'lodash';
    import { showTip, hideTip } from '../../plugins/tooltip';
    import mixins from '../../mixins/metric';

    export default {
        name: 'd3-metric',
        mixins: [mixins],
        methods: {
            drawMetric() {
                const data = this.data,
                    {
                        axisXLabel = null,
                        axisLabelFontSize = 12,
                        axisLabelFontWeight = 400,
                        axisLabelFontOpacity = 0.5,

                        metricLabelColor = '#000000',
                        metricLabelFontSize = 120,
                        metricLabelFontWeight = 900,
                        metricLabelFontOpacity = 0.5,

                        metricTitle = d => `${d}`,

                        metricPrecision = 2
                    } = this.options,
                    {
                        axisXLabelLaneHeight = isNull(axisXLabel) ? 0 : 30
                    } = this.options,
                    [w, h] = this.getElWidthHeight(),
                    {left = 0, top = 0, right = 0, bottom = 0} = this.margin,
                    g_w = w - left - right,
                    g_h = h - top - bottom - axisXLabelLaneHeight;

                if (![g_w, g_h].every(el => el > 0)) return;

                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);

                const axisXLabelLane = svg
                    .append('g')
                    .attr('transform', `translate(${left}, ${top})`)
                    .attr('width', g_w)
                    .attr('height', axisXLabelLaneHeight);

                const g = svg
                    .append('g')
                    .attr('transform', `translate(${left}, ${top + axisXLabelLaneHeight})`)
                    .attr('width', g_w)
                    .attr('height', g_h);

                axisXLabelLane
                    .append('text')
                    .attr('text-anchor', 'middle')
                    .attr('x', g_w / 2)
                    .attr('y', axisXLabelLaneHeight / 2)
                    .attr('dy', '0.32em')
                    .text(axisXLabel)
                    .attr('fill', '#000')
                    .attr('fill-opacity', axisLabelFontOpacity)
                    .attr('font-size', axisLabelFontSize)
                    .attr('font-weight', axisLabelFontWeight);

                g.append('text')
                    .datum(data)
                    .attr('text-anchor', 'middle')
                    .attr('x', g_w / 2)
                    .attr('y', g_h / 2)
                    .attr('dy', '0.32em')
                    .text(isNumber(data) ? d3.format(',')(data.toFixed(metricPrecision)).toString() : data)
                    .attr('fill', metricLabelColor)
                    .attr('fill-opacity', metricLabelFontOpacity)
                    .attr('font-size', metricLabelFontSize)
                    .attr('font-weight', metricLabelFontWeight)
                    .on('mouseover', showTip(metricTitle))
                    .on('mouseout', hideTip);
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawMetric();
            },
            onResize() {
                this.safeDraw();
            }
        }
    }
</script>

<style>
    @import url(../../css/index.css);

    .d3-metric text {
        cursor: pointer;
    }
</style>
