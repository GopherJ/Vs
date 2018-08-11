<template>
    <div class="d3-sankey-circular" :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import { isNull, cloneDeep, debounce } from 'lodash';
    import * as d3SankeyCircular from 'd3-sankey-circular';
    import pathArrows from './pathArrows';
    import emit from '../../utils/emit';
    import { showTip, hideTip } from '../../plugins/tooltip';
    import highlightNodes from '../../utils/highlightNodes';
    import mixins from '../../mixins/sankey';

    Object.assign(d3, d3SankeyCircular);

    const tpl = `
            <option value="5000">5 seconds</option>
            <option value="10000">10 seconds</option>
            <option value="30000">30 seconds</option>
            <option value="60000">1 minute</option>
            <option value="300000">5 minute</option>
            <option value="900000">15 minute</option>
            <option value="1800000">30 minute</option>
            <option value="3600000">1 hour</option>
            <option value="10800000">3 hour</option>
            <option value="21600000">6 hour</option>
            <option value="43200000">12 hour</option>
            <option value="86400000">24 hour</option>
    `;

    export default {
        name: 'd3-sankey-circular',
        data: () => {
            return {
                maxPeriod: 30000
            }
        },
        mixins: [mixins],
        methods: {
            drawSankey() {
                if (!this.nodes.length || !this.links.length) return;

                const data = cloneDeep({
                    nodes: this.nodes,
                    links: this.links,
                });

                const {
                    nodeWidth = 20,
                    nodeTextFontSize = 12,
                    nodeTextFontWeight = 600,
                    nodeTextFontOpacity = 1,

                    circularLinkGap = 4,
                    circularLinkColor = 'red',
                    linkColor = 'black',

                    gapLength = 150,
                    arrowLength = 10,
                    arrowHeadSize = 4,

                    axisXSelectBoxLabel = 'Max interval among the same trajectory',

                    axisXSelectBoxLabelFontSize = 12,
                    axisXSelectBoxLabelFontWeight = 400,
                    axisXSelectBoxLabelFontOpacity = 0.5,

                    axisXLabel = null,

                    axisXLabelFontSize = 12,
                    axisXLabelFontWeight = 400,
                    axisXLabelFontOpacity = 1,
                } = this.options;

                const [w, h] = this.getElWidthHeight(),
                    {
                        axisXLabelLaneHeight = isNull(axisXLabel) ? 0 : 30,
                    } = this.options,
                    __selectBoxLaneHeight__ = 40,
                    g_w = w,
                    g_h = h - axisXLabelLaneHeight - __selectBoxLaneHeight__,
                    isMobile = g_w <= 560;

                if (![g_w, g_h].every(el => el > 0)) return;

                const nodeTitle = this.nodeTitle;
                const linkTitle = this.linkTitle;

                const sankey = d3.sankeyCircular()
                    .nodeWidth(nodeWidth)
                    .nodePaddingRatio(0.5)
                    .size([g_w, g_h])
                    .nodeId(d => d.name)
                    .nodeAlign(d3.sankeyJustify)
                    .iterations(32)
                    .circularLinkGap(circularLinkGap);

                const svg = d3
                    .select(this.$el)
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);

                const axisXSelectBoxLane = svg
                    .append('g');

                const axisXLabelLane = svg
                    .append('g')
                    .attr('transform', `translate(0, ${__selectBoxLaneHeight__ + g_h})`);

                const g = svg
                    .append('g')
                    .attr('transform', `translate(0, ${__selectBoxLaneHeight__})`);

                const selectBoxLabel = axisXSelectBoxLane
                    .append('text')
                    .attr('text-anchor', 'middle')
                    .attr('x', g_w / 2 - 75)
                    .attr('y', __selectBoxLaneHeight__ / 2)
                    .attr('dy', '0.32em')
                    .text(axisXSelectBoxLabel)
                    .attr('fill', '#000')
                    .attr('font-size', axisXSelectBoxLabelFontSize)
                    .attr('font-weight', axisXSelectBoxLabelFontWeight)
                    .attr('fill-opacity', axisXSelectBoxLabelFontOpacity);

                if (!isMobile) {
                    const selectBoxLabelRect = selectBoxLabel.node().getBBox();

                    const foreignObject = axisXSelectBoxLane
                        .append('foreignObject');

                    foreignObject
                        .attr('transform', `translate(${selectBoxLabelRect.x + selectBoxLabelRect.width}, 0)`)
                        .attr('width', g_w - selectBoxLabelRect.x - selectBoxLabelRect.width);

                    foreignObject
                        .attr('height', __selectBoxLaneHeight__)
                        .append('xhtml:select')
                        .on('change', () => {
                            const targetVal = d3.event.target.value,
                                val = Number.parseInt(targetVal, 10);

                            this.maxPeriod = val;
                            emit(this, 'max-period-updated', this.maxPeriod);
                        })
                        .html(tpl)
                        .property('value', this.maxPeriod);
                }

                axisXLabelLane.append('text')
                    .attr('text-anchor', 'middle')
                    .attr('x', g_w / 2)
                    .attr('y', axisXLabelLaneHeight / 2)
                    .attr('dy', '0.32em')
                    .text(axisXLabel)
                    .attr('fill', '#000')
                    .attr('fill-opacity', axisXLabelFontOpacity)
                    .attr('font-size', axisXLabelFontSize)
                    .attr('font-weight', axisXLabelFontWeight);

                const sankeyData = sankey(data);
                const sankeyNodes = sankeyData.nodes;
                const sankeyLinks = sankeyData.links;

                const nodeColour = d3
                    .scaleSequential(d3.interpolateCool)
                    .domain([0, g_w]);

                const linkG = g
                    .append('g')
                    .attr('class', 'links')
                    .attr('fill', 'none')
                    .attr('opacity', 0.3)
                    .selectAll('path');

                const link = linkG
                    .data(sankeyLinks)
                    .enter()
                    .append('g');

                link
                    .append('path')
                    .attr('class', 'link')
                    .attr('d', link => link.path)
                    .attr('stroke-width', d => Math.max(1, d.width))
                    .attr('stroke', link => (link.circular ? circularLinkColor : linkColor))
                    .attr('stroke-opacity', 0.7)
                    .on('mouseover', showTip(linkTitle))
                    .on('mouseout', hideTip);

                const nodeG = g
                    .append('g')
                    .attr('class', 'nodes')
                    .selectAll('g');

                const node = nodeG
                    .data(sankeyNodes)
                    .enter()
                    .append('g');

                node
                    .append('rect')
                    .attr('class', 'node')
                    .attr('x', d => d.x0)
                    .attr('y', d => d.y0)
                    .attr('height', d => d.y1 - d.y0)
                    .attr('width', d => d.x1 - d.x0)
                    .attr('fill', d => nodeColour(d.x0))
                    .attr('fill-opacity', 0.5)
                    .on('mouseover', function (d) {
                        const thisName = d.name;

                        showTip(nodeTitle)(d);

                        node.selectAll('.node')
                            .attr('fill-opacity', d => highlightNodes(d, thisName));

                        link.selectAll('.link')
                            .attr('stroke-opacity', l => (l.source.name === thisName || l.target.name === thisName ? 1 : 0.3));
                    })
                    .on('mouseout', () => {
                        hideTip();

                        node.selectAll('.node')
                            .attr('fill-opacity', 0.5);

                        link.selectAll('.link')
                            .attr('stroke-opacity', 0.7);
                    });

                node
                    .append('text')
                    .attr('x', d => (d.x0 + d.x1) / 2)
                    .attr('y', d => d.y0 - 12)
                    .attr('dy', '0.32em')
                    .attr('text-anchor', 'middle')
                    .text(d => d.name)
                    .attr('font-size', nodeTextFontSize)
                    .attr('font-weight', nodeTextFontWeight)
                    .attr('fill-opacity', nodeTextFontOpacity);

                const arrows = pathArrows()
                    .arrowLength(arrowLength)
                    .gapLength(gapLength)
                    .arrowHeadSize(arrowHeadSize)
                    .path(link => link.path);

                linkG.data(sankeyLinks)
                    .enter()
                    .append('g')
                    .attr('class', 'g-arrow')
                    .call(arrows);

                const [g_real_w, g_real_h] = this.getSelectionWidthHeight(g),
                    [offsetX, offsetY] = this.getSelectionOffset(g);

                g.attr('transform', `translate(${(g_w - g_real_w) / 2 - offsetX}, ${(g_h - g_real_h) / 2 - offsetY + __selectBoxLaneHeight__})`);
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawSankey();
            },
            onResize() {
                this.safeDraw();
            }
        }
    };
</script>

<style>
    @import url(../../css/index.css);

    .d3-sankey-circular rect:hover {
        cursor: pointer;
    }

    .d3-sankey-circular path {
        cursor: pointer;
    }

    .d3-sankey-circular text {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: pointer;
    }

    .d3-sankey-circular select {
        float: left;
        width: 145px;
        margin-left: 5px;
        height: 36px;
        padding: 5px 15px;
        background-color: #fff;
        background-image: none;
        border: 2px solid #ecf0f1;
        border-radius: 4px;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
        transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    }

    .d3-sankey-circular select:focus {
        cursor: pointer;
        border: 2px solid #ccc;
    }

    .d3-sankey-circular select:-moz-focusring {
        color: transparent;
        text-shadow: 0 0 0 #000;
    }

    .d3-sankey-circular option:not(:checked) {
        color: black;
    }
</style>
