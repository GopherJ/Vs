<template>
    <div :style="{ 'width' : width, 'height' : height }" class="d3-time-line"></div>
</template>

<script>
    import * as d3 from 'd3';
    import tip from 'd3-tip';
    import mixins from '../../mixins';
    import { Point, Interval, getGroupsData } from '../../util/getGroupsData';
    import roundedRect from '../../util/roundedRect';
    import _ from 'lodash';

    // load tip
    Object.assign(d3, {
        tip
    });


    // select paddingOuter, paddingInner
    const selectPaddingInnerOuterY = (height) => {
        let paddingInner, paddingOuter = 0.25;

        if (height >= 560) {
            paddingInner = 0.05;
        }

        if (height < 560) {
            paddingInner = 0.075;
        }

        if (height < 320) {
            paddingInner = 0.1;
        }

        if (height < 180) {
            paddingInner = 0.125;
        }

        return [paddingInner, paddingOuter];
    };

    export default {
        name: 'd3-timeline',
        mixins: [mixins],
        methods: {
            drawTimeline() {
                // constants
                const [w, h] = this.getElWidthHeight(),
                    { dateTimeStart, dateTimeEnd, data, groups } = getGroupsData(_.cloneDeep(this.data)),
                    {left = 0, top = 0, right = 0, bottom = 0} = this.margin,
                    {
                        // interval config
                        intervalCornerRadius = 4,

                        // circle config
                        circleRadius = 8,

                        // group config
                        groupLabelFontSize = 14,
                        groupLabelFontWeight = 400,

                        // group label config
                        groupLaneWidth = 80,

                        // axisX config
                        axisXHeight = 30,
                        axisXFontSize = 12,
                        axisXFontWeight = 400,

                        // axisX Label config
                        axisXLabel = 'Key',
                        axisXLabelHeight = 30,
                        axisXLabelFontSize = 14,
                        axisXLabelFontWeight = 600,

                        // background config
                        backgroundColor = 'rgba(192, 192, 192, 0.125)',
                        borderRadius = 10,
                        borderWidth = 2,
                        borderColor = '#ccc',

                        // lines config
                        boundingLineWidth = 2,
                        boundingLineColor = '#ccc',
                    } = this.options,
                    g_w = w - left - right - groupLaneWidth,
                    g_h = h - top - bottom - axisXHeight - axisXLabelHeight,
                    groupHeight = g_h / groups.length,
                    [paddingInner, paddingOuter] = selectPaddingInnerOuterY(groupHeight);

                // draw svg
                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);

                // draw g
                const g = svg.append('g')
                    .attr('transform', `translate(${left}, ${top})`)
                    .attr('width', g_w + groupLaneWidth)
                    .attr('height', g_h);

                // draw group lane container
                const groupLaneContainer = g.append('g')
                    .attr('class', 'group--container')
                    .attr('width', groupLaneWidth)
                    .attr('height', g_h);

                // draw entry lane container
                const entryLaneContainer = g.append('g')
                    .attr('class', 'entry--container')
                    .attr('width', g_w)
                    .attr('height', g_h);

                // draw clip-path
                const clipPath = svg.append('defs').append('clipPath')
                    .attr('transform', `translate(${left + groupLaneWidth}, ${top})`)
                    .attr('id', 'clip-line')
                    .append('rect')
                    .attr('width', g_w)
                    .attr('height', g_h + axisXHeight);

                // draw border
                const border = svg.append('path')
                    .attr('d', roundedRect(left, top, g_w + groupLaneWidth, g_h + axisXHeight, borderRadius, true, true, true, true))
                    .attr('fill', backgroundColor)
                    .attr('stroke', borderColor)
                    .attr('stroke-width', borderWidth)
                    .attr('pointer-events', 'none');

                // draw bounding lines
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

                // draw lane to hold axisX
                const axisXLane = svg.append('g')
                    .attr('transform', `translate(${left + groupLaneWidth}, ${top + g_h})`)
                    .attr('width', g_w)
                    .attr('height', axisXHeight);

                // create timescale
                const timeScale = d3.scaleTime()
                    .domain([dateTimeStart, dateTimeEnd])
                    .range([0, g_w]);

                // create axis X
                const axisX = d3.axisBottom(timeScale);
                axisXLane
                    .append('g')
                    .call(d3.axisBottom(timeScale))
                    .attr('class', 'axis axis--x')
                    .attr('font-size', axisXFontSize)
                    .attr('font-weight', axisXFontWeight);


                // draw axisXLabel lane
                const axisXLabelLane = svg.append('g')
                    .attr('transform', `translate(${left},${top + g_h + axisXHeight})`)
                    .attr('width', g_w + groupLaneWidth)
                    .attr('height', axisXLabelHeight);

                // draw axisXLabel
                axisXLabelLane.append('text')
                    .attr('x', (g_w + groupLaneWidth) / 2)
                    .attr('y', axisXLabelHeight / 2)
                    .attr('fill', '#000')
                    .attr('text-anchor', 'middle')
                    .text(axisXLabel)
                    .attr('font-size', axisXLabelFontSize)
                    .attr('font-weight', axisXLabelFontWeight);

                /**
                 * create axis y scale to be used by every group
                 * @param i
                 * @returns {*}
                 */
                const scaleY = (i) => d3.scaleBand()
                    .range([groupHeight * (i + 1), groupHeight * i])
                    .paddingInner(paddingInner)
                    .paddingOuter(paddingOuter);

                /**
                 * zooming callback
                 */
                function zooming () {
                    const t = d3.event.transform.rescaleX(timeScale);
                    axisXLane.call(axisX.scale(t));
                    d3.selectAll('.entry').remove();
                    d3.selectAll('.line--tick').remove();

                    drawTickLines(t);
                    drawEntries(t);
                }

                // create zoom
                const zoom = d3.zoom()
                    .extent([[0, 0], [g_w, g_h]])
                    .on('zoom', zooming);

                // zoomable domain
                const zoomRect = svg.append('g')
                    .attr('transform', `translate(${left + groupLaneWidth}, ${top})`)
                    .append('rect')
                    .attr('width', g_w)
                    .attr('height', g_h)
                    .attr('fill', 'none')
                    .attr('pointer-events', 'all')
                    .call(zoom);

                // create tooltip
                const tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0]);

                // draw groups
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
                    .attr('y', groupHeight/2)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', groupLabelFontSize)
                    .attr('font-weight', groupLabelFontWeight)
                    .text(d => d)
                    .attr('fill', '#000');


                /**
                 * @param timeScale
                 *
                 **/
                function drawTickLines(timeScale) {
                    const ticks = timeScale.ticks().map(el => el.valueOf());
                    g.selectAll('.line--tick')
                        .data(ticks)
                        .enter()
                        .append('line')
                        .attr('class', 'line--tick')
                        .attr('clip-path', 'url(#clip-line)')
                        .attr('x1', d => timeScale(d))
                        .attr('x2', d => timeScale(d))
                        .attr('y1', d => 0)
                        .attr('y2', g_h)
                        .attr('stroke', boundingLineColor)
                        .attr('stroke-width', boundingLineColor);
                }

                /**
                 *
                 * @param timeScale
                 */
                function drawEntries(timeScale) {
                    // groups loop
                    // draw group after group
                    for (let i = 0, l = groups.length; i < l; i += 1) {
                        const groupData = data[groups[i]];
                        const scaleAxisY = scaleY(i).domain(Object.keys(groupData));

                        for (let j = 0; j < groupData.length; j += 1) {
                            const Y = scaleAxisY(j.toString()),
                                  H = scaleAxisY.bandwidth(),
                                  entries = groupData[j];

                            for (let k = 0; k < entries.length; k += 1) {
                                const entry = entries[k];

                                if (entry instanceof Point) {
                                   const G = entryLaneContainer
                                        .append('g')
                                        .attr('class', 'entry');

                                   const point = G.append('circle')
                                       .attr('class', `${entry.className === undefined ? 'entry--point' : entry.className}`)
                                        .attr('cx', timeScale(entry.at))
                                        .attr('cy', Y + H/2)
                                        .attr('r', circleRadius)
                                        .attr('clip-path', 'url(#clip-line)');

                                   point
                                       .on('mouseover', () => {
                                           d3.event.stopImmediatePropagation();
                                           g.call(tip);
                                           tip.html(() => `${entry.title}`);
                                           tip.show();
                                       })
                                       .on('mouseout', () => {
                                           tip.hide();
                                           d3.selectAll('.d3-tip').remove();
                                       })
                                }

                                else if (entry instanceof Interval) {
                                    const X = timeScale(entry.from),
                                          W = timeScale(entry.to) - X;

                                    const G =  entryLaneContainer
                                        .append('g')
                                        .attr('class', 'entry');

                                    const interval = G.append('path')
                                        .attr('class', `${entry.className === undefined ? 'entry--interval' : entry.className}`)
                                        .attr('d', roundedRect(X, Y, W, H, intervalCornerRadius, true, true, true, true))
                                        .attr('clip-path', 'url(#clip-line)');

                                    G.append('text')
                                        .attr('class', 'entry entry--label')
                                        .attr('text-anchor', 'middle')
                                        .attr('x', (X + W/2))
                                        .attr('y', (Y + H/2))
                                        .text(entry.label)
                                        .attr('dy', '0.35em')
                                        .attr('clip-path', 'url(#clip-line)')
                                }
                            }
                        }
                    }
                }

                // initialisation
                drawTickLines(timeScale);
                drawEntries(timeScale);
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

    .d3-time-line .axis path {
        display: none;
    }

    .d3-time-line .entry--point {
        fill: #6eadc1;
        stroke: #6eadc1;
        fill-opacity: 0.6;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-time-line .entry--interval {
        fill: #6eadc1;
        stroke: #6eadc1;
        fill-opacity: 0.6;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-time-line .entry--label {
        fill: #000;
        fill-opacity: 1;
        font-size: 12px;
        font-weight: 400;
    }
</style>
