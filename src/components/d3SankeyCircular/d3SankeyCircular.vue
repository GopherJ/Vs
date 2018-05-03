<template>
    <div :style="{ 'width' : width, 'height' : height }" class="d3-sankey-circular"></div>
</template>

<script>
    /* eslint-disable */
    import * as d3 from 'd3';
    import tip from 'd3-tip';
    import * as d3SankeyCircular from 'd3-sankey-circular';
    import pathArrows from './pathArrows';
    import _ from 'lodash';
    import offset from 'document-offset';
    import {compute_selection_offset, compute_selection_w_h} from '../../util/compute';

    // Load the package d3SankeyCircular and tip on d3
    Object.assign(d3, d3SankeyCircular, {
        tip
    });

    // template
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

    const highlightNodes = (node, name) => {
        let opacity = 0.3;

        if (node.name === name) {
            opacity = 1;
        }
        node.sourceLinks.forEach((link) => {
            // link target is the reference of the target node
            if (link.target.name === name) {
                opacity = 1;
            }
        });
        node.targetLinks.forEach((link) => {
            // link target is the reference of the source node
            if (link.source.name === name) {
                opacity = 1;
            }
        });

        return opacity;
    };

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
                // nodes and links must both exist
                if (this.nodes.length === 0 || this.links.length === 0) {
                    return;
                }

                // start to calculate, to draw
                const data = _.cloneDeep({
                    nodes: this.nodes,
                    links: this.links,
                });

                // options by default
                const {
                    nodeWidth = 20,
                    nodeTextStyle = 'font-size:0.8rem; font-weight:600; font-family:sans-serif;',
                    circularLinkGap = 4,
                    circularLinkColor = 'red',
                    linkColor = 'black',
                    arrowLength = 10,
                    gapLength = 150,
                    arrowHeadSize = 4,

                    axisXSelectBoxLabel = 'Max interval among same trajectory',
                    axisXSelectBoxLabelFontSize = 12,
                    axisXSelectBoxLabelFontWeight = 400,
                    axisXSelectBoxLabelFontOpacity = 0.5,
                    axisXSelectBoxLaneHeight = 40,

                    axisXLabel = 'Key',
                    axisXLabelLaneHeight = 30,
                    axisXLabelFontSize = 12,
                    axisXLabelFontWeight = 400,
                    axisXLabelFontOpacity = 0.5,
                } = this.options;

                // calculate width and height of chart container
                const [w, h] = this.getElWidthHeight(),
                    g_w = w,
                    g_h = h - axisXLabelLaneHeight - axisXSelectBoxLaneHeight,
                    isMobile = g_w <= 560;

                // invalid width and height
                if (g_w <= 0 || g_h <= 0) {
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
                    // .attr("viewBox", `0 0 ${width} ${height}`)
                    // .attr("preserveAspectRatio", "xMinYMax meet")
                    .attr('width', w)
                    .attr('height', h);

                // select box lane
                const axisXSelectBoxLane = svg
                    .append('g')
                    .attr('width', g_w)
                    .attr('height', axisXSelectBoxLaneHeight);

                // label lane
                const axisXLabelLane = svg
                    .append('g')
                    .attr('transform', `translate(0, ${axisXSelectBoxLaneHeight + g_h})`)
                    .attr('width', g_w)
                    .attr('height', axisXLabelLaneHeight);

                // main g that contain our graph
                const g = svg
                    .append('g')
                    .attr('transform', `translate(0, ${axisXSelectBoxLaneHeight})`);

                // create select box label
                const SelectBoxLabel = axisXSelectBoxLane.append('text')
                    .attr('text-anchor', 'middle')
                    .attr('x', g_w / 2)
                    .attr('y', axisXSelectBoxLaneHeight / 2)
                    .text(axisXSelectBoxLabel)
                    .attr('fill', '#000')
                    .attr('font-size', axisXSelectBoxLabelFontSize)
                    .attr('font-weight', axisXSelectBoxLabelFontWeight)
                    .attr('fill-opacity', axisXSelectBoxLabelFontOpacity);

                // pos
                const SelectBoxLabelPos = SelectBoxLabel.node().getBBox();

                // create foreign object
                const FOREIGN_OBJECT = axisXSelectBoxLane.append('foreignObject');

                if (!isMobile) {
                    FOREIGN_OBJECT
                        .attr('transform', `translate(${SelectBoxLabelPos.x + SelectBoxLabelPos.width}, 0)`)
                        .attr('width', g_w - SelectBoxLabelPos.x - SelectBoxLabelPos.width);
                }

                else {
                    FOREIGN_OBJECT
                        .attr('transform', `translate(${SelectBoxLabelPos.x + SelectBoxLabelPos.width / 2}, ${SelectBoxLabelPos.y + SelectBoxLabelPos.height})`)
                        .attr('width', g_w - SelectBoxLabelPos.x - SelectBoxLabelPos.width / 2);
                }

                FOREIGN_OBJECT
                    .attr('height', axisXSelectBoxLaneHeight)
                    .append('xhtml:select')
                    .attr('class', 'form-control')
                    .attr('id', 'max-period')
                    .on('change', () => {
                        const targetVal = d3.event.target.value,
                            val = Number.parseInt(targetVal, 10);

                        this.maxPeriod = val;
                        this.$emit('max-period-updated', this.maxPeriod);

                        if (this.$root) {
                            // design for https://github.com/GopherJ/LayoutGrid
                            if (this.$parent.i) {
                                this.$root.$emit('max-period-updated', {
                                    i: this.$parent.i,
                                    payload: val
                                });
                            } else {
                                this.$root.$emit('max-period-updated', val);
                            }
                        }
                    })
                    .html(tpl)
                    .property('value', this.maxPeriod);

                // create label
                axisXLabelLane.append('text')
                    .attr('text-anchor', 'middle')
                    .attr('x', g_w / 2)
                    .attr('y', axisXLabelLaneHeight / 2)
                    .attr('dy', '0.35em')
                    .text(axisXLabel)
                    .attr('fill', '#000')
                    .attr('fill-opacity', axisXLabelFontOpacity)
                    .attr('font-size', axisXLabelFontSize)
                    .attr('font-weight', axisXLabelFontWeight);

                // tooltip
                const tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([0, 0]);

                const linkG = g
                    .append('g')
                    .attr('class', 'links')
                    .attr('fill', 'none')
                    .attr('stroke-opacity', 0.2)
                    .selectAll('path');

                const nodeG = g
                    .append('g')
                    .attr('class', 'nodes')
                    .attr('font-family', 'sans-serif')
                    .attr('font-size', 10)
                    .selectAll('g');

                // run the Sankey + circular over the data
                const sankeyData = sankey(data);
                const sankeyNodes = sankeyData.nodes;
                const sankeyLinks = sankeyData.links;

                // const [link_value_min, link_value_max] = linkValueRange(data.links);
                // const depthExtent = d3.extent(sankeyNodes, d => d.depth);

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
                    .style('opacity', 0.5)
                    .on('mouseover', function (d) {
                        const thisName = d.name;

                        g.call(tip);
                        tip.html(nodeTitle(d));
                        tip.show();


                        const tipSelection = d3.select('.d3-tip');
                        tipSelection.style('top', `${offset(this).top - tipSelection.node().getBoundingClientRect().height - 10}px`);
                        tipSelection.style('left', `${offset(this).left + this.getBBox().width / 2 - tipSelection.node().getBoundingClientRect().width / 2}px`);

                        node
                            .selectAll('.node')
                            .style('opacity', d => highlightNodes(d, thisName));

                        d3
                            .selectAll('.link')
                            .style('opacity', l => (l.source.name === thisName || l.target.name === thisName ? 1 : 0.3));
                    })
                    .on('mouseout', (d) => {

                        // tip.hide();
                        d3.selectAll('.d3-tip').remove();

                        d3
                            .selectAll('.node')
                            .style('opacity', 0.5);

                        d3
                            .selectAll('.link')
                            .style('opacity', 0.7);
                    });


                node
                    .append('text')
                    .attr('x', d => (d.x0 + d.x1) / 2)
                    .attr('y', d => d.y0 - 12)
                    .attr('dy', '0.35em')
                    .attr('text-anchor', 'middle')
                    .attr('style', nodeTextStyle)
                    .text(d => d.name);

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
                    .style('stroke', (link, i) => (link.circular ? circularLinkColor : linkColor))
                    .on('mouseover', function (d, i) {
                        g.call(tip);
                        tip.html(linkTitle(d));
                        tip.show();

                        const tipSelection = d3.select('.d3-tip');
                        tipSelection.style('top', `${offset(this).top - tipSelection.node().getBoundingClientRect().height - 10}px`);
                        tipSelection.style('left', `${offset(this).left + this.getBBox().width / 2 - tipSelection.node().getBoundingClientRect().width / 2}px`);
                    })
                    .on('mouseout', function (d, i) {
                        // tip.hide();
                        d3.selectAll('.d3-tip').remove();
                    });

                const arrows = pathArrows()
                    .arrowLength(arrowLength)
                    .gapLength(gapLength)
                    .arrowHeadSize(arrowHeadSize)
                    .path(link => link.path);

                const arrowsG = linkG.data(sankeyLinks)
                    .enter()
                    .append('g')
                    .attr('class', 'g-arrow')
                    .call(arrows);

                // calculate g's width and height
                // align g at the middle of chart
                const [g_real_w, g_real_h] = compute_selection_w_h(g),
                      [offsetX, offsetY] = compute_selection_offset(g);

                g.attr('transform', `translate(${(g_w - g_real_w) / 2 - offsetX}, ${(g_h - g_real_h) / 2 - offsetY + axisXSelectBoxLaneHeight})`);
            },
            getElWidthHeight() {
                return [this.$el.clientWidth, this.$el.clientHeight];
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
            // initialisation
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

    .nodes .node {
        cursor: pointer;
    }

    .links .link {
        cursor: pointer;
    }
</style>
