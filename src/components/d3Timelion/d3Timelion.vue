<template>
    <div :style="{ 'width' : width, 'height' : height }" class="d3-time-lion"></div>
</template>

<script>
    /* eslint-disable */
    import * as d3 from 'd3';
    import tip from 'd3-tip';
    import formatTime from '../../util/formatTime';
    import getAxisXTicks from '../../util/getAxisXTicks';
    import getIntervalAndSortedData from '../../util/getIntervalAndSortedData';
    import getIntervalString from '../../util/getIntervalString';
    import mixins from '../../mixins';
    import _ from 'lodash';
    import moment from 'moment';
    import INTERVAL from '../../util/interval';

    // load tip
    Object.assign(d3, {
        tip
    });

    // template
    const tpl = `
                <option value='Auto'>Auto</option>
                <option value="${INTERVAL.Millisecond}">Millisecond</option>
                <option value="${INTERVAL.Second}">Second</option>
                <option value="${INTERVAL.Minute}">Minute</option>
                <option value="${INTERVAL.Hour}">Hourly</option>
                <option value="${INTERVAL.Day}">Daily</option>
                <option value="${INTERVAL.Week}">Weekly</option>
                <option value="${INTERVAL.Month}">Monthly</option>
                <option value="${INTERVAL.Year}">Yearly</option>`;

    export default {
        name: 'd3-timelion',
        data() {
            return {
                interval: 'Auto'
            }
        },
        mixins: [mixins],
        methods: {
            updateTimeRangeLabel(dateTimeStart, dateTimeEnd) {
                d3.select(this.$el)
                    .select('.label--time')
                    .text(() => this.getTimeRangeLabel(dateTimeStart, dateTimeEnd));
            },
            drawTimelion() {
                // sort data by timestamp asc
                // ***** here we must use clone deep because sort will change data, if data has been changed will rerun this function *****
                // which cause an infinite loop
                const {interval, data} = getIntervalAndSortedData(_.cloneDeep(this.data));
                const interval_string = getIntervalString(interval);
                const self = this;

                // get container width and height
                const [w, h] = this.getElWidthHeight(),
                    {left = 0, top = 0, right = 20, bottom = 0} = this.margin,
                    {
                        // bar config
                        fill = '#6eadc1',
                        stroke = '#6eadc1',
                        fillOpacity = 0.6,
                        strokeOpacity = 1,

                        // axis config
                        axisXHeight = 25,
                        axisYWidth = 35,

                        // axis label config
                        axisXLabel = 'Key',
                        axisYLabel = 'Value',
                        axisFontSize = 12,
                        axisLabelOpacity = 1,
                        axisLabelFontWeight = 600,
                        axisXLabelHeight = 60,
                        axisYLabelWidth = 60,

                        // time label config
                        timeRangeLabelHeight = 40,
                        timeRangeLabelFontSize = 12,
                        timeRangeLabelOpacity = 0.5,
                        timeRangeLabelFontWeight = 400,

                        // tooltip config
                        barTitle = d => `${new Date(d.key)}<br>${d.value}`
                    } = this.options,
                    ticksY = this.selectTicksNumY(h),
                    [paddingInner, paddingOuter] = this.selectPaddingInnerOuterX(w),
                    g_w = w - left - right - axisYLabelWidth - axisYWidth,
                    g_h = h - top - bottom - axisXHeight - axisXLabelHeight - timeRangeLabelHeight,
                    isMobile = g_w <= 560,
                    tickSizeInner = 2,
                    tickSizeOuter = 16;

                // create svg
                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', `${w}`)
                    .attr('height', `${h}`);

                // clipPath
                svg.append('defs')
                    .append('clipPath')
                    .attr('id', 'clip-lion')
                    .append('rect')
                    .attr('width', w)
                    .attr('height', h);

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
                // forget the situation that we have minus data
                y.domain([0, d3.max(data, d => d.value)]).nice();

                // calculate dateTimeStart, dateTimeEnd
                const [dateTimeStart, dateTimeEnd] = d3.extent(data.map(el => new Date(el.key)));

                // create time scale
                const timeScale = d3.scaleTime()
                // add time range
                    .domain([dateTimeStart, dateTimeEnd])
                    // map to graph
                    .range([0, g_w]);

                // axis--x
                const axisX = svg.append('g')
                    .attr('transform', `translate(${left + axisXLabelHeight + axisYWidth}, ${top + g_h + timeRangeLabelHeight})`)
                    .attr('width', g_w)
                    .attr('height', axisXHeight)
                    .append('g')
                    .attr('class', 'axis axis--x');

                if (data.length === 1) {
                    axisX.call(d3.axisBottom(x)
                        .tickFormat(el => formatTime(el, interval_string)))
                        .attr('font-size', axisFontSize);
                } else {
                    axisX
                        // .call(d3.axisBottom(timeScale))
                        .call(d3.axisBottom(timeScale)
                            .tickValues(getAxisXTicks(axisFontSize, g_w, interval_string, tickSizeInner, tickSizeOuter).map(el => timeScale.invert(el)))
                            .tickFormat(el => formatTime(el, interval_string)))
                        .attr('font-size', axisFontSize);
                }

                // axis--y
                svg.append('g')
                    .attr('transform', `translate(${left + axisYLabelWidth}, ${top + timeRangeLabelHeight})`)
                    .attr('width', axisYLabelWidth)
                    .attr('height', g_h)
                    .append('g')
                    .attr('class', 'axis axis--y')
                    .attr('transform', `translate(${axisYWidth}, 0)`)
                    .call(d3.axisLeft(y).ticks(ticksY))
                    .attr('font-size', axisFontSize);

                // brush
                const b = svg.append('g')
                    .attr('class', 'brush');
                const brushX = d3.brushX()
                    .extent([[left + axisYLabelWidth + axisYWidth, top + timeRangeLabelHeight], [w - right, g_h + top + timeRangeLabelHeight]])
                    .on('brush', brushing)
                    .on('end', brushed);

                // brushed callback
                function brushed() {
                    if (d3.event.selection) {
                        const [dateTimeStart, dateTimeEnd] = Array.prototype.map.call(d3.event.selection, el => timeScale.invert(el - left - axisYWidth - axisYLabelWidth));
                        self.$emit('range-updated', dateTimeStart, dateTimeEnd);

                        // restore brush dom tree
                        d3.select('.d3-time-lion .brush').selectAll('*').remove();
                        d3.select('.d3-time-lion .brush').attr('fill', null).attr('pointer-events', null);

                        // https://github.com/d3/d3-brush/issues/10
                        // clear brush state, d3v4 state also brush on selection
                        brushX.move(b, null);
                    }
                }

                // brush callback
                function brushing() {
                    if (d3.event.selection) {
                        // selection is b so that the selection.x and selection.y is coordinates in svg
                        const [dateTimeStart, dateTimeEnd] = Array.prototype.map.call(d3.event.selection, el => timeScale.invert(el - left - axisYWidth - axisYLabelWidth));
                        self.updateTimeRangeLabel(dateTimeStart, dateTimeEnd);
                    }
                }

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

                    // calculate by scaleBand
                    .attr('width', x.bandwidth())
                    .attr('height', d => g_h - y(d.value))
                    .attr('fill', fill)
                    .attr('fill-opacity', fillOpacity)
                    .attr('stroke', stroke)
                    .attr('stroke-opacity', strokeOpacity)
                    .on('mouseover', function (d, i) {
                        g.call(tip);
                        tip.html(barTitle(d));
                        tip.show();
                    })
                    .on('mouseout', function (d, i) {
                        tip.hide();
                        d3.selectAll('.d3-tip').remove();
                    });

                // when cursor is out of rect.bar, then set the cursor to crosshair
                svg.on('mousemove', function (d, i) {
                    const [cx, cy] = d3.mouse(g.node());

                    // check if cursor is in g and check if cursor is moving on svg
                    // if cursor is moving in g and not on bar<rect> then set cursor style as crosshair
                    if (cx >= 0 && cx <= g_w && cy >= 0 && cy <= g_h && d3.event.target.nodeName === 'svg') {
                        svg.attr('cursor', 'crosshair');
                    }

                    else {
                        svg.attr('cursor', 'auto');
                    }
                });

                // listen to user click
                svg.on('mousedown', function (d, i) {
                    const [cx, cy] = d3.mouse(g.node());

                    // check if cursor is in g
                    if (cx >= 0 && cx <= g_w && cy >= 0 && cy <= g_h) {
                        b.call(brushX);
                    }
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
                    .attr('x', g_w / 2)
                    .attr('y', axisXLabelHeight / 2)
                    .attr('text-anchor', 'middle')
                    .attr('fill', '#000')
                    .text(axisXLabel)
                    .attr('opacity', axisLabelOpacity)
                    .attr('font-weight', axisLabelFontWeight);

                // create the label of axis y
                axisYLabelLane
                    .append('text')
                    .attr('text-anchor', 'middle')
                    .attr('transform', 'rotate(-90)')
                    .attr('y', axisYLabelWidth / 2)
                    .attr('x', -g_h / 2)
                    .text(axisYLabel)
                    .attr('opacity', axisLabelOpacity)
                    .attr('font-weight', axisLabelFontWeight);


                // create time range label lane
                const timeRangeLabelLane = svg.append('g')
                    .attr('transform', `translate(${left + axisYLabelWidth + axisYWidth}, ${top})`)
                    .attr('width', g_w)
                    .attr('height', timeRangeLabelHeight);


                // create time range label
                const timeRangeLabel = timeRangeLabelLane.append('text')
                    .attr('class', 'label--time')
                    .attr('x', g_w / 2)
                    .attr('y', timeRangeLabelHeight / 2)
                    // .attr('dy', '0.35em')
                    .attr('fill', '#000')
                    .attr('font-size', timeRangeLabelFontSize)
                    .attr('font-weight', timeRangeLabelFontWeight)
                    .attr('opacity', timeRangeLabelOpacity)
                    .attr('text-anchor', 'middle')
                    .attr('clip-path', 'url(#clip-lion)')
                    .text(() => this.getTimeRangeLabel(dateTimeStart, dateTimeEnd));

                // timeRangeLabel pos
                const timeRangeLabelPos = timeRangeLabel.node().getBBox();

                const FOREIGN_OBJECT = timeRangeLabelLane
                    .append('foreignObject');

                if (!isMobile) {
                    // not mobile
                    // draw interval select
                    FOREIGN_OBJECT
                        .attr('transform', `translate(${timeRangeLabelPos.x + timeRangeLabelPos.width}, ${top})`)
                        .attr('width', g_w - timeRangeLabelPos.x - timeRangeLabelPos.width);

                } else {
                    // mobile
                    FOREIGN_OBJECT
                        .attr('transform', `translate(${timeRangeLabelPos.x + timeRangeLabelPos.width / 2}, ${top + timeRangeLabelHeight})`)
                        .attr('width', g_w - timeRangeLabelPos.x - timeRangeLabelPos.width / 2);

                }

                // draw select box
                FOREIGN_OBJECT
                        .attr('height', timeRangeLabelHeight)
                        .append('xhtml:select')
                        .attr('class', 'form-control')
                        .attr('id', 'interval')
                        .on('change', () => {
                            const targetVal = d3.event.target.value,
                                  val = targetVal === 'Auto' ? targetVal : Number.parseInt(targetVal, 10);

                            this.interval = val;

                            this.$emit('interval-updated', val);
                        })
                        .html(tpl)
                        .property('value', this.interval);

                // draw reference line to represent now
                const now = new Date();
                if (dateTimeEnd >= now) {
                    // draw reference
                    g.append('line')
                        .attr('stroke', '#c80000')
                        .attr('opacity', .3)
                        .attr('stroke-width', 2)
                        .attr('x1', timeScale(now))
                        .attr('y1', 0)
                        .attr('x2', timeScale(now))
                        .attr('y2', g_h);

                    // draw rect
                    g.append('rect')
                        .attr('transform', `translate(${timeScale(now)},0)`)
                        .attr('width', g_w - timeScale(now))
                        .attr('height', g_h)
                        .attr('fill', '#000')
                        .attr('fill-opacity', .05)
                        .attr('pointer-events', 'none');
                }
            },
            getTimeRangeLabel(dateTimeStart, dateTimeEnd, isMobile) {
                const FORMAT = 'YYYY-MM-DD HH:mm:ss.SSS';

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
    @import url(../../css/index.css);

    #interval {
        outline: none;
    }

    .bar:hover {
        cursor: pointer;
    }
</style>
