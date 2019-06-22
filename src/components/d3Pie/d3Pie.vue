<template>
    <div  class="d3-pie" :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import { isNull, isNumber } from 'lodash';
    import mixins from '../../mixins';
    import { showTip, hideTip } from '../../plugins/tooltip';

    export default {
        name: 'd3-pie',
        mixins: [mixins],
        methods: {
            drawPie() {
                const { left = 0, top = 0, right = 0, bottom = 0 } = this.margin,
                    {
                        innerRadius = 50,
                        cornerRadius = 0,

                        padAngle = 0.01,

                        arcTitle = d => `${d.data.key}<br>${d.data.value}`,

                        arcLabel = d => null,


                        axisXLabel = null,

                        axisLabelFontSize = 14,
                        axisLabelFontWeight = 600,
                        axisLabelFontOpacity = 1,

                        arcLabelFontSize = 9,
                        arcLabelFontWeight = 400,
                        arcLabelFontOpacity = 0.5,

                        animationDuration = 1000,

                        defaultColor = 'rgb(175, 240, 91)',

                        sortOrder = 'asc'
                    } = this.options,
                    {
                        axisXLabelHeight = isNull(axisXLabel) ? 0 : 30,
                    } = this.options,
                    data =  [...(this.data)],
                    [w, h] = this.getElWidthHeight(),
                    g_w = w - left - right,
                    g_h = h - top - bottom - axisXLabelHeight,
                    outerRadius = Math.min(g_w / 2, g_h / 2);

                if (![g_w, g_h].every(el => el > 0) || outerRadius <= innerRadius) return;

                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);

                const g = svg
                    .append('g')
                    .attr('transform', `translate(${left},${top})`)
                    .append('g')
                    .attr('transform', `translate(${g_w / 2},${g_h / 2})`);

                const axisLabelLane = svg
                    .append('g')
                    .attr('transform', `translate(${left}, ${top + g_h})`);

                const interpolateCool = d3.scaleSequential()
                    .domain(d3.extent(data.map(d => isNumber(d.value) ? d.value : +d.value)))
                    .interpolator(d3.interpolateCool);

                const pie = d3.pie()
                    .sort((x, y) =>
                        sortOrder === 'asc'
                            ? d3.ascending(x.value, y.value)
                            : sortOrder === 'desc'
                            ? d3.descending(x.value, y.value)
                            : null
                    )
                    .value(d => isNumber(d.value) ? d.value : +d.value);

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
                    .duration(isNumber(animationDuration) ? animationDuration : 0)
                    .attrTween('d', d => {
                        const startAngle = d.startAngle,
                             interpolate = d3.interpolate({endAngle: startAngle}, d);

                        return t => pathGen(interpolate(t));
                    })
                    .attr('fill', d =>  data.length > 1 ? interpolateCool(isNumber(d.data.value) ? d.data.value : +d.data.value) : defaultColor);

                paths
                    .on('mouseover', showTip(arcTitle))
                    .on('mouseout', hideTip);

                enter
                    .append('text')
                    .attr('transform', d => `translate(${arcLabelLane.centroid(d)})`)
                    .attr('text-anchor', 'middle')
                    .attr('pointer-events', 'none')
                    .attr('fill-opacity', 0)
                    .transition()
                    .duration(isNumber(animationDuration) ? animationDuration : 0)
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
