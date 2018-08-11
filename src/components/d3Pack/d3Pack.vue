<template>
    <div class="d3-pack" :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import _ from 'lodash';
    import mixins from '../../mixins/layout';
    import { showTip, hideTip } from '../../plugins/tooltip';

    export default {
        name: 'd3-pack',
        mixins: [mixins],
        methods: {
            drawPack() {
                const data = _.cloneDeep(this.data);

                const {
                    left = 0,
                    right = 0,
                    top = 0,
                    bottom = 0
                } = this.margin,
                {
                    circleTitle = d => `${d.data.key}<br>${d.data.value}`,

                    circleFill = '#6eadc1',
                    circleStroke = '#6eadc1',
                    circleFillOpacity = 0.6,
                    circleStrokeOpacity = 1,

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

                const pack = d3.pack()
                    .size([g_w, g_h]);

                const rootNode = d3.hierarchy(data);
                rootNode.sum(d => d.value);

                pack(rootNode);

                g.selectAll('path')
                    .data(rootNode.descendants())
                    .enter()
                    .append('circle')
                    .attr('cx', d => d.x)
                    .attr('cy', d => d.y)
                    .attr('r', d => d.r)
                    .attr('fill', d => schemeCategory20(d.data.key))
                    .attr('stroke', d => schemeCategory20(d.data.key))
                    .attr('fill-opacity', circleFillOpacity)
                    .attr('stroke-opacity', circleStrokeOpacity)
                    .on('mouseover', showTip(circleTitle))
                    .on('mouseout', hideTip)
                    .select(function() {
                        return d3.select(this.parentNode)
                            .append('text').node();
                    })
                    .attr('text-anchor', 'middle')
                    .attr('pointer-events', 'none')
                    .attr('transform', d => `translate(${d.x}, ${d.y})`)
                    .text(d => d.data.key);
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawPack();
            },
            onResize() {
                this.safeDraw();
            }
        }
    }
</script>

<style>
    @import url('../../css/index.css');

   .d3-pack circle {
        cursor: pointer;
    }

   .d3-pack text {
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        cursor: pointer;
    }
</style>



