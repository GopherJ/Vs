<template>
    <div class="d3-horizontal-bar" :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import _ from 'lodash';
    import mixins from '../../mixins';
    import {showTip, hideTip} from '../../util/tooltip';
    import emit from '../../util/emit';
    import responsiveAxis from '../../util/responsiveAxis';
    import timeFormat from '../../util/timeFormat';
    import brush from '../../util/brush';
    import wrap from '../../util/wrap';
    import {selectPaddingInnerOuterX, selectTicksNumY} from '../../util/select';

    export default {
        name: 'd3-horizontal-bar',
        mixins: [mixins],
        methods: {
            drawHorizontalBar() {
                const [w, h] = this.getElWidthHeight();

                const data = _.cloneDeep(this.data),
                    {
                        fill = '#6eadc1',
                        stroke = '#6eadc1',
                        fillOpacity = 0.6,
                        strokeOpacity = 1,

                        barTitle = d => `${d.key}<br>${d.value}`,

                        tickSize = 10,
                        tickPadding = 8,

                        axisFontSize = 12,
                        axisFontWeight = 400,
                        axisFontOpacity = 1,

                        axisYLabel = null,
                        axisXLabel = null,

                        axisLabelFontSize = 12,
                        axisLabelFontWeight = 400,
                        axisLabelFontOpacity = 0.5,

                        axisXLaneHeight = 60,
                        axisYLaneWidth = 60,

                        isAxisXTime = true,
                        axisXTimeInterval = null,
                        sort = true,

                        isAxisPathShow = false,

                        animationDuration = 1000,
                        delay = 50,

                        isShadowed = false,
                        shadowColor = 'rgb(230, 237, 244)',

                        breakWords = true,

                        axisYTickFormat = '.2s'
                    } = this.options,
                    {
                        axisXLabelLaneHeight = _.isNull(axisXLabel) ? 0 : 30,
                        axisYLabelLaneWidth = _.isNull(axisYLabel) ? 0 : 30,
                    } = this.options,
                    {left = 0, right = 0, top = 0, bottom = 0} = this.margin,
                    offsetTop = 10,
                    g_w = w - left - right - axisYLabelLaneWidth - axisYLaneWidth,
                    g_h = h - top - bottom - axisXLaneHeight - axisXLabelLaneHeight - offsetTop;

                if (![g_w, g_h].every(el => el > 0)) {
                    return;
                }

                if (isAxisXTime && sort) {
                    data.sort((a, b) => a.key > b.key ? 1 : -1);
                }

                const ticks = selectTicksNumY(g_h),
                    [paddingInner, paddingOuter] = selectPaddingInnerOuterX(g_w);

                const axisXTickFormat = (value) => {
                    if (!isAxisXTime || _.isString(value)) {
                        return value;
                    }

                    return _.isNumber(value)
                        ? timeFormat(new Date(value), axisXTimeInterval)
                        : timeFormat(value, axisXTimeInterval);
                };

                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', `${w}`)
                    .attr('height', `${h}`);


                const yScale = d3.scaleLinear()
                    .range([g_h, 0])
                    .domain([0, d3.max(data, d => d.value)]);

                const xScale = d3.scaleBand()
                    .range([0, g_w])
                    .paddingInner([paddingInner])
                    .paddingOuter([paddingOuter])
                    .domain(data.map(d => d.key));

                if (isAxisXTime) {
                    const extent = [
                        [left + axisYLaneWidth + axisYLabelLaneWidth, top + offsetTop],
                        [w - right, h - axisXLaneHeight - axisXLabelLaneHeight]
                    ];

                    svg.call(brush.bind(this), extent, xScale, data);
                }

                const g = svg
                    .append('g')
                    .attr('transform', `translate(${left + axisXLabelLaneHeight + axisYLaneWidth}, ${top + offsetTop})`)
                    .attr('width', `${g_w}`)
                    .attr('height', `${g_h}`);

                const axisXLane = svg
                    .append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth + axisYLaneWidth},${top + g_h + offsetTop})`)
                    .attr('width', g_w)
                    .attr('height', axisXLaneHeight);

                const axisYLane = svg
                    .append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth}, ${top + offsetTop})`)
                    .attr('width', axisYLaneWidth)
                    .attr('height', g_h);

                const axisXLabelLane = svg
                    .append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth + axisYLaneWidth}, ${top + g_h + axisXLaneHeight + offsetTop})`)
                    .attr('width', g_w)
                    .attr('height', axisXLabelLaneHeight);

                const axisYLabelLane = svg
                    .append('g')
                    .attr('transform', `translate(${left}, ${top + offsetTop})`)
                    .attr('width', axisYLabelLaneWidth)
                    .attr('height', g_h);

                const xAxis = d3
                    .axisBottom(xScale)
                    .tickValues(xScale.domain())
                    .tickFormat(axisXTickFormat)
                    .tickSize(tickSize)
                    .tickPadding(tickPadding);

                axisXLane.append('g')
                    .attr('class', 'axis axis--x')
                    .call(xAxis)
                    .attr('font-size', axisFontSize)
                    .attr('font-weight', axisFontWeight)
                    .attr('fill-opacity', axisFontOpacity);

                if (isAxisXTime) {
                    axisXLane
                        .call(responsiveAxis, xAxis, xScale);
                }

                if (breakWords) {
                    axisXLane
                        .selectAll('.tick text')
                        .call(wrap, xScale.bandwidth());
                }

                axisYLane.append('g')
                    .attr('class', 'axis axis--y')
                    .attr('transform', `translate(${axisYLaneWidth}, 0)`)
                    .call(d3
                        .axisLeft(yScale)
                        .ticks(ticks)
                        .tickFormat(d3.format(axisYTickFormat))
                        .tickSize(tickSize)
                        .tickPadding(tickPadding))
                    .attr('font-size', axisFontSize)
                    .attr('fill-opacity', axisFontOpacity)
                    .attr('font-weight', axisFontWeight);

                if (!isAxisPathShow) {
                    axisYLane.select('.domain')
                        .attr('display', 'none');

                    axisXLane.select('.domain')
                        .attr('display', 'none');
                }

                const enter = g.selectAll('rect')
                    .data(data)
                    .enter();

                if (isShadowed && _.isString(shadowColor)) {
                    enter.append('rect')
                        .attr('x', d => xScale(d.key))
                        .attr('y', 0)
                        .attr('width', xScale.bandwidth())
                        .attr('height', g_h)
                        .attr('fill', shadowColor);
                }

                const rects = enter.append('rect')
                    .attr('x', d => xScale(d.key))
                    .attr('y', g_h)
                    .attr('width', xScale.bandwidth())
                    .attr('fill', fill)
                    .attr('stroke', stroke)
                    .attr('fill-opacity', fillOpacity)
                    .attr('stroke-opacity', strokeOpacity);

                rects
                    .on('mousedown', d => {
                        if (isAxisXTime && _.isNumber(axisXTimeInterval)) {
                            const dateTimeStart = _.isNumber(d.key) ? new Date(d.key) : new Date(d.key.getTime()),
                                dateTimeEnd = _.isNumber(d.key) ? new Date(d.key + axisXTimeInterval) : new Date(d.key.getTime() + axisXTimeInterval);

                            emit(this, 'range-updated', dateTimeStart, dateTimeEnd);
                        }
                    })
                    .on('mouseover', d => {
                        showTip(barTitle(d));
                    })
                    .on('mouseout', hideTip);

                rects
                    .transition()
                    .duration(_.isNumber(animationDuration) ? animationDuration : 0)
                    .delay((d, i) => i * (_.isNumber(delay) ? delay : 0))
                    .attr('height', d => g_h - yScale(d.value))
                    .attr('y', d => yScale(d.value));

                rects
                    .each(function (d) {
                        const x = xScale(d.key),
                            self = this;

                        const interpolateWarm = d3.scaleSequential()
                            .domain([0, d.value])
                            .interpolator(d3.interpolateWarm);


                        if (d.children && d.children.length > 0) {
                            if (d.children.every(el => _.isString(el.key))) {
                                d3.select(self).remove();

                                const _data = d.children.reduce((ite, cur, i) => {
                                    const y = i === 0 ? yScale(d.value) : ite[ite.length - 1].y + ite[ite.length - 1].height;

                                    ite.push({
                                        y,
                                        height: (g_h - yScale(d.value)) * (cur.value / d.value),
                                        value: cur.value,
                                        key: cur.key
                                    });

                                    return ite;
                                }, []);

                                const _childRects = g.selectAll('.child')
                                    .data(_data)
                                    .enter()
                                    .append('rect');

                                _childRects
                                    .attr('x', x)
                                    .attr('width', xScale.bandwidth())
                                    .attr('y', _d => _d.y + _d.height)
                                    .attr('height', _d => 0)
                                    .attr('fill', _d => interpolateWarm(_d.value))
                                    .attr('fill-opacity', fillOpacity)
                                    .attr('stroke', _d => interpolateWarm(_d.value))
                                    .attr('stroke-opacity', strokeOpacity)
                                    .on('mouseover', _d => {
                                        showTip(barTitle(_d));
                                    })
                                    .on('mouseout', hideTip);

                                _childRects
                                    .transition()
                                    .duration(_.isNumber(animationDuration) ? animationDuration : 0)
                                    .delay((d, i) => i * (_.isNumber(delay) ? delay : 0))
                                    .attr('y', _d => _d.y)
                                    .attr('height', _d => _d.height);

                            } else if (d.children.every(el => _.isDate(el.key) || _.isNumber(el.key))) {
                                d3.select(self).remove();

                                const _data = d.children.reduce((ite, cur, i) => {
                                    const width = xScale.bandwidth() / d.children.length;

                                    const x = i === 0 ? xScale(d.key) : ite[ite.length - 1].x + width;
                                    ite.push({
                                        x,
                                        width,
                                        value: cur.value,
                                        key: cur.key
                                    });

                                    return ite;
                                }, []);

                                const _childRects = g.selectAll('.child')
                                    .data(_data)
                                    .enter()
                                    .append('rect');

                                _childRects
                                    .attr('x', _d => _d.x)
                                    .attr('y', g_h)
                                    .attr('height', 0)
                                    .attr('width', _d => _d.width)
                                    .attr('fill', _d => interpolateWarm(_d.value))
                                    .attr('fill-opacity', fillOpacity)
                                    .attr('stroke', _d => interpolateWarm(_d.value))
                                    .attr('stroke-opacity', strokeOpacity)
                                    .on('mouseover', _d => {
                                        showTip(barTitle(_d));
                                    })
                                    .on('mouseout', hideTip);

                                _childRects
                                    .transition()
                                    .duration(_.isNumber(animationDuration) ? animationDuration : 0)
                                    .delay((d, i) => i * (_.isNumber(delay) ? delay : 0))
                                    .attr('y', _d => yScale(_d.value))
                                    .attr('height', _d => g_h - yScale(_d.value));
                            }
                        }
                    });

                axisXLabelLane
                    .append('text')
                    .attr('class', 'label label--x')
                    .attr('text-anchor', 'middle')
                    .attr('x', g_w / 2)
                    .attr('y', axisXLabelLaneHeight / 2)
                    .attr('dy', '0.32em')
                    .attr('fill', '#000')
                    .attr('fill-opacity', axisLabelFontOpacity)
                    .text(axisXLabel)
                    .attr('font-size', axisLabelFontSize)
                    .attr('font-weight', axisLabelFontWeight);

                axisYLabelLane
                    .append('text')
                    .attr('class', 'label label--y')
                    .attr('transform', 'rotate(-90)')
                    .attr('text-anchor', 'middle')
                    .attr('y', axisYLabelLaneWidth / 2)
                    .attr('x', -g_h / 2)
                    .attr('fill', '#000')
                    .attr('fill-opacity', axisLabelFontOpacity)
                    .text(axisYLabel)
                    .attr('font-size', axisLabelFontSize)
                    .attr('font-weight', axisLabelFontWeight);
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawHorizontalBar();
            },
            onResize() {
                this.safeDraw();
            }
        }
    }
</script>

<style>
    @import url(../../css/index.css);

    .d3-horizontal-bar rect:hover {
        cursor: pointer;
    }

    .d3-horizontal-bar text {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: pointer;
    }
</style>

