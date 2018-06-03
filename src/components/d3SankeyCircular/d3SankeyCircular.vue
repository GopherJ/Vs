<template>
    <div class="d3-sankey-circular" :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import _ from 'lodash';
    import * as d3SankeyCircular from 'd3-sankey-circular';
    import pathArrows from './pathArrows';
    import emit from '../../utils/emit';
    import { showTip, hideTip } from '../../utils/tooltip';
    import highlightNodes from '../../utils/highlightNodes';

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
        props: {
            nodes: {
                type: Array,
                required: true,
                default: () => [],
            },
            links: {
                type: Array,
                required: true,
                default: () => [],
            },
            options: {
                type: Object,
                default: () => ({}),
            },
            width: {
                type: String,
                default: '100%'
            },
            height: {
                type: String,
                default: '400px'
            },
            nodeTitle: {
                type: Function,
                default: d => `${d.name}<br>${d.value}`,
            },
            linkTitle: {
                type: Function,
                default: d => `${d.source.name} → ${d.target.name}<br>${d.value}`,
            },
        },
        methods: {
            drawSankey() {
                if (this.nodes.length === 0 || this.links.length === 0) {
                    return;
                }

                const data = _.cloneDeep({
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
                        axisXLabelLaneHeight = _.isNull(axisXLabel) ? 0 : 30,
                    } = this.options,
                    __selectBoxLaneHeight__ = 40,
                    g_w = w,
                    g_h = h - axisXLabelLaneHeight - __selectBoxLaneHeight__,
                    isMobile = g_w <= 560;

                if (![g_w, g_h].every(el => el > 0)) {
                    return;
                }

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
                    .append('g')
                    .attr('width', g_w)
                    .attr('height', __selectBoxLaneHeight__);

                const axisXLabelLane = svg
                    .append('g')
                    .attr('transform', `translate(0, ${__selectBoxLaneHeight__ + g_h})`)
                    .attr('width', g_w)
                    .attr('height', axisXLabelLaneHeight);

                const g = svg
                    .append('g')
                    .attr('transform', `translate(0, ${__selectBoxLaneHeight__})`);

                const selectBoxLabel = axisXSelectBoxLane.append('text')
                    .attr('text-anchor', 'middle')
                    .attr('x', g_w / 2)
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
                        .style('float', 'left')
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

                const linkG = g
                    .append('g')
                    .attr('class', 'links')
                    .attr('fill', 'none')
                    .attr('stroke-opacity', 0.2)
                    .selectAll('path');

                const nodeG = g
                    .append('g')
                    .attr('class', 'nodes')
                    .selectAll('g');

                const sankeyData = sankey(data);
                const sankeyNodes = sankeyData.nodes;
                const sankeyLinks = sankeyData.links;

                const nodeColour = d3
                    .scaleSequential(d3.interpolateCool)
                    .domain([0, g_w]);

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
                    .style('fill', d => nodeColour(d.x0))
                    .attr('fill-opacity', 0.5)
                    .on('mouseover', function (d) {
                        const thisName = d.name;

                        showTip(nodeTitle)(d);

                        node.selectAll('.node')
                            .style('opacity', d => highlightNodes(d, thisName));

                        d3.selectAll('.link')
                            .style('opacity', l => (l.source.name === thisName || l.target.name === thisName ? 1 : 0.3));
                    })
                    .on('mouseout', () => {
                        hideTip();

                        d3.selectAll('.node')
                            .style('fill-opacity', 0.5);

                        d3.selectAll('.link')
                            .style('opacity', 0.7);
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

                const link = linkG
                    .data(sankeyLinks)
                    .enter()
                    .append('g');

                link
                    .append('path')
                    .attr('class', 'link')
                    .attr('d', link => link.path)
                    .style('stroke-width', d => Math.max(1, d.width))
                    .style('opacity', 0.7)
                    .style('stroke', link => (link.circular ? circularLinkColor : linkColor))
                    .on('mouseover', showTip(linkTitle))
                    .on('mouseout', hideTip);

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
            getElWidthHeight() {
                return [this.$el.clientWidth, this.$el.clientHeight];
            },
            getSelectionWidthHeight(selection) {
                return [selection.node().getBoundingClientRect().width, selection.node().getBoundingClientRect().height];
            },
            getSelectionOffset(selection) {
                return [selection.node().getBBox().x, selection.node().getBBox().y];
            },
            ifExistsSvgThenRemove() {
                if (d3.select(this.$el).select('svg').empty()) {
                    return;
                }
                d3.select(this.$el).select('svg').remove();
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawSankey();
            }
        },
        watch: {
            nodes: {
                deep: true,
                handler(n, o) {
                    this.$nextTick(() => {
                        this.safeDraw();
                    });
                }
            },
            links: {
                deep: true,
                handler(n, o) {
                    this.$nextTick(() => {
                        this.safeDraw();
                    });
                }
            },
            options: {
                deep: true,
                handler(n, o) {
                    this.$nextTick(() => {
                        this.safeDraw();
                    });
                }
            },
            width(n) {
                this.$nextTick(() => {
                    this.safeDraw();
                });
            },
            height(n) {
                this.$nextTick(() => {
                    this.safeDraw();
                });
            }
        },
        mounted() {
            this.safeDraw();

            this.listener = _.debounce(() => {
                this.safeDraw();
            }, 500);

            window.addEventListener('resize', this.listener);
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.listener);
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
        height: 38px;
        padding: 5px 15px;
        background-color: #fff;
        background-image: none;
        border: 1px solid #ecf0f1;
        border-top-width: 2px;
        border-right-width: 2px;
        border-bottom-width: 2px;
        border-left-width: 2px;
        border-radius: 4px;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
        transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    }

    .d3-sankey-circular select:focus {
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
