<template>
    <div class="d3-sunburst" :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import _ from 'lodash';
    import mixins from '../../mixins/layout';
    import { showTip, hideTip } from '../../plugins/tooltip';

    export default {
        name: 'd3-sunburst',
        mixins: [mixins],
        methods: {
            drawSunburst() {
                const data = _.cloneDeep(this.data);

                const {
                    left = 0,
                    right = 0,
                    top = 0,
                    bottom = 0
                } = this.margin,
                {
                    arcTitle = d => `${d.value}`,

                    padding = 0,

                    fillOpacity = 0.6,
                    strokeOpacity = 1,

                    axisXLabel = null,

                    axisFontSize = 12,
                    axisFontWeight = 400,
                    axisFontOpacity = 0.5
                } = this.options,
                {
                    axisXLabelLaneHeight = _.isNull(axisXLabel) ? 0 : 30
                } = this.options,
                [w, h] = this.getElWidthHeight(),
                g_w =  w - left - right,
                g_h = h - top - bottom - axisXLabelLaneHeight,
                r = Math.min(g_w, g_h) / 2;

                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);

                const g = svg
                    .append('g')
                    .attr('transform',  `translate(${left + g_w / 2}, ${top + g_h / 2})`);

                const axisXLabelLane = svg
                    .append('g')
                    .attr('transform', `translate(${left}, ${top + g_h})`);

                axisXLabelLane
                    .append('text')
                    .attr('text-anchor', 'middle')
                    .attr('x', g_w / 2)
                    .attr('y', axisXLabelLaneHeight / 2)
                    .attr('dy', '0.32em')
                    .text(axisXLabel)
                    .attr('font-size', axisFontSize)
                    .attr('font-weight', axisFontWeight)
                    .attr('fill-opacity', axisFontOpacity);

                const schemeCategory20 = d3.scaleOrdinal()
                    .range(d3.schemeCategory20);

                const arc = d3.arc()
                    .startAngle(d => d.x0)
                    .endAngle(d => d.x1)
                    .innerRadius(d => d.y0)
                    .outerRadius(d => d.y1);

                const label = d3.arc()
                    .startAngle(d => d.x0)
                    .endAngle(d => d.x1)
                    .innerRadius(d => (d.y0 + d.y1) / 2)
                    .outerRadius(d => (d.y0 + d.y1) / 2);

                const partition = d3.partition()
                    .size([2 * Math.PI, r]);

                const rootNode = d3.hierarchy(data)
                    .sum(d => d.value);

                partition(rootNode);

                g.selectAll('path')
                    .data(rootNode.descendants())
                    .enter()
                    .append('path')
                    .attr('d', arc)
                    .attr('fill', d => schemeCategory20(d.data.key))
                    .attr('fill-opacity', fillOpacity)
                    .attr('stroke-opacity', strokeOpacity)
                    .on('mouseover', showTip(arcTitle))
                    .on('mouseout', hideTip)
                    .select(function() {
                        return d3.select(this.parentNode)
                            .append('text').node();
                    })
                    .attr('text-anchor', 'middle')
                    .attr('pointer-events', 'none')
                    .attr('transform', d => `translate(${label.centroid(d)})`)
                    .attr('dy', '0.32em')
                    .text(d => d.data.key);
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawSunburst();
            },
            onResize() {
                this.safeDraw();
            }
        }
    }
</script>

<style>
    @import url('../../css/index.css');

   .d3-sunburst path {
        cursor: pointer;
    }

   .d3-sunburst text {
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        cursor: pointer;
    }
</style>

