<template>
    <div :style="{ 'width' : width, 'height' : height}"></div>
</template>

<script>
/* eslint-disable */
    import * as d3 from 'd3';
    import d3Tip from 'd3-tip';
    import mixins from '../../mixins';

    // load d3-tip
    Object.assign(d3, {
        tip: d3Tip
    });

    export default {
        name: 'd3-line',
        mixins: [mixins],
        methods: {
            drawLine() {
                // container width and height
                const [w, h] = this.getElWidthHeight();

                // constants
                const data = this.data,
                      {left = 0, top = 20, right = 10, bottom = 0} = this.margin,
                      {
                          stroke = 'rgb(188, 82, 188)',
                          strokeWidth = 2,
                          fontSize = 14,
                          circleRadius = 5,
                          circleColor = 'rgb(188, 82, 188)',
                          circleTitle = d  => d.value,
                          curve = 'curveCardinal',
                          axisXLabel = 'Key',
                          axisYLabel = 'Value',
                          axisXHeight = 25,
                          axisYWidth = 35,
                          axisXLabelHeight = 30,
                          axisYLabelWidth = 20
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
                    .domain(d3.extent(data, d => d.value))
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
                    .attr('font-size', fontSize);

                // create axis y
                svg.append('g')
                    .attr('transform', `translate(${left + axisYLabelWidth}, ${top})`)
                    .attr('width', axisYWidth)
                    .attr('height', g_h)
                    .append('g')
                    .attr('transform', `translate(${axisYWidth}, 0)`)
                    .attr('class', 'axis axis--y')
                    .call(d3.axisLeft(y).ticks(ticks))
                    .attr('font-size', fontSize);


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
                    .attr('class', 'label label--x')
                    .attr('text-anchor', 'middle')
                    .attr('x', g_w/2)
                    .attr('y', axisXLabelHeight/2)
                    .text(axisXLabel);

                // draw the label of the axis of y
                axisYLabelLane
                    .append('text')
                    .attr('class', 'label label--y')
                    .attr('transform', 'rotate(-90)')
                    .attr('text-anchor', 'middle')
                    .attr('y', axisYLabelWidth)
                    .attr('x', -g_h/2)
                    .text(axisYLabel);

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
    .d3-tip {
        font-family: sans-serif;
        line-height: 1;
        font-weight: bold;
        padding: 12px;
        background-color: rgba(0, 0, 0, 0.8);
        color: #fff;
        border-radius: 2px;
    }

    /* Creates a small triangle extender for the tooltip */
    .d3-tip:after {
        box-sizing: border-box;
        display: inline;
        font-size: 10px;
        width: 100%;
        line-height: 1;
        color: rgba(0, 0, 0, 0.8);
        content: "\25BC";
        position: absolute;
        text-align: center;
    }

    /* Style northward tooltips differently */
    .d3-tip.n:after {
        margin: -1px 0 0 0;
        top: 100%;
        left: 0;
    }

    .axis {
        font-family: sans-serif;
        opacity: .5;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .label {
        font-family: sans-serif;
        font-weight: 600;
    }
</style>
