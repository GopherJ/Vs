<template>
    <div :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
    /* eslint-disable */
    import * as d3 from 'd3';
    import * as d3SankeyCircular from 'd3-sankey-circular';
    import pathArrows from './pathArrows';
    import _ from 'lodash';

    // Load the package d3SankeyCircular on d3
    Object.assign(d3, d3SankeyCircular);

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
                default: '600px'
            },
            nodeTitle: {
                type: Function,
                default: d => `${d.name}\n${d.value}`,
            },
            linkTitle: {
                type: Function,
                default: d => `${d.source.name} → ${d.target.name}\n${d.value}`,
            },
        },
        methods: {
            drawSankey() {
                if (this.nodes.length === 0 || this.links.length === 0) {
                    return;
                }
                // how to make svg respond to window
                // https://bl.ocks.org/curran/3a68b0c81991e2e94b19

                /**
                 * compute width and height of chart
                 */
                const compute_w_h = () => {
                    return [this.$el.clientWidth, this.$el.clientHeight];
                };


                /**
                 * compute offsetLeft of g
                 */
                const compute_selection_offset_left = (selection) => {
                    // https://stackoverflow.com/questions/21990857/d3-js-how-to-get-the-computed-width-and-height-for-an-arbitrary-element

                    // for svg elements we can only use selection.node().getBBox()
                    // {
                    //     height: 5,
                    //         width: 5,
                    //     y: 50,
                    //     x: 20
                    // }
                    return selection.node().getBBox().x;

                    // for html elements we can use selection.node().getBoundingClientRect()
                    // left, right
                    // top, bottom
                    // height, width
                };


                /**
                 * compute offsetTop of g
                 */
                const compute_selection_offset_top = (selection) => {
                    return selection.node().getBBox().y;
                };


                /**
                 * calculate d3.selection's width and height
                 *
                 * https://stackoverflow.com/questions/21990857/d3-js-how-to-get-the-computed-width-and-height-for-an-arbitrary-element/42247372
                 * @param selection
                 */
                const compute_selection_w_h = (selection) => {
                    return [selection.node().getBBox().width,
                        selection.node().getBBox().height];
                };

                // start to calculate, to draw
                const data = {
                    nodes: this.nodes,
                    links: this.links,
                };

                // options by default
                const {
                    nodeWidth = 20,
                    nodeText = 'font-size: .8rem; font-weight: 600;',
                    circularLinkGap = 4,
                    circularLinkColor = 'red',
                    linkColor = 'black',
                    arrowLength = 10,
                    gapLength = 150,
                    arrowHeadSize = 4
                } = this.options;

                // calculate width and height of chart container
                const [c_w, c_h] = compute_w_h();

                if (c_w === 0 || c_h === 0 || Number.isNaN(c_w) || Number.isNaN(c_h)) {
                    throw new Error('please confirm that sankey container has correct width and height');
                    return;
                }

                const nodeTitle = this.nodeTitle;
                const linkTitle = this.linkTitle;

                const sankey = d3.sankeyCircular()
                    .nodeWidth(nodeWidth)
                    .nodePaddingRatio(0.5)
                    .size([c_w, c_h])
                    .nodeId(d => d.name)
                    .nodeAlign(d3.sankeyJustify)
                    .iterations(32)
                    .circularLinkGap(circularLinkGap);

                const svg = d3
                    .select(this.$el)
                    .append('svg')
                    // .attr("viewBox", `0 0 ${width} ${height}`)
                    // .attr("preserveAspectRatio", "xMinYMax meet")
                    .attr('width', c_w)
                    .attr('height', c_h);

                // keep the reference of g so that we can align it after all the calcul
                const g = svg
                    .append('g');

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
                    .domain([0, c_w]);

                const node = nodeG
                    .data(sankeyNodes)
                    .enter()
                    .append('g');

                node
                    .append('rect')
                    .attr('x', d => d.x0)
                    .attr('y', d => d.y0)
                    .attr('height', d => d.y1 - d.y0)
                    .attr('width', d => d.x1 - d.x0)
                    .style('fill', d => nodeColour(d.x0))
                    .style('opacity', 0.5)
                    .on('mouseover', (d) => {
                        const thisName = d.name;

                        node
                            .selectAll('rect')
                            .style('opacity', d => highlightNodes(d, thisName));

                        d3
                            .selectAll('.sankey-link')
                            .style('opacity', l => (l.source.name === thisName || l.target.name === thisName ? 1 : 0.3));

                        node
                            .selectAll('text')
                            .style('opacity', d => highlightNodes(d, thisName));
                    })
                    .on('mouseout', (d) => {
                        d3
                            .selectAll('rect')
                            .style('opacity', 0.5);

                        d3
                            .selectAll('.sankey-link')
                            .style('opacity', 0.7);

                        d3
                            .selectAll('text')
                            .style('opacity', 1);
                    });


                node
                    .append('text')
                    .attr('x', d => (d.x0 + d.x1) / 2)
                    .attr('y', d => d.y0 - 12)
                    .attr('dy', '0.35em')
                    .attr('text-anchor', 'middle')
                    .attr('style', nodeText)
                    .text(d => d.name);

                node
                    .append('title')
                    .text(nodeTitle);

                const link = linkG
                    .data(sankeyLinks)
                    .enter()
                    .append('g');

                link
                    .append('path')
                    .attr('class', 'sankey-link')
                    .attr('d', link => link.path)
                    .style('stroke-width', d => Math.max(1, d.width))
                    .style('opacity', 0.7)
                    .style('stroke', (link, i) => (link.circular ? circularLinkColor : linkColor));

                link
                    .append('title')
                    .text(linkTitle);

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
                const [g_w, g_h] = compute_selection_w_h(g);
                g.attr('transform', `translate(${(c_w - g_w) / 2 - compute_selection_offset_left(g)}, ${(c_h - g_h) / 2 - compute_selection_offset_top(g)})`);
            },
            ifExistsSvgThenRemove() {
                if (d3.select(this.$el).select('svg').empty()) {
                    return;
                }
                d3.select(this.$el).select('svg').remove();
            },
            safeDrawSankey() {
                this.ifExistsSvgThenRemove();
                this.drawSankey();
            }
        },
        watch: {
            nodes: {
                deep: true,
                handler(n, o) {
                    this.safeDrawSankey();
                }
            },
            links: {
                deep: true,
                handler(n, o) {
                    this.safeDrawSankey();
                }
            },
            options: {
                deep: true,
                handler(n, o) {
                    this.safeDrawSankey();
                }
            },
            width(n) {
                this.safeDrawSankey();
            },
            height(n) {
                this.safeDrawSankey();
            }
        },
        mounted() {
            // initialisation
            this.safeDrawSankey();

            this.listener = _.debounce(() => {
                this.safeDrawSankey();
            }, 500);

            window.addEventListener('resize', this.listener);
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.listener);
        }
    };
</script>

<style scoped>
    rect {
        /*make node rectangle edge more sharp*/
        /*https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/shape-rendering*/
        shape-rendering: crispEdges;
    }
</style>
