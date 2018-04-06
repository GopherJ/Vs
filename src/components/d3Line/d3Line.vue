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
                // constants
                const [w, h] = this.getElWidthHeight();

                // constants
                const data = this.data,
                      {left = 30, top = 30, right = 30, bottom = 30} = this.margin,
                      ticks = this.selectTicksNumY(g_h),
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
                          axisXLaneHeight = 30,
                          axisYLaneWidth = 30
                      } = this.options,
                      g_w = w - left - right - axisYLaneWidth,
                      g_h = h - top - bottom - axisXLaneHeight;

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
                    .attr('transform', `translate(${left + axisYLaneWidth}, ${top})`)
                    .attr('width', `${g_w}`)
                    .attr('height', `${g_h}`);

                const axisXLane = svg.append('g')
                    .attr('transform', `translate(${left + axisYLaneWidth}, ${top + g_h})`)
                    .attr('width', g_w)
                    .attr('height', axisXLaneHeight);

                const axisYLane = svg.append('g')
                    .attr('transform', `translate(${left}, ${top})`)
                    .attr('width', axisYLaneWidth)
                    .attr('height', g_h);

                // crate axis x
                const axisX = g.append('g')
                    .attr('transform', `translate(0, ${g_h})`)
                    .attr('class', 'axis axis--x')
                    .call(d3.axisBottom(x))
                    .attr('font-size', fontSize);

                // create axis y
                const axisY = g.append('g')
                    .attr('class', 'axis axis--y')
                    .call(d3.axisLeft(y).ticks(ticks))
                    .attr('font-size', fontSize);

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

                axisXLane
                    .append('text')
                    .attr('class', 'label label--x')
                    .attr('text-anchor', 'middle')
                    .attr('x', g_w/2)
                    .attr('y', axisXLaneHeight)
                    .text(axisXLabel);

                axisYLane
                    .append('text')
                    .attr('class', 'label label--y')
                    .attr('transform', 'rotate(-90)')
                    .attr('text-anchor', 'middle')
                    .attr('y', 0)
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
