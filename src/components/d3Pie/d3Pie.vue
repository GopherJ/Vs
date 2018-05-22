<template>
    <div  class="d3-pie" :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import {showTip, hideTip} from '../../util/tooltip';
    import mixins from '../../mixins';
    import _ from 'lodash';

    export default {
        name: 'd3-pie',
        mixins: [mixins],
        methods: {
            drawPie() {
                const data = _.cloneDeep(this.data);
                const [w, h] = this.getElWidthHeight();
                const {
                        left = 0,
                        top = 0,
                        right = 0,
                        bottom = 0
                    } = this.margin,
                    {
                        innerRadius = 50,
                        cornerRadius = 0,

                        padAngle = 0.01,

                        arcTitle = d => `${d.data.key}<br>${d.data.value}`,

                        arcLabel = _ => null,


                        axisXLabel = null,
                        axisLabelFontSize = 12,
                        axisLabelFontWeight = 400,
                        axisLabelFontOpacity = 0.5,

                        arcLabelFontSize = 10,
                        arcLabelFontWeight = 400,
                        arcLabelFontOpacity = 0.5,

                        animationDuration = 1000,
                        delay = 50,

                        colorDefault = 'rgb(175, 240, 91)'
                    } = this.options,
                    {
                        axisXLabelHeight = _.isNull(axisXLabel) ? 0 : 30,
                    } = this.options,
                    g_w = w - left - right,
                    g_h = h - top - bottom - axisXLabelHeight,
                    outerRadius = Math.min(g_w / 2, g_h / 2);

                if (![g_w, g_h].every(el => el > 0) || outerRadius <= innerRadius) {
                    return;
                }

                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', `${w}`)
                    .attr('height', `${h}`);

                const g = svg
                    .append('g')
                    .attr('transform', `translate(${left},${top})`)
                    .attr('width', `${g_w}`)
                    .attr('height', `${g_h}`)
                    .append('g')
                    .attr('transform', `translate(${g_w / 2},${g_h / 2})`);

                const axisLabelLane = svg
                    .append('g')
                    .attr('transform', `translate(${left}, ${top + g_h})`)
                    .attr('width', g_w)
                    .attr('height', axisXLabelHeight);

                const interpolateWarm = d3.scaleSequential()
                    .domain(d3.extent(data.map(d => d.value)))
                    .interpolator(d3.interpolateWarm);

                const pie = d3.pie()
                    .sort(null)
                    .value(d => d.value);

                const pathGen = d3.arc()
                    .innerRadius(innerRadius)
                    .outerRadius(outerRadius)
                    .cornerRadius(cornerRadius)
                    .padAngle(padAngle);

                const arcLabelLane = d3.arc()
                    .innerRadius((outerRadius + innerRadius) / 2)
                    .outerRadius((outerRadius + innerRadius) / 2);

                const enter = g
                    .selectAll('path')
                    .data(pie(data))
                    .enter();

                const paths = enter.append('path');

                paths
                    .transition()
                    .duration(animationDuration)
                    .delay((d, i) => delay * i)
                    .attrTween('d', d => {
                        const startAngle = d.startAngle,
                              interpolate = d3.interpolate({endAngle: startAngle}, d);

                        return t => pathGen(interpolate(t));
                    })
                    .attr('fill', d =>  data.length > 1 ? interpolateWarm(d.data.value) : colorDefault);

                paths
                    .on('mouseover', (d) => {
                        showTip(arcTitle(d));
                    })
                    .on('mouseout', hideTip);

                enter
                    .append('text')
                    .attr('transform', d => `translate(${arcLabelLane.centroid(d)})`)
                    .attr('text-anchor', 'middle')
                    .attr('fill-opacity', 0)
                    .transition()
                    .duration(animationDuration)
                    .delay((d,i) => delay * i)
                    .attr('fill-opacity', arcLabelFontOpacity)
                    .text(arcLabel)
                    .attr('font-size', arcLabelFontSize)
                    .attr('font-weight', arcLabelFontWeight);

                axisLabelLane
                    .append('text')
                    .attr('class', 'label label--x')
                    .attr('text-anchor', 'middle')
                    .attr('x', g_w / 2)
                    .attr('y', axisXLabelHeight / 2)
                    .attr('dy', '0.32em')
                    .text(axisXLabel)
                    .attr('font-size', axisLabelFontSize)
                    .attr('font-weight', axisLabelFontWeight)
                    .attr('fill-opacity', axisLabelFontOpacity);
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawPie();
            },
            onResize() {
               this.safeDraw();
            }
        }
    }
</script>

<style>
    @import url(../../css/index.css);

    .d3-pie path:hover {
        cursor: pointer;
    }

    .d3-pie text {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: pointer;
    }
</style>
