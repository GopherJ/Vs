<template>
    <div class="d3-multi-line" :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import tip from 'd3-tip';
    import mixins from '../../mixins';
    import classifyGroup from '../../util/classifyGroup';
    import _ from 'lodash';
    import offset from 'document-offset';

    // load tip
    Object.assign(d3, {
        tip
    });

    // all keys
    const GetAllKeys = (data) => [...new Set(data.map(d => d.key))];

    export default {
        name: 'd3-multi-Line',
        mixins: [mixins],
        methods: {
            drawMultiLine() {
                // constants
                const _data = _.cloneDeep(this.data),
                    data = classifyGroup(_data, 'group'),
                    groups = Object.keys(data),
                    {left = 0, top = 0, right = 0, bottom = 0} = this.margin,
                    {
                        strokeWidth = 2,
                        circleRadius = 5,
                        circleTitle = d => `${d.value}`,

                        axisXLabelLaneHeight = 30,
                        axisYLabelLaneWidth = 30,

                        axisXLabel = 'key',
                        axisYLabel = 'Value',

                        axisXGroupLabelLaneHeight = 30,
                        axisXGroupLabelWidth = 15,
                        axisXGroupLabelFillColorOpacity = 1,
                        axisXGroupLabelBorderColorOpacity = 0.6,

                        axisLabelFontSize = 12,
                        axisLabelFontWeight = 400,
                        axisLabelFontOpacity = 0.5,

                        axisXLaneHeight = 30,
                        axisYLaneWidth = 40,

                        axisFontSize = 12,
                        axisFontWeight = 400,
                        axisFontOpacity = 0.5,

                        isAxisXTime = false,

                        curve = 'curveCardinal',
                    } = this.options;


                const [w, h] = this.getElWidthHeight(),
                    g_w = w - left - right - axisYLabelLaneWidth - axisYLaneWidth,
                    g_h = h - top - bottom - axisXLabelLaneHeight - axisXLaneHeight - axisXGroupLabelLaneHeight;

                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);

                const schemeCategory20 = d3.scaleOrdinal()
                    .domain(groups)
                    .range(d3.schemeCategory20);

                const axisXGroupLabelLane = svg.append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth + axisYLaneWidth}, ${top})`)
                    .attr('width', g_w)
                    .attr('height', axisXGroupLabelLaneHeight);

                const axisYLabelLane = svg.append('g')
                    .attr('transform', `translate(${left}, ${top + axisXGroupLabelLaneHeight})`)
                    .attr('width', axisYLabelLaneWidth)
                    .attr('height', g_h);

                const axisXLabelLane = svg.append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth + axisYLaneWidth}, ${top + axisXGroupLabelLaneHeight + g_h + axisXLaneHeight})`)
                    .attr('width', g_w)
                    .attr('height', axisXLabelLaneHeight);

                const axisYLane = svg.append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth}, ${top + axisXGroupLabelLaneHeight})`)
                    .attr('width', axisYLaneWidth)
                    .attr('height', g_h);

                const axisXLane = svg.append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth + axisYLaneWidth}, ${top + axisXGroupLabelLaneHeight + g_h})`)
                    .attr('width', g_w)
                    .attr('height', axisXLaneHeight);

                const tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([0, 0]);

                const g = svg.append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth + axisYLaneWidth}, ${top + axisXGroupLabelLaneHeight})`)
                    .attr('width', g_w)
                    .attr('height', g_h);

                // draw groups
                const GroupLabelContainer = axisXGroupLabelLane
                    .append('g');

                let previousPos;
                GroupLabelContainer
                    .selectAll('.label .label--group')
                    .data(groups)
                    .enter()
                    .append('g')
                    .each(function (d, i) {
                        const _g = d3.select(this);

                        let label;
                        label = _g.append('rect')
                            .attr('width', axisXGroupLabelWidth)
                            .attr('height', axisXGroupLabelLaneHeight)
                            .attr('fill', d => schemeCategory20(d))
                            .attr('fill-opacity', axisXGroupLabelFillColorOpacity)
                            .attr('stroke', d => schemeCategory20(d))
                            .attr('stroke-opacity', axisXGroupLabelBorderColorOpacity);

                        const labelPos = label.node().getBBox();

                        _g.append('text')
                            .attr('text-anchor', 'start')
                            .attr('x', labelPos.x + labelPos.width)
                            .attr('y', axisXGroupLabelLaneHeight / 2)
                            .attr('dy', '0.35em')
                            .text(d);

                        if (i !== 0) {
                            _g.attr('transform', `translate(${previousPos.x + previousPos.width}, 0)`);
                        }

                        previousPos = _g.node().getBBox();
                    });

                // align
                const GroupLabelContainerPos = GroupLabelContainer.node().getBBox();
                GroupLabelContainer
                    .attr('transform', `translate(${(g_w - GroupLabelContainerPos.width) / 2}, 0})`);

                axisXLabelLane
                    .append('text')
                    .attr('text-anchor', 'middle')
                    .attr('x', g_w / 2)
                    .attr('y', axisXLabelLaneHeight / 2 )
                    .attr('dy', '0.35em')
                    .text(axisXLabel)
                    .attr('fill', '#000')
                    .attr('fill-opacity', axisLabelFontOpacity)
                    .attr('font-size', axisLabelFontSize)
                    .attr('font-weight', axisLabelFontWeight);

                axisYLabelLane
                    .append('text')
                    .attr('text-anchor', 'middle')
                    .attr('transform', 'rotate(-90)')
                    .attr('y', axisYLabelLaneWidth / 2)
                    .attr('x', -g_h / 2)
                    .text(axisYLabel)
                    .attr('fill', '#000')
                    .attr('fill-opacity', axisLabelFontOpacity)
                    .attr('font-size', axisLabelFontSize)
                    .attr('font-weight', axisLabelFontWeight);

                // scales
                const scaleY = d3.scaleLinear()
                    .domain(d3.extent(d3.map(_data, d => d.value)))
                    .range([g_h, 0]);

                let scaleX;
                if (_data.length !== 1) {
                    scaleX = isAxisXTime
                        ? d3.scaleTime().domain(d3.extent(d3.map(_data, d => typeof d === 'number' ? new Date(d.key) : d.key))).range([0, g_w])
                        : d3.scalePoint().domain(GetAllKeys(_data)).range([0, g_w]);
                }

                else {
                    scaleX = d3.scalePoint().domain(_data.map(d => d.key)).range([0, g_w]);
                }

                axisYLane
                    .call(d3.axisLeft(scaleY))
                    .attr('fill', '#000')
                    .attr('fill-opacity', axisFontOpacity)
                    .attr('font-size', axisFontSize)
                    .attr('font-weight', axisFontWeight);

                axisXLane
                    .call(d3.axisBottom(scaleX))
                    .attr('fill', '#000')
                    .attr('fill-opacity', axisFontOpacity)
                    .attr('font-size', axisFontSize)
                    .attr('font-weight', axisFontWeight);

                const lineGen = d3.line()
                    .x(d => scaleX(isAxisXTime ? (typeof d === 'number' ? new Date(d.key) : d.key) : d.key))
                    .y(d => scaleY(d.value))
                    .defined(d => d !== null && d !== undefined)
                    .curve(d3[curve]);


                    g.selectAll('path')
                        .data(groups)
                        .enter()
                        .append('path')
                        .attr('d', d => lineGen(data[d]))
                        .attr('fill', '#fff')
                        .attr('stroke', schemeCategory20(group))
                        .attr('stroke-width', strokeWidth);

                    g.selectAll('circle')
                        .data(_data)
                        .enter()
                        .append('circle')
                        .attr('cx', d => scaleX(d.key))
                        .attr('cy', d => scaleY(d.value))
                        .attr('r', circleRadius)
                        .attr('fill', d => schemeCategory20(d.group))
                        .on('mouseover', (d) => {
                            g.call(tip);
                            tip.html(circleTitle(d));
                            tip.show();

                            const tipSelection = d3.select('.d3-tip');
                            tipSelection.style('top', `${offset(this).top - tipSelection.node().getBoundingClientRect().height - 10}px`);
                            tipSelection.style('left', `${offset(this).left + this.getBBox().width/2 - tipSelection.node().getBoundingClientRect().width/2}px`);
                        })
                        .on('mouseout', (d) => {
                            d3.selectAll('.d3-tip').remove();
                        });
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawMultiLine();
            },
            onResize() {
                this.safeDraw();
            }
        }
    }
</script>

<style scoped>
    @import url(../../css/index.css);
</style>
