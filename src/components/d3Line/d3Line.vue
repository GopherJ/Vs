<template>
    <div :style="{ 'width' : width, 'height' : height}"></div>
</template>

<script>
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
        props: {
            data: {
                type: Array,
                required: true
            },
            options: {
                type: Object,
                default: () => ({
                    stroke: 'teal',
                    strokeWidth: 2,
                    fontSize: 14,
                    keyFunc: d => d.key,
                    valueFunc: d => d.value,
                    label: 'value',
                    circleRadius: 10,
                    circleColor: 'red'
                })
            }
        },
        methods: {
            drawLine() {
                // no data
                if (this.data.length === 0) {
                    return;
                }

                // constants
                const [w, h] = this.getElWidthHeight();
                if (!w || !h) {
                    throw new Error('invalid width or height');
                }

                // constants
                const data = this.data,
                      {left, top, right, bottom} = this.margin,
                      g_w = w - left - right,
                      g_h = h - top - bottom,
                      ticks = this.selectTicksNumY(g_h),
                      {stroke, strokeWidth, keyFunc, valueFunc, fontSize, label, circleRadius, circleColor} = this.options;

                // create scale x
                const x = d3.scalePoint()
                    .domain(data.map(keyFunc))
                    .range([0, g_w]);

                // create scale y
                const y = d3.scaleLinear()
                    .domain([0, d3.max(data, valueFunc)])
                    .range([g_h, 0]);

                // line generator
                const lineGen = d3.line()
                    .x(d => x(d.key))
                    .y(d => y(d.value));

                // create svg
                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', `${w}`)
                    .attr('height', `${h}`);

                // create g to contain our graph
                const g = svg.append('g')
                    .attr('transform', `translate(${left}, ${top})`)
                    .attr('width', `${g_w}`)
                    .attr('height', `${g_h}`);

                // crate axis x
                const axisX = g.append('g')
                    .attr('transform', `translate(0, ${g_h})`)
                    .attr('class', 'axis axis--x')
                    .call(d3.axisBottom(x))
                    .attr('font-size', fontSize);

                // create axis y
                g.append('g')
                    .attr('class', 'axis axis--y')
                    .call(d3.axisLeft(y).ticks(ticks))
                    .attr('font-size', fontSize)
                    .append('text')
                    .attr('fill', '#000')
                    .attr('y', 6)
                    .attr('dy', '0.71em')
                    .attr('transform', 'rotate(-90)')
                    .attr('text-anchor', 'end')
                    .text(label);

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
                g.call(tip);

                g.selectAll('circle')
                    .data(data)
                    .enter()
                    .append('circle')
                    .attr('r', circleRadius)
                    .attr('cx', d => x(d.key))
                    .attr('cy', d => y(d.value))
                    .attr('fill-opacity', '0.5')
                    .attr('fill', circleColor)
                    .on('mouseover', function(d, i) {
                        tip.html(() => d.value);
                        tip.show();
                    })
                    .on('mouseout', function(d, i) {
                        tip.hide();
                    });
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawLine();
            },
            onResize() {
                this.safeDraw();
            }
        },
        watch: {
            data: {
                deep: true,
                handler(n) {
                    this.safeDraw();
                }
            },
            options: {
                deep: true,
                handler(n) {
                    this.safeDraw()
                }
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
</style>
