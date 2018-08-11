<template>
    <div class="d3-tree" :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import _ from 'lodash';
    import mixins from '../../mixins/layout';
    import { showTip, hideTip } from '../../plugins/tooltip';

    export default {
        name: 'd3-tree',
        mixins: [mixins],
        methods: {
            drawTree() {
                const data = _.cloneDeep(this.data);

                const {
                    left = 0,
                    right = 0,
                    top = 0,
                    bottom = 0
                } = this.margin,
                {
                    nodeTitle = d => `${d.data.key}<br>${d.data.value}`,

                    nodeFill = '#6eadc1',
                    nodeStroke = '#6eadc1',
                    nodeFillOpacity = 0.6,
                    nodeStrokeOpacity = 1,

                    linkStroke = '#6eadc1',
                    linkStrokeWidth = 1,
                    linkStrokeOpacity = 1,

                    nodeRadius = 10,

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
                    .attr('transform',  `translate(${left + nodeRadius}, ${top + nodeRadius})`);

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

                const tree = d3.tree()
                    .size([g_w - 2 * nodeRadius, g_h - 2 * nodeRadius]);

                const rootNode = d3.hierarchy(data);

                tree(rootNode);

                g.selectAll('line')
                    .data(rootNode.links())
                    .enter()
                    .append('line')
                    .attr('x1', d => d.source.x)
                    .attr('y1', d => d.source.y)
                    .attr('x2', d => d.target.x)
                    .attr('y2', d => d.target.y)
                    .attr('pointer-events', 'none')
                    .attr('stroke', linkStroke)
                    .attr('stroke-opacity', linkStrokeOpacity)
                    .attr('stroke-width', linkStrokeWidth);

                g.selectAll('path')
                    .data(rootNode.descendants())
                    .enter()
                    .append('circle')
                    .attr('cx', d => d.x)
                    .attr('cy', d => d.y)
                    .attr('r', nodeRadius)
                    .attr('fill', nodeFill)
                    .attr('stroke', nodeStroke)
                    .attr('fill-opacity', nodeFillOpacity)
                    .attr('stroke-opacity', nodeStrokeOpacity)
                    .on('mouseover', showTip(nodeTitle))
                    .on('mouseout', hideTip);
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawTree();
            },
            onResize() {
                this.safeDraw();
            }
        }
    }
</script>

<style>
    @import url('../../css/index.css');

   .d3-tree circle {
        cursor: pointer;
    }

   .d3-tree text {
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        cursor: pointer;
    }
</style>



