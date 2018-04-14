<template>
    <div :style="{ 'width' : width, 'height' : height }" class="d3-time-line"></div>
</template>

<script>
    import * as d3 from 'd3';
    import * as tip from 'd3-tip';
    import mixins from '../../mixins';
    import { Point, Interval, getGroupsData } from '../../util/getGroupsData';
    import roundedRect from '../../util/roundedRect';
    import _ from 'lodash';
    import wrap from '../../util/wrapLongLabel';

    // select paddingOuter, paddingInner
    const selectPaddingInnerOuterY = (height) => {
        let paddingInner, paddingOuter = 0.1;

        if (height >= 560) {
            paddingInner = 0.3
        }

        if (height < 560) {
            paddingInner = 0.4;
        }

        if (height < 320) {
            paddingInner = 0.5;
        }

        if (height < 180) {
            paddingInner = 0.6;
        }

        return [paddingInner, paddingOuter];
    };


    // d3.helper = {};
    //
    // d3.helper.tooltip = function(){
    //     var tooltipDiv;
    //     var bodyNode = d3.select('body').node();
    //
    //     function tooltip(){
    //
    //         d3.select(this).on('mouseover.tooltip', function(pD, pI){
    //             // Clean up lost tooltips
    //             d3.select('body').selectAll('div.tooltip').remove();
    //             // Append tooltip
    //             tooltipDiv = d3.select('body')
    //                 .append('div')
    //                 .attr('class', 'tooltip')
    //             var absoluteMousePos = d3.mouse(bodyNode);
    //             tooltipDiv.style({
    //                 left: (absoluteMousePos[0] + 10)+'px',
    //                 top: (absoluteMousePos[1] - 40)+'px',
    //                 'background-color': '#d8d5e4',
    //                 width: '65px',
    //                 height: '30px',
    //                 padding: '5px',
    //                 position: 'absolute',
    //                 'z-index': 1001,
    //                 'box-shadow': '0 1px 2px 0 #656565'
    //             });
    //
    //             var first_line = '<p>X-Value: ' +   '</p>'
    //             var second_line = '<p>Y-Value: ' +  '</p>'
    //
    //             tooltipDiv.html(first_line + second_line)
    //         })
    //             .on('mousemove.tooltip', function(pD, pI){
    //                 // Move tooltip
    //                 var absoluteMousePos = d3.mouse(bodyNode);
    //                 tooltipDiv.style({
    //                     left: (absoluteMousePos[0] + 10)+'px',
    //                     top: (absoluteMousePos[1] - 40)+'px'
    //                 });
    //             })
    //             .on('mouseout.tooltip', function(pD, pI){
    //                 // Remove tooltip
    //                 tooltipDiv.remove();
    //             });
    //
    //     }
    //
    //     tooltip.attr = function(_x){
    //         if (!arguments.length) return attrs;
    //         attrs = _x;
    //         return this;
    //     };
    //
    //     tooltip.style = function(_x){
    //         if (!arguments.length) return styles;
    //         styles = _x;
    //         return this;
    //     };
    //
    //     return tooltip;
    // };

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
                        // label config
                        labelHeight = 30,
                        labelFontSize = 14,
                        labelCornerRadius = 4,

                        // group config
                        groupLabelFontSize = 14,
                        groupLabelFontWeight = 400,
                        groupLaneWidth = 60,

                        // axisX config
                        axisXHeight = 30,
                        axisXFontSize = 12,
                        axisXFontWeight = 400,

                        // axisX Label config
                        axisXLabel = 'Key',
                        axisXLabelHeight = 30,
                        axisXLabelFontSize = 14,
                        axisXLabelFontWeight = 600,
                        axisXLabelFontOpacity = 0.5,

                        // background config
                        backgroundColor = 'rgba(192, 192, 192, 0.125)',
                        borderRadius = 10,
                        borderWidth = 2,
                        borderColor = '#ccc',

                        // zoom config
                        scaleExtent = [1, 32],

                        // lines config
                        lineWidth = 2,
                        lineColor = '#ccc',

                        // circle config
                        circleRadius = 4,
                        circleColor = 'red'
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
                    .attr('pointer-events', 'all')
                    .attr('width', g_w)
                    .attr('height', g_h);


                // draw clip-path
                const clipPath = svg.append('defs').append('clipPath')
                    .attr('transform', `translate(${left + groupLaneWidth}, ${top})`)
                    .attr('id', 'clip-line')
                    .append('rect')
                    .attr('width', g_w)
                    .attr('height', g_h + axisXHeight)
                    .attr('pointer-events', 'none')

                // draw bounding
                const bounding = svg.append('path')
                    .attr('d', roundedRect(left, top, g_w + groupLaneWidth, g_h + axisXHeight, borderRadius, true, true, true, true))
                    .attr('fill', backgroundColor)
                    .attr('stroke', borderColor)
                    .attr('stroke-width', borderWidth)
                    .attr('pointer-events', 'all');

                // draw lines
                // 1. line for separating group and entry
                g.append('line')
                    .attr('class', 'line line--y')
                    .attr('x1', groupLaneWidth)
                    .attr('y1', 0)
                    .attr('x2', groupLaneWidth)
                    .attr('y2', g_h)
                    .attr('stroke', lineColor)
                    .attr('stroke-width', lineWidth);

                // 2. line for separating groups
                g.selectAll('.line.line--x')
                    .data(groups)
                    .enter()
                    .append('line')
                    .attr('class', 'line line--x')
                    .attr('stroke', lineColor)
                    .attr('stroke-width', lineWidth)
                    .attr('y1', (d, i) => (i + 1) * groupHeight)
                    .attr('y2', (d, i) => (i + 1) * groupHeight)
                    .attr('x1', 0)
                    .attr('x2', g_w + groupLaneWidth);

                // draw lane to hold axisX
                const axisXLane = svg.append('g')
                    .attr('transform', `translate(${left + groupLaneWidth}, ${top + g_h})`)
                    .attr('width', g_w)
                    .attr('height', axisXHeight);

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
                    .text(axisXLabel);

                // create timescale
                const timeScale = d3.scaleTime()
                    .domain([dateTimeStart, dateTimeEnd])
                    .range([0, g_w]);

                // create axis y scale
                const scaleY = (i) => d3.scaleBand()
                    .range([groupHeight * (i + 1), groupHeight * i])
                    .paddingInner(paddingInner)
                    .paddingOuter(paddingOuter);


                // create axis X
                const axisX = d3.axisBottom(timeScale);
                axisXLane
                    .append('g')
                    .call(d3.axisBottom(timeScale))
                    .attr('class', 'axis axis--x')
                    .attr('font-size', axisXFontSize)
                    .attr('font-weight', axisXFontWeight);

                // zoomed callback
                const zooming = () => {
                    const t = d3.event.transform.rescaleX(timeScale);
                    console.log(d3.event.transform)
                    // d3.selectAll('.entry--label').attr('transform', d3.event.transform)
                    // d3.selectAll('.entry').attr('transform', d3.event.transform)
                    axisXLane.call(axisX.scale(t));
                    d3.selectAll('.entry').remove()
                    d3.selectAll('.entry--label').remove()
                    drawEntries(t);
                };

                const zoomed = () => {
                    // const t = d3.event.transform.rescaleX(timeScale);
                    // axisXLane.call(axisX.scale(t));
                    // d3.selectAll('.entry--label').remove()
                    // d3.selectAll('.entry').remove()
                    // drawEntries(t);
                }

                // create zoom
                const zoom = d3.zoom()
                    .scaleExtent(scaleExtent)
                    .translateExtent([[0, 0], [g_w, g_h]])
                    .extent([[0, 0], [g_w, g_h]])
                    .on('zoom', zooming)
                    .on('end', zoomed)

                // zoomable domain
                const zoomRect = svg.append('g')
                    .attr('transform', `translate(${left + groupLaneWidth}, ${top})`)
                    .append('rect')
                    .attr('width', g_w)
                    .attr('height', g_h)
                    .attr('fill', 'none')
                    .attr('pointer-events', 'all')
                    .call(zoom);
                // g
                //     .attr('pointer-events', 'all')
                //     .call(zoom);


                // create tooltip
                const tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0]);

                // draw groups
                groupLaneContainer.selectAll('.group.group--lane')
                    .data(groups)
                    .enter()
                    .append('g')
                    .attr('class', 'group group--lane')
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

                // console.log(groups)
                // console.log(JSON.stringify(data, null, 4))

                // start to draw entries

                function drawEntries(timeScale) {
                    for (let i = 0, l = groups.length; i < l; i += 1) {
                        // console.log(groups[i])
                        const D = data[groups[i]];
                        const scaleAxisY = scaleY(i).domain(Object.keys(D));
                        // console.log(D)

                        for (let j = 0; j < D.length; j += 1) {
                            const Y = scaleAxisY(j),
                                H = scaleAxisY.bandwidth(),
                                entries = D[j];
                            // console.log(entries)

                            for (let k = 0; k < entries.length; k += 1) {

                                const entry = entries[k];

                                if (entry instanceof Point) {
                                   const G = entryLaneContainer
                                        .append('g')
                                       G
                                        .append('circle')
                                        .attr('class', 'entry entry--point')
                                        .attr('cx', timeScale(entry.at))
                                        .attr('cy', Y + H/2)
                                        .attr('r', circleRadius)
                                        .attr('fill', circleColor)
                                        .attr('clip-path', 'url(#clip-line)')

                                        G.append('text')
                                        .attr('class', 'entry--label')
                                        .attr('text-anchor', 'middle')
                                        .attr('x', timeScale(entry.at))
                                        .attr('y', (Y+H/2))
                                        .text(entry.title)
                                        .attr('fill', '#000')
                                        .attr('dy', '-0.35em')
                                        .attr('clip-path', 'url(#clip-line)')                                        // .attr('clip-path', 'url(#clip-line)')
                                        .on('mouseover', function () {
                                               console.log('slqw')
                                        }, true)
                                        // .attr('pointer-events', 'all')
                                        // .call(d3.helper.tooltip)
                                        // .on('mouseover', function(){
                                        //     console.log('mouse move')
                                        //     // d3.event.stopPropagation();
                                        //     g.call(tip);
                                        //     tip.html(entry.title)
                                        //     tip.show()
                                        // })
                                        // .on('mouseout', function(){
                                        //     tip.hide();
                                        //     d3.selectAll('.d3-tip').remove()
                                        // })
                                }

                                else if (entry instanceof Interval) {
                                    const posX = timeScale(entry.from),
                                        width = timeScale(entry.to) - posX;

                                    const G =  entryLaneContainer.append('g')

                                    G.append('path')
                                        .attr('class', 'entry entry--interval')
                                        .attr('d', roundedRect(posX, Y, width, H, labelCornerRadius, true, true, true, true))
                                        .attr('fill', 'red')
                                        .attr('clip-path', 'url(#clip-line)')
                                    G.append('text')
                                        .attr('class', 'entry--label')
                                        .attr('text-anchor', 'middle')
                                        .attr('x', (posX + width/2))
                                        .attr('y', (Y+H/2))
                                        .text(entry.label)
                                        .attr('fill', '#000')
                                        .attr('dy', '0.35em')
                                        .attr('clip-path', 'url(#clip-line)')
                                }
                            }
                        }
                    }
                }

                drawEntries(timeScale)
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
</style>
