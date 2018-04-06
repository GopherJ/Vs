<template>
    <div :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
/* eslint-disable */
    import * as d3 from 'd3';
    import d3Tip from 'd3-tip'
    import formatTime from '../../util/formatTime';
    import getAxisXTicks from '../../util/getAxisXTicks';
    import getIntervalFromData from '../../util/getIntervalFromData';
    import mixins from '../../mixins';

    // install d3-tip
    Object.assign(d3, {
        tip: d3Tip
    });

    export default {
        name: 'd3-timelion',
        mixins: [mixins],
        props: {
            data: {
                type: Array,
                required: true
            },
            options: {
                type: Object,
                default: () => ({})
            }
        },
        methods: {
            drawTimelion() {
                 // no data
                if (this.data.length === 0) {
                    return;
                }

                // sort data by timestamp asc
                const data = this.data.sort((a, b) => a.key > b.key ? 1 : -1);

                // get container width and height
                const [w, h] = this.getElWidthHeight();
                // container width, height must exist so that we can draw svg
                if (!w || !h) {
                    throw new Error('invalid width or height');
                }

                // constants
                const {left = 30, top = 30, right = 30, bottom = 30} = this.margin,
                      {
                          fill = 'rgb(110, 173, 193)',
                          stroke = 'rgb(110, 173, 193)',
                          fontSize = 14,
                          labelY = 'count'
                      } = this.options,
                      ticksY = this.selectTicksNumY(h),
                      [paddingInner, paddingOuter] = this.selectPaddingInnerOuterX(w),
                      g_w = w - left - right,
                      g_h = h - top - bottom,
                      tickSizeInner = 4,
                      interval = getIntervalFromData(data, (el) => el.key);

                // create svg
                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', `${w}`)
                    .attr('height', `${h}`);

                // create g which will contain our graph
                const g = svg.append('g')
                    .attr('width', g_w)
                    .attr('height', g_h)
                    // move g to the middle of svg
                    .attr('transform', `translate(${left},${top})`);

                // create axis - x,y scale
                const x = d3.scaleBand().rangeRound([0, g_w]).paddingInner([paddingInner]).paddingOuter([paddingOuter]),
                      y = d3.scaleLinear().rangeRound([g_h, 0]);
                // ticks in axis--x
                x.domain(data.map(d => d.key));
                // output of rangeRound need to be minus by g_h beacause we have inverse axis y so that human readable
                y.domain([0, d3.max(data, d => d.value)]);

                // calculate dateTimeStart, dateTimeEnd
                const [dateTimeStart, dateTimeEnd] = d3.extent(data.map(el => new Date(el.key)));
                // create time scale
                const timeScale = d3.scaleTime()
                    // add time range
                    .domain([dateTimeStart, dateTimeEnd])
                    // map to graph
                    .range([0, g_w]);

                // axis--x
                g.append('g')
                    .attr('class', 'axis axis--x')
                    .attr('transform', 'translate(0,' + g_h + ')')
                    .call(
                        d3.axisBottom(timeScale)
                            .tickValues(getAxisXTicks(fontSize, g_w, interval, tickSizeInner).map(el => timeScale.invert(el)))
                            .tickFormat(el => formatTime(el, interval))
                    )
                    .attr('font-size', fontSize);

                // axis--y
                g.append('g')
                    .attr('class', 'axis axis--y')
                    .call(d3.axisLeft(y).ticks(ticksY))
                    .attr('font-size', fontSize)
                    .append('text')
                    .attr('fill', '#000')
                    .attr('transform', 'rotate(-90)')
                    .attr('y', 6)
                    .attr('dy', '0.71em')
                    .attr('text-anchor', 'end')
                    .text(labelY);

                // brushed callback
                const brushed = () => {
                    if (d3.event.selection) {
                        const [dateTimeStart, dateTimeEnd] = Array.prototype.map.call(d3.event.selection, el => timeScale.invert(el));
                        this.$emit('timeRangeChange', dateTimeStart, dateTimeEnd);
                    }
                };

                // brush
                const b = svg.append('g')
                    .attr('class', 'brush');
                const brushX = d3.brushX()
                    .extent([[left, top], [g_w + left, g_h + top]])
                    .on('end', brushed);

                // tooltip
                const tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0]);
                g.call(tip);

                // start drawing
                g.selectAll('rect')
                    .data(data)
                    .enter()
                    .append('rect')
                    .attr('class', 'bar')
                    // transform d.key to distance
                    .attr('x', d => x(d.key))
                    .attr('y', d => y(d.value))
                    // calculate by scaleBand
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

                g
                    .on('mousedown', function(d, i) {
                        b.call(brushX);
                    });

                // draw reference line to represent now
                let now = new Date();
                if (dateTimeEnd >= now) {
                    g.append('line')
                        .attr('stroke', 'red')
                        .attr('opacity', .3)
                        .attr('stroke-width', 2)
                        .attr('x1', timeScale(now))
                        .attr('y1', 0)
                        .attr('x2', timeScale(now))
                        .attr('y2', g_h)
                }
            },
            safeDrawTimelion() {
                this.ifExistsSvgThenRemove();
                this.drawTimelion();
            },
            onResize() {
                this.safeDrawTimelion();
            }
        },
        watch: {
           data: {
               deep: true,
               handler(n) {
                   this.safeDrawTimelion();
               }
           },
           width: {
              deep: false,
              handler(n) {
                   this.safeDrawTimelion();
              }
           },
           height: {
              deep: false,
              handler(n) {
                   this.safeDrawTimelion();
              }
           }
        },
        mounted() {
            this.safeDrawTimelion();
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
