<template>
    <div :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
/* eslint-disable */
    import * as d3 from 'd3';
    import * as tip from 'd3-tip';
    import mixins from '../../mixins';

    export default {
        name: 'd3-pie',
        mixins: [mixins],
        methods: {
            drawPie() {
                // data and container width, height
                const data = this.data;
                const [w, h] = this.getElWidthHeight();

                // constants
                const {
                        left = 0,
                        top = 0,
                        right = 0,
                        bottom = 0
                    } = this.margin,

                    {   innerRadius = 5,
                        cornerRadius = 5,
                        padAngle = 0.01,
                        arcTitle = d => d.data.value,
                        arcLabel = d => d.data.key,
                        axisXLabelHeight = 30,
                        axisXLabel = 'Key',
                        arcLabelFontSize = 10,
                        animationDuration = 1000
                    } = this.options,

                    g_w = w - left - right,
                    g_h = h -top - bottom - axisXLabelHeight,
                    _outerRadius = Math.min(g_w/2, g_h/2),
                    outerRadius = _outerRadius < innerRadius ? innerRadius : _outerRadius;

                // create svg
                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', `${w}`)
                    .attr('height', `${h}`);

                // create g to contain our graph
                const g = svg.append('g')
                    .attr('width', `${g_w}`)
                    .attr('height', `${g_h}`)
                    .attr('transform', `translate(${left},${top})`);

                // lane to hold label text
                const axisLabelLane = svg
                    .append('g')
                    .attr('transform', `translate(${left}, ${top + g_h})`)
                    .attr('width', g_w)
                    .attr('height', axisXLabelHeight);

                 // tooltip
                const tip = d3.tip()
                        .attr('class', 'd3-tip')
                        .offset([-10, 0]);

                // circle center where we will begin to draw our graph
                const gc = g.append('g')
                    .attr('transform', `translate(${g_w/2},${g_h/2})`);

                // create color set
                const color = d3.scaleSequential()
                    .domain(d3.extent(data.map(d => d.value)))
                    .interpolator(d3.interpolateWarm);

                // data pre treat
                const pie = d3.pie()
                    .sort(null)
                    .value(d => d.value);

                // create arc function
                const path = d3.arc()
                    .innerRadius(innerRadius)
                    .outerRadius(outerRadius)
                    .cornerRadius(cornerRadius)
                    .padAngle(padAngle);

                // crate label which will be at middle of the innerRadius and outerRadius
                const label = d3.arc()
                    .innerRadius((outerRadius + innerRadius) / 2)
                    .outerRadius((outerRadius + innerRadius) / 2);

                // start drawing
                const arc = gc.selectAll('.arc')
                    .data(pie(data))
                    .enter()
                    .append('g');

                // draw arc path
                arc.append('path')
                    .attr('class', 'arc')
                    .transition()
                    .duration(animationDuration)
                    .delay((d, i) => 50 * i)
                    .attrTween('d', d => {
                        const startAngle = d.startAngle;
                        const interpolate = d3.interpolate({endAngle: startAngle}, d);

                        return t => path(interpolate(t));
                    })
                    .attr('fill', (d, i) => color(d.data.value));

                // listen to mouse enter, leave
                arc
                    .on('mouseover', function(d, i){
                        g.call(tip);
                        tip.html(arcTitle(d));
                        tip.show();
                    })
                    .on('mouseout', function(d, i) {
                        tip.hide();
                        d3.selectAll('.d3-tip').remove();
                    });

                // append arc label
                arc.append('text')
                    .attr('transform', (d, i) => `translate(${label.centroid(d)})`)
                    .attr('text-anchor', 'middle')
                    .attr('opacity', '0')
                    .transition()
                    .duration(animationDuration)
                    .delay((d,i) => 50 * i)
                    .attr('opacity', '0.75')
                    .text(arcLabel)
                    .attr('font-size', arcLabelFontSize);

                // append label to the lane
                axisLabelLane.append('text')
                    .attr('class', 'label label--x')
                    .attr('text-anchor', 'middle')
                    .attr('x', g_w/2)
                    .attr('y', axisXLabelHeight/2)
                    .text(axisXLabel);
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

    .arc {
        shape-rendering: crispEdges;
    }

    .arc:hover {
        cursor: pointer;
    }

    .label.label--x {
        font-family: sans-serif;
        font-weight: 600;
    }
</style>
