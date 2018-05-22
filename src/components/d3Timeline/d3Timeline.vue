<template>
    <div class="d3-timeline" :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import _ from 'lodash';
    import mixins from '../../mixins';
    import {showTip, hideTip} from '../../util/tooltip';
    import {selectPaddingInnerOuterY} from '../../util/selectNumTicks';
    import {Point, Interval, getGroupsData} from '../../util/getGroupsData';
    import roundedRect from '../../util/roundedRect';

    export default {
        name: 'd3-timeline',
        mixins: [mixins],
        methods: {
            drawTimeline() {
                const [w, h] = this.getElWidthHeight(),
                    {dateTimeStart, dateTimeEnd, data, groups} = getGroupsData(_.cloneDeep(this.data));

                if (groups.length === 0) {
                    return;
                }

                const {
                        intervalCornerRadius = 4,

                        symbolSize = 200,

                        groupLabelFontSize = 14,
                        groupLabelFontWeight = 400,
                        groupLabelFontOpacity = 1,

                        groupLaneWidth = 200,

                        tickSize = 10,
                        tickPadding = 8,

                        axisXLaneHeight = 40,
                        axisFontSize = 12,
                        axisFontWeight = 400,
                        axisFontOpacity = 1,

                        axisXLabel = null,

                        axisXLabelFontSize = 14,
                        axisXLabelFontWeight = 600,
                        axisXLabelFontOpacity = 1,

                        backgroundColor = 'rgba(255, 255, 255, 0.125)',
                        borderRadius = 0,
                        borderWidth = 2,
                        borderColor = 'rgba(0, 0, 0, .125)',

                        boundingLineWidth = 2,
                        boundingLineColor = 'rgba(0, 0, 0, .125)',

                        currentTimeLineWidth = 2,
                        currentTimeLineColor = 'rgba(255, 56, 96, 1)'
                    } = this.options,
                    {
                        axisXLabelHeight = _.isNull(axisXLabel) ? 0 : 30,
                    } = this.options,
                    {left = borderWidth, top = borderWidth, right = borderWidth, bottom = borderWidth} = this.margin,
                    g_w = w - left - right - groupLaneWidth,
                    g_h = h - top - bottom - axisXLaneHeight - axisXLabelHeight,
                    groupHeight = g_h / groups.length,
                    [paddingInner, paddingOuter] = selectPaddingInnerOuterY(groupHeight);

                if (![g_w, g_h].every(el => el > 0)) {
                    return;
                }

                const tickFormat = (d) => {
                    return d3.timeFormat('%b')(d);
                };

                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);

                const g = svg.append('g')
                    .attr('transform', `translate(${left}, ${top})`)
                    .attr('width', g_w + groupLaneWidth)
                    .attr('height', g_h);

                const groupLaneContainer = g.append('g')
                    .attr('class', 'group--container')
                    .attr('width', groupLaneWidth)
                    .attr('height', g_h);

                const entryLaneContainer = g.append('g')
                    .attr('class', 'entry--container')
                    .attr('width', g_w)
                    .attr('height', g_h);

                svg.append('defs').append('clipPath')
                    .attr('id', 'clip-timeline')
                    .append('rect')
                    .attr('x', groupLaneWidth + left)
                    .attr('y', top)
                    .attr('width', g_w)
                    .attr('height', g_h + axisXLaneHeight);

                svg.append('path')
                    .attr('d', roundedRect(left, top, g_w + groupLaneWidth, g_h + axisXLaneHeight, borderRadius, true, true, true, true))
                    .attr('fill', backgroundColor)
                    .attr('stroke', borderColor)
                    .attr('stroke-width', borderWidth)
                    .attr('pointer-events', 'none');

                // 1. line for separating group and entry
                g.append('line')
                    .attr('class', 'line--y')
                    .attr('x1', groupLaneWidth)
                    .attr('y1', 0)
                    .attr('x2', groupLaneWidth)
                    .attr('y2', g_h)
                    .attr('stroke', boundingLineColor)
                    .attr('stroke-width', boundingLineWidth);

                // 2. line for separating groups
                g.selectAll('.line--x')
                    .data(groups)
                    .enter()
                    .append('line')
                    .attr('class', 'line--x')
                    .attr('stroke', boundingLineColor)
                    .attr('stroke-width', boundingLineWidth)
                    .attr('y1', (d, i) => (i + 1) * groupHeight)
                    .attr('y2', (d, i) => (i + 1) * groupHeight)
                    .attr('x1', 0)
                    .attr('x2', g_w + groupLaneWidth);

                const xScale = d3.scaleTime()
                    .domain([dateTimeStart, dateTimeEnd])
                    .range([0, g_w]);

                const yScale = (i) => d3.scaleBand()
                    .range([groupHeight * (i + 1), groupHeight * i])
                    .paddingInner(paddingInner)
                    .paddingOuter(paddingOuter);

                const axisX = d3
                    .axisBottom(xScale)
                    .tickFormat(tickFormat)
                    .tickSize(tickSize)
                    .tickPadding(tickPadding);

                const axisXLane = svg.append('g')
                    .attr('transform', `translate(${left + groupLaneWidth}, ${top + g_h})`);

                axisXLane
                    .call(axisX)
                    .attr('class', 'axis axis--x')
                    .attr('font-size', axisFontSize)
                    .attr('font-weight', axisFontWeight)
                    .attr('fill-opacity', axisFontOpacity);

                axisXLane
                    .selectAll('path')
                    .attr('display', 'none');

                const axisXLabelLane = svg.append('g')
                    .attr('transform', `translate(${left},${top + g_h + axisXLaneHeight})`)
                    .attr('width', g_w + groupLaneWidth)
                    .attr('height', axisXLabelHeight);

                axisXLabelLane.append('text')
                    .attr('x', (g_w + groupLaneWidth) / 2)
                    .attr('y', axisXLabelHeight / 2)
                    .attr('fill', '#000')
                    .attr('dy', '0.32em')
                    .attr('text-anchor', 'middle')
                    .text(axisXLabel)
                    .attr('font-size', axisXLabelFontSize)
                    .attr('font-weight', axisXLabelFontWeight)
                    .attr('fill-opacity', axisXLabelFontOpacity);

                function zooming() {
                    const t = d3.event.transform.rescaleX(xScale);

                    if (!axisXLane.selectAll('*').empty()) {
                        axisXLane.selectAll('*').remove();
                    }

                    axisXLane
                        .call(axisX.scale(t))
                        .attr('class', 'axis axis--x')
                        .attr('font-size', axisFontSize)
                        .attr('font-weight', axisFontWeight)
                        .attr('fill-opacity', axisFontOpacity);

                    axisXLane
                        .selectAll('path')
                        .attr('display', 'none');

                    const ENTRY = entryLaneContainer.selectAll('.entry'),
                        LineTick = entryLaneContainer.selectAll('.line--tick'),
                        LineReference = entryLaneContainer.select('.line--reference');


                    if (!ENTRY.empty()) {
                        ENTRY.remove();
                    }

                    if (!LineTick.empty()) {
                        LineTick.remove();
                    }

                    if (!LineReference.empty()) {
                        LineReference.remove();
                    }

                    drawReference(t);
                    drawTickLines(t);
                    drawEntries(t);
                }

                const zoom = d3.zoom()
                    .extent([[left + groupLaneWidth, top], [g_w, g_h]])
                    .on('zoom', zooming);

                svg.call(zoom);

                groupLaneContainer.selectAll('.group--lane')
                    .data(groups)
                    .enter()
                    .append('g')
                    .attr('class', 'group--lane')
                    .attr('fill', 'none')
                    .attr('transform', (d, i) => `translate(0, ${i * groupHeight})`)
                    .attr('width', groupLaneWidth)
                    .attr('height', groupHeight)
                    .append('text')
                    .attr('x', groupLaneWidth / 2)
                    .attr('y', groupHeight / 2)
                    .attr('dy', '0.32em')
                    .attr('text-anchor', 'middle')
                    .attr('font-size', groupLabelFontSize)
                    .attr('font-weight', groupLabelFontWeight)
                    .attr('fill-opacity', groupLabelFontOpacity)
                    .text(d => d)
                    .attr('fill', '#000');

                /**
                 * draw current time reference
                 **/
                function drawReference(xScale) {
                    const date = new Date().valueOf();
                    entryLaneContainer
                        .append('line')
                        .attr('class', 'line--reference')
                        .attr('x1', xScale(date))
                        .attr('x2', xScale(date))
                        .attr('y1', 0)
                        .attr('y2', g_h)
                        .attr('stroke', currentTimeLineColor)
                        .attr('stroke-width', currentTimeLineWidth)
                        .attr('pointer-events', 'none');
                }

                svg.on('mousemove', function () {
                    const [cx, cy] = d3.mouse(entryLaneContainer.node());

                    if (cx > groupLaneWidth && cx < g_w + groupLaneWidth && cy > 0 && cy < g_h) {
                        svg.attr('cursor', 'pointer');
                    }

                    else {
                        svg.attr('cursor', 'auto');
                    }
                });

                /**
                 * @param xScale
                 *
                 **/
                function drawTickLines(xScale) {
                    const ticks = xScale.ticks().map(el => el.valueOf());
                    entryLaneContainer.selectAll('.line--tick')
                        .data(ticks)
                        .enter()
                        .append('line')
                        .attr('class', 'line--tick')
                        .attr('clip-path', 'url(#clip-timeline)')
                        .attr('x1', d => xScale(d))
                        .attr('x2', d => xScale(d))
                        .attr('y1', d => 0)
                        .attr('y2', g_h)
                        .attr('stroke', boundingLineColor)
                        .attr('stroke-width', boundingLineWidth)
                        .attr('pointer-events', 'none');
                }

                /**
                 *
                 * @param xScale
                 */
                function drawEntries(xScale) {
                    for (let i = 0, l = groups.length; i < l; i += 1) {
                        const groupData = data[groups[i]];
                        const scaleAxisY = yScale(i).domain(Object.keys(groupData));

                        for (let j = 0; j < groupData.length; j += 1) {
                            const Y = scaleAxisY(j.toString()),
                                H = scaleAxisY.bandwidth(),
                                entries = groupData[j];

                            for (let k = 0; k < entries.length; k += 1) {
                                const entry = entries[k];

                                if (entry instanceof Point) {
                                    const G = entryLaneContainer
                                        .append('g')
                                        .attr('class', 'entry')
                                        .attr('clip-path', 'url(#clip-timeline)');

                                    const symbolGen = d3.symbol().size(symbolSize);

                                    const symbol = G.append('path')
                                        .attr('transform', `translate(${xScale(entry.at)}, ${Y + H / 2})`)
                                        .attr('class', `${entry.className ? entry.className : 'entry--point--default'}`)
                                        .attr('d', symbolGen.type(d3[entry.symbol] || d3['symbolCircle'])());

                                    symbol
                                        .on('mouseover', d => {
                                            showTip(entry.title);
                                        })
                                        .on('mouseout', hideTip)
                                }

                                else if (entry instanceof Interval) {
                                    const X = xScale(entry.from),
                                        W = xScale(entry.to) - X;

                                    const G = entryLaneContainer
                                        .append('g')
                                        .attr('class', 'entry');

                                    const interval = G.append('path')
                                        .attr('class', `${entry.className ? entry.className : 'entry--interval--default'}`)
                                        .attr('d', roundedRect(X, Y, W, H, intervalCornerRadius, true, true, true, true))
                                        .attr('clip-path', 'url(#clip-timeline)');

                                    if (entry.title) {
                                        interval
                                            .on('mouseover', d => {
                                                showTip(entry.title);
                                            })
                                            .on('mouseout', hideTip);
                                    }

                                    const text = G.append('text')
                                        .attr('class', 'entry entry--label')
                                        .attr('text-anchor', 'middle')
                                        .attr('pointer-events', 'none')
                                        .attr('x', (X + W / 2))
                                        .attr('y', (Y + H / 2))
                                        .text(entry.label)
                                        .attr('dy', '0.32em')
                                        .attr('clip-path', 'url(#clip-timeline)');

                                    if (text.node().getComputedTextLength() > W) {
                                        text.remove();
                                    }
                                }
                            }
                        }
                    }
                }

                drawReference(xScale);
                drawTickLines(xScale);
                drawEntries(xScale);
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawTimeline();
            },
            onResize() {
                this.safeDraw();
            }
        }
    }
