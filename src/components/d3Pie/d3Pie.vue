<template>
    <div :style="{ 'width' : width, 'height' : height }" class="d3-pie"></div>
</template>

<script>
/* eslint-disable */
    import * as d3 from 'd3';
    import tip from 'd3-tip';
    import mixins from '../../mixins';
    import _ from 'lodash';
    import offset from 'document-offset';

    // load tip
    Object.assign(d3, {
        tip
    });

    export default {
        name: 'd3-pie',
        mixins: [mixins],
        methods: {
            drawPie() {
                // data and container width, height
                const data = _.cloneDeep(this.data);
                const [w, h] = this.getElWidthHeight();

                // constants
                const {
                        left = 0,
                        top = 0,
                        right = 0,
                        bottom = 0
                    } = this.margin,

                    {
                        // pie size config
                        innerRadius = 5,
                        cornerRadius = 5,

                        // gap(percent) between arcs config
                        padAngle = 0.01,

                        // tooltip config
                        arcTitle = d => d.data.value,

                        // arc label
                        arcLabel = d => d.data.key,

                        // axisX label config
                        axisXLabelHeight = 30,
                        axisXLabel = 'Key',
                        axisXLabelFontSize = 12,
                        axisXLabelFontWeight = 400,
                        axisXLabelFontOpacity = 0.5,

                        // arc label config
                        arcLabelFontSize = 10,
                        arcLabelFontOpacity = 0.5,

                        // animation config
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

                // circle center where we will begin to draw our graph
                const g = svg.append('g')
                    .attr('width', `${g_w}`)
                    .attr('height', `${g_h}`)
                    .attr('transform', `translate(${left},${top})`)
                    .append('g')
                    .attr('transform', `translate(${g_w/2},${g_h/2})`);

                // lane to hold label text
                const axisLabelLane = svg
                    .append('g')
                    .attr('transform', `translate(${left}, ${top + g_h})`)
                    .attr('width', g_w)
                    .attr('height', axisXLabelHeight);

                 // tooltip
                const tip = d3.tip()
                        .attr('class', 'd3-tip')
                        .offset([0, 0]);

                // create color set
                const interpolateWarm = d3.scaleSequential()
                    .domain(d3.extent(data.map(d => d.value)))
                    .interpolator(d3.interpolateWarm);

                // data pie treat
                const pie = d3.pie()
                    .sort(null)
                    .value(d => d.value);

                // create arc function
                const pathGen = d3.arc()
                    .innerRadius(innerRadius)
                    .outerRadius(outerRadius)
                    .cornerRadius(cornerRadius)
                    .padAngle(padAngle);

                // crate label which will be at middle of the innerRadius and outerRadius
                const arcLabelLane = d3.arc()
                    .innerRadius((outerRadius + innerRadius) / 2)
                    .outerRadius((outerRadius + innerRadius) / 2);

                // start drawing
                const arcContainer = g.selectAll('.arc')
                    .data(pie(data))
                    .enter()
                    .append('g');

                // draw arc path
                arcContainer.append('path')
                    .attr('class', 'arc')
                    .transition()
                    .duration(animationDuration)
                    .delay((d, i) => 50 * i)
                    .attrTween('d', d => {
                        const startAngle = d.startAngle,
                              interpolate = d3.interpolate({endAngle: startAngle}, d);
                        return t => pathGen(interpolate(t));
                    })
                    .attr('fill', (d, i) => {
                        if (data.length > 1) {
                            return interpolateWarm(d.data.value);
                        } else {
                            return 'rgb(175, 240, 91)';
                        }
                    });

                // listen to mouse enter, leave
                arcContainer
                    .on('mouseover', function(d, i){
                        g.call(tip);
                        tip.html(arcTitle(d));
                        tip.show();

                        const tipSelection = d3.select('.d3-tip');
                        tipSelection.style('top', `${offset(this).top - tipSelection.node().getBoundingClientRect().height - 10}px`);
                        tipSelection.style('left', `${offset(this).left + this.getBBox().width/2 - tipSelection.node().getBoundingClientRect().width/2}px`);
                    })
                    .on('mouseout', function(d, i) {
                        // tip.hide();
                        d3.selectAll('.d3-tip').remove();
                    });

                // append arc label
                arcContainer.append('text')
                    .attr('transform', (d, i) => `translate(${arcLabelLane.centroid(d)})`)
                    .attr('cursor', 'pointer')
                    .attr('text-anchor', 'middle')
                    .attr('fill-opacity', 0)
                    .transition()
                    .duration(animationDuration)
                    .delay((d,i) => 50 * i)
                    .attr('fill-opacity', arcLabelFontOpacity)
                    .text(arcLabel)
                    .attr('font-size', arcLabelFontSize);

                // append label to the lane
                axisLabelLane.append('text')
                    .attr('class', 'label--x')
                    .attr('text-anchor', 'middle')
                    .attr('x', g_w/2)
                    .attr('y', axisXLabelHeight/2)
                    .text(axisXLabel)
                    .attr('font-size', axisXLabelFontSize)
                    .attr('font-weight', axisXLabelFontWeight)
                    .attr('fill-opacity', axisXLabelFontOpacity);
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

    .d3-pie .arc:hover {
        cursor: pointer;
    }

    .d3-pie .label--x {
        cursor: pointer;
    }
</style>
