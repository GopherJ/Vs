<template>
    <div :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
/* eslint-disable */
    import * as d3 from 'd3';
    import d3Tip from 'd3-tip';
    import formatTime from '../../util/formatTime';
    import getAxisXTicks from '../../util/getAxisXTicks';
    import getIntervalFromData from '../../util/getIntervalFromData';
    import mixins from '../../mixins';
    import _ from 'lodash';
    import moment from 'moment';

    // install d3-tip
    Object.assign(d3, {
        tip: d3Tip
    });

    export default {
        name: 'd3-timelion',
        mixins: [mixins],
        methods: {
            updateTimeRangeLabel(dateTimeStart, dateTimeEnd) {
                if (!d3.select(this.$el).select('.time-range-label').empty())  {
                    d3.select(this.$el).select('.time-range-label').text(() => this.timeRangeLabel(dateTimeStart, dateTimeEnd));
                }
            },
            drawTimelion() {
                // sort data by timestamp asc
                // ***** here we must use clone deep because sort will change data, if data has been changed will rerun this function *****
                // which cause a infinite loop
                const data = _.cloneDeep(this.data).sort((a, b) => a.key > b.key ? 1 : -1);

                // get container width and height
                const [w, h] = this.getElWidthHeight();

                // constants
                const {left = 0, top = 0, right = 20, bottom = 0} = this.margin,
                      {
                          fill = 'rgb(110, 173, 193)',
                          stroke = 'rgb(110, 173, 193)',
                          fontSize = 14,
                          axisXHeight = 25,
                          axisYWidth = 35,
                          axisXLabelHeight = 60,
                          axisYLabelWidth = 60,
                          axisXLabel = 'Key',
                          axisYLabel = 'Value',
                          timeRangeLabelHeight = 30,
                          barTitle = d => d.value
                      } = this.options,
                      ticksY = this.selectTicksNumY(h),
                      [paddingInner, paddingOuter] = this.selectPaddingInnerOuterX(w),
                      g_w = w - left - right - axisYLabelWidth - axisYWidth,
                      g_h = h - top - bottom - axisXHeight - axisXLabelHeight - timeRangeLabelHeight,
                      tickSizeInner = 4,
                      interval = getIntervalFromData(data, (el) => el.key);

                // create svg
                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', `${w}`)
                    .attr('height', `${h}`);

                // create g which will contain our graph
                const g = svg.append('g')
                    .attr('transform', `translate(${left + axisXLabelHeight + axisYWidth}, ${top + timeRangeLabelHeight})`)
                    .attr('width', g_w)
                    .attr('height', g_h);

                // create axis - x,y scale
                const x = d3.scaleBand().range([0, g_w]).paddingInner([paddingInner]).paddingOuter([paddingOuter]),
                      y = d3.scaleLinear().range([g_h, 0]);

                // ticks in axis--x
                x.domain(data.map(d => d.key));
                // output of rangeRound need to be minus by g_h because we have inverse axis y so that human readable
                y.domain(d3.extent(data, d => d.value)).nice();

                // calculate dateTimeStart, dateTimeEnd
                const [dateTimeStart, dateTimeEnd] = d3.extent(data.map(el => new Date(el.key)));
                // create time scale
                const timeScale = d3.scaleTime()
                    // add time range
                    .domain([dateTimeStart, dateTimeEnd])
                    // map to graph
                    .range([0, g_w]);

                // axis--x
                svg.append('g')
                    .attr('transform', `translate(${left + axisXLabelHeight + axisYWidth}, ${top + g_h + timeRangeLabelHeight})`)
                    .attr('width', g_w)
                    .attr('height', axisXHeight)
                    .append('g')
                    .attr('class', 'axis axis--x')
                    .call(d3.axisBottom(timeScale)
                            .tickValues(getAxisXTicks(fontSize, g_w, interval, tickSizeInner).map(el => timeScale.invert(el)))
                            .tickFormat(el => formatTime(el, interval)))
                    .attr('font-size', fontSize);

                // axis--y
                svg.append('g')
                    .attr('transform', `translate(${left + axisYLabelWidth}, ${top + timeRangeLabelHeight})`)
                    .attr('width', axisYLabelWidth)
                    .attr('height', g_h)
                    .append('g')
                    .attr('class', 'axis axis--y')
                    .attr('transform', `translate(${axisYWidth}, 0)`)
                    .call(d3.axisLeft(y).ticks(ticksY))
                    .attr('font-size', fontSize);

                // brushed callback
                const brushed = () => {
                    if (d3.event.selection) {
                        const [dateTimeStart, dateTimeEnd] = Array.prototype.map.call(d3.event.selection, el => timeScale.invert(el));
                        this.$emit('time-range-change', dateTimeStart, dateTimeEnd);
                    }
                };

                // brush callback
                const brush = () => {
                    if (d3.event.selection) {
                        const [dateTimeStart, dateTimeEnd] = Array.prototype.map.call(d3.event.selection, el => timeScale.invert(el));
                        this.updateTimeRangeLabel(dateTimeStart, dateTimeEnd);
                    }
                };

                // brush
                const b = svg.append('g')
                    .attr('class', 'brush');
                const brushX = d3.brushX()
                    .extent([[left + axisYLabelWidth + axisYWidth, top + timeRangeLabelHeight], [w - right, g_h + top + timeRangeLabelHeight]])
                    .on('brush', brush)
                    .on('end', brushed);

                // tooltip
                const tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0]);

                // start drawing
                g.selectAll('rect')
                    .data(data)
                    .enter()
                    .append('rect')
                    .attr('class', 'bar')
                    // transform d.key to distance
                    .attr('x', d => x(d.key))
                    .attr('y', d => y(d.value))
                    // .transition()
                    // .duration(animationDuration)
                    // .attrTween('y', d => {
                    //     const interpolate = d3.interpolate({value: g_h}, d);
                    //
                    //     return t => y(interpolate(t));
                    // })
                    // calculate by scaleBand
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

                // listen to user click
                g.on('mousedown', function(d, i) {
                        b.call(brushX);
                    });

                // create the lane to hold the label of axis y
                const axisYLabelLane = svg.append('g')
                    .attr('transform', `translate(${left}, ${top + timeRangeLabelHeight})`)
                    .attr('width', axisYLabelWidth)
                    .attr('height', g_h);

                // create the lane to hold the label of axis x
                const axisXLabelLane = svg.append('g')
                    .attr('transform', `translate(${left + axisYLabelWidth + axisYWidth}, ${top + g_h + axisXHeight + timeRangeLabelHeight})`)
                    .attr('width', g_w)
                    .attr('height', axisXLabelHeight);

                // create the label of axis x
                axisXLabelLane
                    .append('text')
                    .attr('x', g_w/2)
                    .attr('y', axisXLabelHeight/2)
                    .attr('text-anchor', 'middle')
                    .attr('fill', '#000')
                    .text(axisXLabel)
                    .attr('font-weight', 600);

                // create the label of axis y
                axisYLabelLane
                    .append('text')
                    .attr('text-anchor', 'middle')
                    .attr('transform', 'rotate(-90)')
                    .attr('y', axisYLabelWidth/2)
                    .attr('x', -g_h/2)
                    .text(axisYLabel)
                    .attr('font-weight', 600);

                // create time range label
                svg.append('g')
                    .attr('transform', `translate(${left + axisYLabelWidth + axisYWidth}, ${top})`)
                    .attr('width', g_w)
                    .attr('height', timeRangeLabelHeight)
                    .append('text')
                    .attr('class', 'time-range-label')
                    .attr('x', g_w/2)
                    .attr('y', timeRangeLabelHeight/2)
                    .attr('fill', '#000')
                    .attr('font-weight', 600)
                    .attr('opacity', '0.5')
                    .attr('text-anchor', 'middle')
                    .text(() => this.timeRangeLabel(dateTimeStart, dateTimeEnd));

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
                        .attr('y2', g_h);
                }
            },
            timeRangeLabel(dateTimeStart, dateTimeEnd) {
                const FORMAT = 'YYYY-MM-DD HH:mm:ss';

                return `From ${moment(dateTimeStart).format(FORMAT)} To ${moment(dateTimeEnd).format(FORMAT)}`;
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawTimelion();
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
        opacity: .75;
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
</style>