</script>

<style>
    @import url(../../css/index.css);

    .d3-timeline path {
        cursor: pointer;
    }

    .d3-timeline text {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: pointer;
    }

    .d3-timeline .entry--interval--default {
        fill: #6eadc1;
        stroke: #6eadc1;
        fill-opacity: 0.125;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-timeline .entry--point--default {
        fill: #6eadc1;
        stroke: #6eadc1;
        fill-opacity: 0.125;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-timeline .entry--interval--error {
        fill: #ff3860;;
        stroke: #ff3860;
        fill-opacity: 0.125;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-timeline .entry--point--error {
        fill: #ff3860;;
        stroke: #ff3860;
        fill-opacity: 0.125;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-timeline .entry--interval--success {
        fill: #23d160;;
        stroke: #23d160;
        fill-opacity: 0.125;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-timeline .entry--point--success {
        fill: #23d160;;
        stroke: #23d160;
        fill-opacity: 0.125;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-timeline .entry--interval--info {
        fill: #167df0;;
        stroke: #167df0;
        fill-opacity: 0.125;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-timeline .entry--point--info {
        fill: #167df0;;
        stroke: #167df0;
        fill-opacity: 0.125;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-timeline .entry--interval--warn {
        fill: #ffdd57;;
        stroke: #ffdd57;
        fill-opacity: 0.125;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-timeline .entry--point--warn {
        fill: #ffdd57;;
        stroke: #ffdd57;
        fill-opacity: 0.125;
        stroke-opacity: 1;
        cursor: pointer;
    }
</style>
