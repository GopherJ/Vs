<template>
    <div :style="{ 'width' : width, 'height' : height }" class="d3-time-line"></div>
</template>

<script>
/* eslint-disable */
    import * as d3 from 'd3';
    import tip from 'd3-tip';
    import mixins from '../../mixins';
    import {Point, Interval, getGroupsData} from '../../util/getGroupsData';
    import roundedRect from '../../util/roundedRect';
    import _ from 'lodash';
    import offset from 'document-offset';

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
                // reference
                const self = this;
                // constants
                const [w, h] = this.getElWidthHeight(),
                    {dateTimeStart, dateTimeEnd, data, groups} = getGroupsData(_.cloneDeep(this.data));

                // no groups, return
                if (groups.length === 0) {
                    return;
                }

                const {left = 0, top = 0, right = 0, bottom = 0} = this.margin,
                    {
                        // interval config
                        intervalCornerRadius = 4,

                        // symbol config
                        symbolSize = 200,

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

                        // current time line reference
                        currentTimeLineWidth = 2,
                        currentTimeLineColor = 'red'
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
                svg.append('defs').append('clipPath')
                    .attr('id', 'clip-line')
                    .append('rect')
                    .attr('x', groupLaneWidth + left)
                    .attr('y', top)
                    .attr('width', g_w)
                    .attr('height', g_h + axisXHeight);

                // draw border
                svg.append('path')
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
                    .attr('transform', `translate(${left + groupLaneWidth}, ${top + g_h})`);

                // create timescale
                const timeScale = d3.scaleTime()
                    .domain([dateTimeStart, dateTimeEnd])
                    .range([0, g_w]);

                // create axis X
                const axisX = d3.axisBottom(timeScale);
                axisXLane
                    .call(axisX)
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
                    .attr('dy', '0.35em')
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
                function zooming() {
                    const t = d3.event.transform.rescaleX(timeScale);

                    if (!axisXLane.selectAll('*').empty()) {
                        axisXLane.selectAll('*').remove();
                    }

                    axisXLane
                    // .transition(svg.transition().duration(750))
                        .call(axisX.scale(t))
                        .attr('class', 'axis axis--x')
                        .attr('font-size', axisXFontSize)
                        .attr('font-weight', axisXFontWeight);

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

                // create zoom
                const zoom = d3.zoom()
                    .extent([[left + groupLaneWidth, top], [g_w, g_h]])
                    .on('zoom', zooming);

                // last week
                // const d1 = new date(),
                //       d0 = new Date(d1.valueOf() - 1000 * 60 * 60 * 24 * 30);

                // Gratuitous intro zoom!
                svg.call(zoom);
                    // .transition()
                    // .duration(1500)
                    // .call(zoom.transform, d3.zoomIdentity
                    //     .scale(g_w / (timeScale(d1) - timeScale(d0)))
                    //     .translate(-timeScale(d0), 0));

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
                    .attr('y', groupHeight / 2)
                    .attr('dy', '0.35em')
                    .attr('text-anchor', 'middle')
                    .attr('font-size', groupLabelFontSize)
                    .attr('font-weight', groupLabelFontWeight)
                    .text(d => d)
                    .attr('fill', '#000');


                /**
                 * draw current time reference
                 **/
                function drawReference(timeScale) {
                    const date = new Date().valueOf();
                    entryLaneContainer
                        .append('line')
                        .attr('class', 'line--reference')
                        .attr('x1', timeScale(date))
                        .attr('x2', timeScale(date))
                        .attr('y1', 0)
                        .attr('y2', g_h)
                        .attr('stroke', currentTimeLineColor)
                        .attr('stroke-width', currentTimeLineWidth);
                }


                /**
                 * @param timeScale
                 *
                 **/
                function drawTickLines(timeScale) {
                    const ticks = timeScale.ticks().map(el => el.valueOf());
                    entryLaneContainer.selectAll('.line--tick')
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
                        .attr('stroke-width', boundingLineWidth);
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
                                        .attr('class', 'entry')
                                        .attr('clip-path', 'url(#clip-line)');

                                    const symbolGen = d3.symbol().size(symbolSize);

                                    const symbol = G.append('path')
                                        .attr('transform', `translate(${timeScale(entry.at)}, ${Y + H / 2})`)
                                        .attr('class', `${entry.className ? entry.className : 'entry--point--default'}`)
                                        .attr('d', symbolGen.type(d3[entry.symbol] || d3['symbolCircle'])());

                                    symbol
                                        .on('mouseover', function () {
                                            g.call(tip);
                                            tip.html(() => `${entry.title}`);
                                            tip.show();

                                            const tipSelection = d3.select('.d3-tip');
                                            tipSelection.style('top', `${offset(this).top - tipSelection.node().getBoundingClientRect().height - 10}px`);
                                            tipSelection.style('left', `${offset(this).left + this.getBBox().width/2 - tipSelection.node().getBoundingClientRect().width/2}px`);
                                        })
                                        .on('mouseout', () => {
                                            // tip.hide();
                                            d3.selectAll('.d3-tip').remove();
                                        })
                                }

                                else if (entry instanceof Interval) {
                                    const X = timeScale(entry.from),
                                        W = timeScale(entry.to) - X;

                                    const G = entryLaneContainer
                                        .append('g')
                                        .attr('class', 'entry');

                                    const interval = G.append('path')
                                        .attr('class', `${entry.className ? entry.className : 'entry--interval--default'}`)
                                        .attr('d', roundedRect(X, Y, W, H, intervalCornerRadius, true, true, true, true))
                                        .attr('clip-path', 'url(#clip-line)');

                                    if (entry.title) {
                                        interval
                                            .on('mouseover', function() {
                                                g.call(tip);
                                                tip.html(() => `${entry.title}`);
                                                tip.show();

                                                const tipSelection = d3.select('.d3-tip');
                                                tipSelection.style('top', `${offset(this).top - tipSelection.node().getBoundingClientRect().height - 10}px`);
                                                tipSelection.style('left', `${offset(this).left + this.getBBox().width/2 - tipSelection.node().getBoundingClientRect().width/2}px`);

                                            })
                                            .on('mouseout', () => {
                                                // tip.hide();
                                                d3.selectAll('.d3-tip').remove();
                                            });
                                    }

                                    const text = G.append('text')
                                        .attr('class', 'entry entry--label')
                                        .attr('text-anchor', 'middle')
                                        .attr('x', (X + W / 2))
                                        .attr('y', (Y + H / 2))
                                        .text(entry.label)
                                        .attr('dy', '0.35em')
                                        .attr('clip-path', 'url(#clip-line)');

                                    if (text.node().getComputedTextLength() > W) {
                                        text.remove();
                                    }
                                }
                            }
                        }
                    }
                }

                // initialisation
                // async
                drawReference(timeScale);
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

    .d3-time-line .entry--label {
        fill: #000;
        fill-opacity: 1;
        font-size: 12px;
        font-weight: 400;
        cursor: pointer;
    }

    .d3-time-line .entry--interval--default {
        fill: #6eadc1;
        stroke: #6eadc1;
        fill-opacity: 0.125;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-time-line .entry--point--default {
        fill: #6eadc1;
        stroke: #6eadc1;
        fill-opacity: 0.125;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-time-line .entry--interval--error {
        fill: #ff3860;;
        stroke: #ff3860;
        fill-opacity: 0.125;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-time-line .entry--point--error {
        fill: #ff3860;;
        stroke: #ff3860;
        fill-opacity: 0.125;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-time-line .entry--interval--success {
        fill: #23d160;;
        stroke: #23d160;
        fill-opacity: 0.125;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-time-line .entry--point--success {
        fill: #23d160;;
        stroke: #23d160;
        fill-opacity: 0.125;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-time-line .entry--interval--info {
        fill: #167df0;;
        stroke: #167df0;
        fill-opacity: 0.125;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-time-line .entry--point--info {
        fill: #167df0;;
        stroke: #167df0;
        fill-opacity: 0.125;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-time-line .entry--interval--warn {
        fill: #ffdd57;;
        stroke: #ffdd57;
        fill-opacity: 0.125;
        stroke-opacity: 1;
        cursor: pointer;
    }

    .d3-time-line .entry--point--warn {
        fill: #ffdd57;;
        stroke: #ffdd57;
        fill-opacity: 0.125;
        stroke-opacity: 1;
        cursor: pointer;
    }
</style>
