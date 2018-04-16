<template>
    <div :style="{ 'width' : width, 'height' : height}" class="d3-line"></div>
</template>

<script>
/* eslint-disable */
    import * as d3 from 'd3';
    import tip from 'd3-tip';
    import mixins from '../../mixins';
    import _ from 'lodash';

    // load tip
    Object.assign(d3, {
        tip
    });

    export default {
        name: 'd3-line',
        mixins: [mixins],
        methods: {
            drawLine() {
                // container width and height
                const [w, h] = this.getElWidthHeight();

                // constants
                const data = _.cloneDeep(this.data),
                      {left = 0, top = 20, right = 10, bottom = 0} = this.margin,
                      {
                          // line config
                          stroke = 'rgb(188, 82, 188)',
                          strokeWidth = 2,

                          // axis config
                          axisXHeight = 25,
                          axisYWidth = 35,
                          axisFontSize = 14,

                          // circle config
                          circleRadius = 5,
                          circleColor = 'rgb(188, 82, 188)',

                          // tooltip config
                          circleTitle = d  => d.value,

                          // curve config
                          curve = 'curveCardinal',

                          // axis label config
                          axisXLabel = 'Key',
                          axisYLabel = 'Value',
                          axisXLabelHeight = 30,
                          axisYLabelWidth = 20,
                          axisLabelFontSize = 12,
                          axisLabelFontWeight = 400,
                          axisLabelFontOpacity = 0.5
                      } = this.options,
                      g_w = w - left - right - axisYLabelWidth - axisYWidth,
                      g_h = h - top - bottom - axisXLabelHeight - axisXHeight,
                      ticks = this.selectTicksNumY(g_h);

                // create scale x
                const x = d3.scalePoint()
                    .domain(data.map(d => d.key))
                    .range([0, g_w]);

                // create scale y
                const y = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d.value)])
                    .range([g_h, 0]);

                // line generator
                const lineGen = d3.line()
                    .x(d => x(d.key))
                    .y(d => y(d.value))
                    .defined(d => d !== null && d !== undefined)
                    .curve(d3[curve]);

                // create svg
                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', `${w}`)
                    .attr('height', `${h}`);

                // create g to contain our graph
                const g = svg.append('g')
                    .attr('transform', `translate(${left + axisYLabelWidth + axisYWidth}, ${top})`)
                    .attr('width', `${g_w}`)
                    .attr('height', `${g_h}`);

                // create axis x
                svg.append('g')
                    .attr('transform', `translate(${left + axisYLabelWidth + axisYWidth}, ${top + g_h})`)
                    .attr('width', g_w)
                    .attr('height', axisXHeight)
                    .append('g')
                    .attr('class', 'axis axis--x')
                    .call(d3.axisBottom(x))
                    .attr('font-size', axisFontSize);

                // create axis y
                svg.append('g')
                    .attr('transform', `translate(${left + axisYLabelWidth}, ${top})`)
                    .attr('width', axisYWidth)
                    .attr('height', g_h)
                    .append('g')
                    .attr('transform', `translate(${axisYWidth}, 0)`)
                    .attr('class', 'axis axis--y')
                    .call(d3.axisLeft(y).ticks(ticks))
                    .attr('font-size', axisFontSize);


                // create lane to hold label for the axis of x
                const axisXLabelLane = svg.append('g')
                    .attr('transform', `translate(${left + axisYLabelWidth + axisYWidth}, ${top + g_h + axisXHeight})`)
                    .attr('width', g_w)
                    .attr('height', axisXLabelHeight);

                // create lane to hold label for the axis of y
                const axisYLabelLane = svg.append('g')
                    .attr('transform', `translate(${left}, ${top})`)
                    .attr('width', axisYLabelWidth)
                    .attr('height', g_h);

                // start drawing
                g.append('path')
                    .datum(data)
                    .attr('d', lineGen)
                    .attr('fill', '#fff')
                    .attr('stroke', stroke)
                    .attr('stroke-width', strokeWidth);

                // create d3-tip
                const tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0]);

                // draw circles to show where is the point
                g.selectAll('circle')
                    .data(data)
                    .enter()
                    .append('circle')
                    .attr('class', 'point')
                    .attr('r', circleRadius)
                    .attr('cx', d => x(d.key))
                    .attr('cy', d => y(d.value))
                    .attr('fill', circleColor)
                    .on('mouseover', function(d, i) {
                        g.call(tip);
                        tip.html(circleTitle(d));
                        tip.show();
                    })
                    .on('mouseout', function(d, i) {
                        tip.hide();
                        d3.selectAll('.d3-tip').remove();
                    });

                // draw the label of the axis of x
                axisXLabelLane
                    .append('text')
                    .attr('class', 'label--x')
                    .attr('text-anchor', 'middle')
                    .attr('x', g_w/2)
                    .attr('y', axisXLabelHeight/2)
                    .text(axisXLabel)
                    .attr('font-size', axisLabelFontSize)
                    .attr('font-weight', axisLabelFontWeight)
                    .attr('fill-opacity', axisLabelFontOpacity);


                // draw the label of the axis of y
                axisYLabelLane
                    .append('text')
                    .attr('class', 'label--y')
                    .attr('transform', 'rotate(-90)')
                    .attr('text-anchor', 'middle')
                    .attr('y', axisYLabelWidth)
                    .attr('x', -g_h/2)
                    .text(axisYLabel)
                    .attr('font-size', axisLabelFontSize)
                    .attr('font-weight', axisLabelFontWeight)
                    .attr('fill-opacity', axisLabelFontOpacity);

            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawLine();
            },
            onResize() {
                this.safeDraw();
            }
        }
    }
</script>

<style>
    @import url(../../css/index.css);

    .d3-line .label--x, .d3-line .label--y {
        cursor: pointer;
    }

    .d3-line .point {
        cursor: pointer;
    }
</style>
