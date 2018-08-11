<template>
    <div class="d3-icicle-vertical" :style="{ 'width': width, 'height': height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import _ from 'lodash';
    import mixins from '../../mixins/layout';
    import { showTip, hideTip } from '../../plugins/tooltip';

    export default {
        name: 'd3-icicle-vertical',
        mixins: [mixins],
        methods: {
            drawICicle() {
                const data = _.cloneDeep(this.data);

                const {
                    left = 0,
                    right = 0,
                    top = 0,
                    bottom = 0
                } = this.margin,
                {
                    rectTitle = d => `${d.value}`,

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
                g_h = h - top - bottom - axisXLabelLaneHeight;

                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);

                const g = svg
                    .append('g')
                    .attr('transform',  `translate(${left}, ${top})`);

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

                const partition = d3.partition()
                    .size([g_w, g_h])
                    .padding(padding);

                const rootNode = d3.hierarchy(data)
                    .sum(d => d.value);

                partition(rootNode);

                g.selectAll('rect')
                    .data(rootNode.descendants())
                    .enter()
                    .append('rect')
                    .attr('x', d => d.x0)
                    .attr('y', d => d.y0)
                    .attr('width', d => d.x1 - d.x0)
                    .attr('height', d => d.y1 - d.y0)
                    .attr('fill', d => schemeCategory20(d.data.key))
                    .attr('fill-opacity', fillOpacity)
                    .attr('stroke-opacity', strokeOpacity)
                    .on('mouseover', showTip(rectTitle))
                    .on('mouseout', hideTip)
                    .select(function() {
                        return d3.select(this.parentNode)
                            .append('text')
                            .node();
                    })
                    .attr('text-anchor', 'middle')
                    .attr('pointer-events', 'none')
                    .attr('x', d => (d.x0 + d.x1) / 2)
                    .attr('y', d => (d.y0 + d.y1) / 2)
                    .attr('dy', '0.32em')
                    .text(d => d.data.key);
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawICicle();
            },
            onResize() {
                this.safeDraw();
            }
        }

    }
</script>

<style>
    @import url(../../css/index.css);

    .d3-icicle-vertical rect {
        cursor: pointer;
    }

    .d3-icicle-vertical text {
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        cursor: pointer;
    }
</style>

