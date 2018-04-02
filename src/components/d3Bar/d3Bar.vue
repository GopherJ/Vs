<template>
    <div :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
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
        props: {
            data: {
                type: Array,
                required: true
            },
            options: {
                type: Object,
                default: () => ({
                    fill: 'rgb(110, 173, 193)',
                    stroke: 'rgb(110, 173, 193)',
                    fontSize: 14,
                    isVertical: false,
                    valueFunc: d => d.value,
                    keyFunc: d => d.key,
                    label: 'value'
                })
            }
        },
        methods: {
            drawBar() {
                // no data
                if (this.data.length === 0) {
                    return;
                }

                // container width and height
                const [w, h] = this.getElWidthHeight();
                if (!w || !h) {
                    throw new Error('invalid width or height');
                }

                // constants
                const data = this.data,
                    {left, right, top, bottom} = this.margin,
                    g_w = w - left - right,
                    g_h = h - top - bottom,
                    {fill, stroke, fontSize, isVertical, valueFunc, keyFunc, label} = this.options;

                // create svg
                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', `${w}`)
                    .attr('height', `${h}`);

                // create g to contain our graph
                const g = svg
                    .append('g')
                    .attr('width', `${g_w}`)
                    .attr('height', `${g_h}`)
                    .attr('transform', `translate(${left}, ${top})`);

                // tooltip
                const tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0]);
                g.call(tip);

                // initialisation x, y scales
                let x, y, axisX, axisY, ticks, paddingInner, paddingOuter;

                // horizontal bar
                if (!isVertical) {
                    ticks = this.selectTicksNumY(g_h);
                    [paddingInner, paddingOuter] = this.selectPaddingInnerOuterX(g_w);
                    x = d3.scaleBand().rangeRound([0, g_w]).paddingInner([paddingInner]).paddingOuter([paddingOuter]);
                    y = d3.scaleLinear().rangeRound([g_h, 0]);
                    x.domain(data.map(keyFunc));
                    y.domain([0, d3.max(data, valueFunc)]);

                    // draw x
                    axisX = g.append('g')
                        .attr('class', 'axis axis--x')
                        .attr('transform', `translate(0,${g_h})`)
                        .call(d3.axisBottom(x))
                        .attr('font-size', fontSize);

                    axisY = g.append('g')
                        .attr('class', 'axis axis--y')
                        .call(d3.axisLeft(y).ticks(ticks))
                        .attr('font-size', fontSize)
                        .append('text')
                        .attr('transform', 'rotate(-90)')
                        .attr('y', 6)
                        .attr('dy', '0.71em')
                        .attr('text-anchor', 'end')
                        .text(label);

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
                            tip.html(() => d.value);
                            tip.show();
                        })
                        .on('mouseout', function(d, i) {
                            tip.hide();
                        });
                }

                // vertical bar
                else {
                        ticks = this.selectTicksNumX(g_w);
                        [paddingInner, paddingOuter] = this.selectPaddingInnerOuterY(g_h);
                        y = d3.scaleBand().rangeRound([0, g_h]).paddingInner([paddingInner]).paddingOuter([paddingOuter]);
                        x = d3.scaleLinear().rangeRound([0, g_w]);
                        y.domain(data.map(el => el.key));
                        x.domain([0, d3.max(data, el => el.value)]);


                    // draw x
                    axisX = g.append('g')
                        .attr('class', 'axis axis--x')
                        .call(d3.axisTop(x).ticks(ticks))
                        .attr('font-size', fontSize)
                        .append('text')
                        .attr('x', g_w)
                        .attr('text-anchor', 'end')
                        .text(label);

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
                        .attr('fill', 'rgb(110, 173, 193)')
                        .attr('stroke', 'rgb(110, 173, 193)')
                        .on('mouseover', function(d, i) {
                            tip.html(() => d.value);
                            tip.show();
                        })
                        .on('mouseout', function(d, i) {
                            tip.hide();
                        });
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

    .axis--x path {
        /*stroke-width: 2;*/
        /*display: none;*/
    }
    .axis--y path {
        /*stroke-width: 2;*/
        /*display: none;*/
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
</style>
