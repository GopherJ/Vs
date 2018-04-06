<template>
    <div :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
/* eslint-disable */
    import * as d3 from 'd3';
    import mixins from '../../mixins';
    import d3Tip from 'd3-tip';

    // load d3-tip
    Object.assign(d3, {
        tip: d3Tip
    });

    export default {
        name: 'd3-bar',
        mixins: [mixins],
        methods: {
            drawBar() {
                // container width and height
                const [w, h] = this.getElWidthHeight();

                // constants
                const data = this.data,
                      {   fill = 'rgb(110, 173, 193)',
                          stroke = 'rgb(110, 173, 193)',
                          fontSize = 14,
                          isVertical = false,
                          barTitle = d => d.value,
                          axisYLabel = 'Value',
                          axisXLabel = 'Key',
                          axisXLaneHeight = 30,
                      } = this.options,
                      { axisYLaneWidth = isVertical ? 60 : 30 } = this.options,
                      {left = isVertical ? 60 : 30, right = 30, top = 30, bottom = 30} = this.margin,
                      g_w = w - left - right - axisYLaneWidth,
                      g_h = h - top - bottom - axisXLaneHeight;

                // create svg
                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', `${w}`)
                    .attr('height', `${h}`);

                // tooltip
                const tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0]);

                // initialisation x, y scales
                let x, y, axisX, axisY, ticks, paddingInner, paddingOuter;

                // horizontal bar
                if (!isVertical) {
                    ticks = this.selectTicksNumY(g_h);
                    [paddingInner, paddingOuter] = this.selectPaddingInnerOuterX(g_w);
                    x = d3.scaleBand().rangeRound([0, g_w]).paddingInner([paddingInner]).paddingOuter([paddingOuter]);
                    y = d3.scaleLinear().rangeRound([g_h, 0]);
                    x.domain(data.map(d => d.key));
                    y.domain([0, d3.max(data, d => d.value)]);

                    // create g to contain our graph
                    const g = svg
                        .append('g')
                        .attr('transform', `translate(${left + axisYLaneWidth}, ${top})`)
                        .attr('width', `${g_w}`)
                        .attr('height', `${g_h}`);

                    const axisXLane = svg
                        .append('g')
                        .attr('transform', `translate(${left + axisYLaneWidth}, ${h - bottom - axisXLaneHeight})`)
                        .attr('width', g_w)
                        .attr('height', axisXLaneHeight);

                    const axisYLane = svg
                        .append('g')
                        .attr('transform', `translate(${left}, ${top})`)
                        .attr('width', axisYLaneWidth)
                        .attr('height', g_h);

                    // draw x
                    axisX = g.append('g')
                        .attr('class', 'axis axis--x')
                        .attr('transform', `translate(0,${g_h})`)
                        .call(d3.axisBottom(x))
                        .attr('font-size', fontSize);

                    axisY = g.append('g')
                        .attr('class', 'axis axis--y')
                        .call(d3.axisLeft(y).ticks(ticks))
                        .attr('font-size', fontSize);


                    // start drawing
                    g.selectAll('.bar')
                        .data(data)
                        .enter()
                        .append('rect')
                        .attr('class', 'bar')
                        .attr('x', d => x(d.key))
                        .attr('y', d => y(d.value))
                        .attr('width', x.bandwidth())
                        .attr('height', d => g_h - y(d.value))
                        .attr('fill', fill)
                        .attr('stroke', stroke)
                        .on('mouseover', function(d, i) {
                            g.call(tip);
                            tip.html(barTitle(d));
                            tip.show();
                        })
                        .on('mouseout', function(d, i) {
                            tip.hide();
                            d3.selectAll('.d3-tip').remove();
                        });

                    axisXLane
                        .append('text')
                        .attr('class', 'label label--x')
                        .attr('x', g_w/2)
                        .attr('y', axisXLaneHeight)
                        .attr('text-anchor', 'middle')
                        .attr('fill', '#000')
                        .text(axisXLabel);

                    axisYLane
                        .append('text')
                        .attr('class', 'label label--y')
                        .attr('y', 0)
                        .attr('x', -g_h/2)
                        .attr('text-anchor', 'middle')
                        .attr('fill', '#000')
                        .attr('transform', 'rotate(-90)')
                        .text(axisYLabel);
                }

                // vertical bar
                else {
                    ticks = this.selectTicksNumX(g_w);
                    [paddingInner, paddingOuter] = this.selectPaddingInnerOuterY(g_h);
                    y = d3.scaleBand().rangeRound([0, g_h]).paddingInner([paddingInner]).paddingOuter([paddingOuter]);
                    x = d3.scaleLinear().rangeRound([0, g_w]);
                    y.domain(data.map(el => el.key));
                    x.domain([0, d3.max(data, el => el.value)]);

                    // create g to contain our graph
                    const g = svg
                        .append('g')
                        .attr('transform', `translate(${left + axisYLaneWidth}, ${top + axisXLaneHeight})`)
                        .attr('width', `${g_w}`)
                        .attr('height', `${g_h}`);

                    const axisXLane = svg
                        .append('g')
                        .attr('transform', `translate(${left + axisYLaneWidth}, ${top})`)
                        .attr('width', g_w)
                        .attr('height', axisXLaneHeight);

                    const axisYLane = svg
                        .append('g')
                        .attr('transform', `translate(${left}, ${top})`)
                        .attr('width', axisYLaneWidth)
                        .attr('height', g_h);


                    // draw x
                    axisX = g.append('g')
                        .attr('class', 'axis axis--x')
                        .call(d3.axisTop(x).ticks(ticks))
                        .attr('font-size', fontSize);

                    // draw y
                    axisY = g.append('g')
                        .attr('class', 'axis axis--y')
                        .call(d3.axisLeft(y))
                        .attr('font-size', fontSize);

                    // start drawing
                    g.selectAll('.bar')
                        .data(data)
                        .enter()
                        .append('rect')
                        .attr('class', 'bar')
                        .attr('y', d => y(d.key))
                        .attr('height', y.bandwidth())
                        .attr('width', d => x(d.value))
                        .attr('fill', fill)
                        .attr('stroke', stroke)
                        .on('mouseover', function(d, i) {
                            g.call(tip);
                            tip.html(barTitle(d));
                            tip.show();
                        })
                        .on('mouseout', function(d, i) {
                            tip.hide();
                            d3.selectAll('.d3-tip').remove();
                        });

                    // draw label
                    axisXLane
                        .append('text')
                        .attr('class', 'label label--x')
                        .attr('x', g_w/2)
                        .attr('y', 0)
                        .attr('text-anchor', 'middle')
                        .text(axisYLabel);

                    axisYLane
                        .append('text')
                        .attr('class', 'label label--y')
                        .attr('y', 0)
                        .attr('x', -g_h/2)
                        .attr('text-anchor', 'middle')
                        .attr('fill', '#000')
                        .attr('transform', 'rotate(-90)')
                        .text(axisXLabel);
                }

            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawBar();
            },
            onResize() {
                this.safeDraw();
            }
        }
    }
</script>

<style>
    .axis {
        font-family: sans-serif;
        opacity: .5;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    rect, .bar {
        shape-rendering: crispEdges;
    }

    .extent {
        fill-opacity: .125;
        shape-rendering: crispEdges;
    }

    .d3-tip {
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

    .bar:hover {
        cursor: pointer;
    }

    .label {
        font-weight: 600;
        font-family: sans-serif;
    }
</style>
