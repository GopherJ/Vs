<template>
    <div :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
/* eslint-disable */
    import * as d3 from 'd3';
    import d3Tip from 'd3-tip';
    import mixins from '../../mixins';

    // install d3-tip
    Object.assign(d3, {
        tip: d3Tip
    });

    export default {
        name: 'd3-pie',
        mixins: [mixins],
        props: {
            data: {
                type: Array,
                required: true
            },
            options: {
                type: Object,
                default: () => ({
                    innerRadius: 20,
                    cornerRadius: 10,
                    padAngle: 0.01,
                    arcTitle: d => d.data.value,
                    arcLabel: d => d.data.key
                })
            }
        },
        methods: {
            drawPie() {
                const data = this.data;
                // no data
                if (data.length === 0) {
                    return;
                }

                const [w, h] = this.getElWidthHeight();

                // width, height must exist
                if (!w || !h) {
                    throw new Error('invalid width or height');
                }

                // get all data
                const {left, top, right, bottom} = this.margin,
                     g_w = w - left - right,
                     g_h = h -top - bottom,
                     outerRadius = Math.min(g_w/2, g_h/2),
                     {innerRadius, cornerRadius, padAngle, arcTitle, arcLabel} = this.options;

                if (innerRadius > outerRadius) {
                    throw new Error('invalid innerRadius');
                }

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

                // prepare data
                const pie = d3.pie()
                    .sort(null)
                    .value(d => d.value);

                // create arc
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
                    .append('g')
                    .attr('class', 'arc');

                arc.append('path')
                    .transition()
                    .delay((d, i) => 100 * i)
                    .attr('d', path)
                    .attr('fill', (d, i) => color(d.data.value));

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

                arc.append('text')
                    .attr('class', 'label')
                    .attr('text-anchor', 'middle')
                    .attr('opacity', '.5')
                    .attr('transform', (d, i) => `translate(${label.centroid(d)})`)
                    .transition()
                    .delay((d,i) => 100 * i)
                    .text(arcLabel);
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawPie();
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
                    this.safeDraw();
                }
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

    .arc {
        font-family: sans-serif;
    }

</style>
