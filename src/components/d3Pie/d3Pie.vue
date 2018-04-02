<template>
    <div :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
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
                    padAngle: Math.PI/100,
                    valueFunc: (d) => d.value,
                    keyFunc: (d) => d.data.key
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
                     {innerRadius, cornerRadius, padAngle, valueFunc, keyFunc} = this.options;

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
                g.call(tip);

                // circle center where we will begin to draw our graph
                const gc = g.append('g')
                    .attr('transform', `translate(${g_w/2},${g_h/2})`);

                // create color set
                const color = d3.scaleSequential()
                    .domain(d3.extent(data.map(valueFunc)))
                    .interpolator(d3.interpolateWarm);

                // prepare data
                const pie = d3.pie()
                    .sort(null)
                    .value(valueFunc);

                // create arc
                const path = d3.arc()
                    .innerRadius(innerRadius)
                    .outerRadius(outerRadius)
                    .cornerRadius(cornerRadius)
                    .padAngle(padAngle);

                // crate label
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
                    .attr('d', path)
                    .attr('fill', (d, i) => color(d.data.value))
                    .on('mouseover', function(d, i){
                        tip.html(() => d.data.value);
                        tip.show();
                    })
                    .on('mouseout', function(d, i) {
                        tip.hide();
                    });

                arc.append('text')
                    .attr('transform', (d, i) => `translate(${label.centroid(d)})`)
                    .text(keyFunc);
            },
            safeDrawPie() {
                this.ifExistsSvgThenRemove();
                this.drawPie();
            },
            onResize() {
               this.safeDrawPie();
            }
        },
        watch: {
            width: {
                deep: false,
                handler(n) {
                    this.safeDrawPie();
                }
            },
            height: {
                deep: false,
                handler(n) {
                    this.safeDrawPie();
                }
            },
            options: {
                deep: true,
                handler(n) {
                    this.safeDrawPie();
                }
            }
        },
        mounted() {
            this.safeDrawPie();
        }
    }
</script>

<style>

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
</style>
