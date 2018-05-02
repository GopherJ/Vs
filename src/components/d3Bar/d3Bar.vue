<template>
    <div :style="{ 'width' : width, 'height' : height }" class="d3-bar"></div>
</template>

<script>
/* eslint-disable */
    import * as d3 from 'd3';
    import tip from 'd3-tip';
    import mixins from '../../mixins';
    import wrap from '../../util/wrapLongLabel';
    import _ from 'lodash';
    import offset from 'document-offset';

    // load tip
    Object.assign(d3, {
        tip
    });

    export default {
        name: 'd3-bar',
        mixins: [mixins],
        methods: {
            drawBar() {
                // container width and height
                const [w, h] = this.getElWidthHeight();

                // constants
                const data = _.cloneDeep(this.data),
                      {
                          // bar config
                          fill = '#6eadc1',
                          stroke = '#6eadc1',
                          fillOpacity = 0.6,
                          strokeOpacity = 1,
                          barTitle = d => d.value,

                          // axis font config
                          axisFontSize = 12,
                          axisFontWeight = 400,

                          // axis label config
                          axisYLabel = 'Value',
                          axisXLabel = 'Key',
                          axisXLabelHeight = 20,
                          axisYLabelWidth = 20,

                          // axis label font config
                          axisLabelFontSize = 12,
                          axisLabelFontWeight = 400,
                          axisLabelFontOpacity = 0.5,

                          // axis lane config
                          axisXHeight = 25,
                          axisYWidth = 35,

                          isVertical = false,
                      } = this.options,
                      {left = isVertical ? 30 : 0, right = 0, top = isVertical ? 0 : 20, bottom = 0} = this.margin,
                      g_w = w - left - right - axisYLabelWidth - axisYWidth,
                      g_h = h - top - bottom - axisXHeight - axisXLabelHeight;

                // create svg
                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', `${w}`)
                    .attr('height', `${h}`);

                // // tooltip
                const tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([0, 0]);

                // initialisation x, y scales
                let x, y, axisX, axisY, ticks, paddingInner, paddingOuter;

                // horizontal bar
                if (!isVertical) {

                    ticks = this.selectTicksNumY(g_h);
                    [paddingInner, paddingOuter] = this.selectPaddingInnerOuterX(g_w);
                    x = d3.scaleBand().range([0, g_w]).paddingInner([paddingInner]).paddingOuter([paddingOuter]);
                    y = d3.scaleLinear().range([g_h, 0]);
                    x.domain(data.map(d => d.key));
                    y.domain([0, d3.max(data, d => d.value)]).nice();

                    // create g to contain our graph
                    const g = svg
                        .append('g')
                        .attr('transform', `translate(${left + axisXLabelHeight + axisYWidth}, ${top})`)
                        .attr('width', `${g_w}`)
                        .attr('height', `${g_h}`);

                    // draw x
                    axisX = svg.append('g')
                        .attr('transform', `translate(${left + axisYLabelWidth + axisYWidth},${top + g_h})`)
                        .attr('width', g_w)
                        .attr('height', axisXHeight)
                        .append('g')
                        .attr('class', 'axis axis--x')
                        .call(d3.axisBottom(x))
                        .attr('font-size', axisFontSize)
                        .attr('font-weight', axisFontWeight)
                        // wrap text
                        .selectAll('.tick text')
                        .call(wrap, x.bandwidth());

                    // draw y
                    axisY = svg.append('g')
                        .attr('transform', `translate(${left + axisYLabelWidth}, ${top})`)
                        .attr('width', axisYLabelWidth)
                        .attr('height', g_h)
                        .append('g')
                        .attr('class', 'axis axis--y')
                        .attr('transform', `translate(${axisYWidth}, 0)`)
                        .call(d3.axisLeft(y).ticks(ticks))
                        .attr('font-size', axisFontSize)
                        .attr('font-weight', axisFontWeight);


                    // create lane to hold the label of axis x
                    const axisXLabelLane = svg
                        .append('g')
                        .attr('transform', `translate(${left + axisYLabelWidth + axisYWidth}, ${top + g_h + axisXHeight})`)
                        .attr('width', g_w)
                        .attr('height', axisXHeight);

                    // create lane to hold the label of axis y
                    const axisYLabelLane = svg
                        .append('g')
                        .attr('transform', `translate(${left}, ${top})`)
                        .attr('width', axisYLabelWidth)
                        .attr('height', g_h);


                    // start drawing
                    g.selectAll('.bar')
                        .data(data)
                        .enter()
                        .append('rect')
                        .attr('class', 'bar')
                        .attr('x', d => x(d.key))
                        .attr('y', d => y(d.value))
                        .attr('width', x.bandwidth())
                        .attr('height', d => g_h - y(d.value))
                        .attr('fill', fill)
                        .attr('stroke', stroke)
                        .attr('fill-opacity', fillOpacity)
                        .attr('stroke-opacity', strokeOpacity)
                        .on('mouseover', function(d, i) {
                            g.call(tip);
                            tip.html(barTitle(d));
                            tip.show();

                            const tipSelection = d3.select('.d3-tip');
                            tipSelection.style('top', `${offset(this).top - tipSelection.node().getBoundingClientRect().height - 10}px`);
                            tipSelection.style('left', `${offset(this).left + this.getBBox().width/2 - tipSelection.node().getBoundingClientRect().width/2}px`);
                        })
                        .on('mouseout', function(d, i) {
                            // tip.hide();
                            d3.selectAll('.d3-tip').remove();
                        });

                    // create label of the axis x
                    axisXLabelLane
                        .append('text')
                        .attr('class', 'label--x')
                        .attr('x', g_w/2)
                        .attr('y', axisXLabelHeight/2)
                        .attr('text-anchor', 'middle')
                        .attr('fill', '#000')
                        .attr('fill-opacity', axisLabelFontOpacity)
                        .text(axisXLabel)
                        .attr('font-size', axisLabelFontSize)
                        .attr('font-weight', axisLabelFontWeight);

                    // create label of the axis y
                    axisYLabelLane
                        .append('text')
                        .attr('class', 'label--y')
                        .attr('transform', 'rotate(-90)')
                        .attr('y', axisYLabelWidth)
                        .attr('x', -g_h/2)
                        .attr('text-anchor', 'middle')
                        .attr('fill', '#000')
                        .attr('fill-opacity', axisLabelFontOpacity)
                        .text(axisYLabel)
                        .attr('font-size', axisLabelFontSize)
                        .attr('font-weight', axisLabelFontWeight);
                }

                // vertical bar
                else {

                    ticks = this.selectTicksNumX(g_w);
                    [paddingInner, paddingOuter] = this.selectPaddingInnerOuterY(g_h);
                    y = d3.scaleBand().range([0, g_h]).paddingInner([paddingInner]).paddingOuter([paddingOuter]);
                    x = d3.scaleLinear().range([0, g_w]);
                    y.domain(data.map(el => el.key));
                    x.domain([0, d3.max(data, d => d.value)]).nice();

                    // create g to contain our graph
                    const g = svg
                        .append('g')
                        .attr('transform', `translate(${left + axisYLabelWidth + axisYWidth}, ${top + axisXHeight + axisXLabelHeight})`)
                        .attr('width', `${g_w}`)
                        .attr('height', `${g_h}`);

                    // draw x
                    axisX = svg.append('g')
                        .attr('transform', `translate(${left + axisYLabelWidth + axisYWidth}, ${top + axisXLabelHeight})`)
                        .attr('width', g_w)
                        .attr('height', axisXHeight)
                        .append('g')
                        .attr('class', 'axis axis--x')
                        .attr('transform', `translate(0, ${axisXHeight})`)
                        .call(d3.axisTop(x).ticks(ticks))
                        .attr('font-size', axisFontSize)
                        .attr('font-weight', axisFontWeight);

                    // draw y
                    axisY = svg.append('g')
                        .attr('transform',  `translate(${left + axisYLabelWidth}, ${top + axisXHeight + axisXLabelHeight})`)
                        .attr('width', axisYLabelWidth)
                        .attr('height', g_h)
                        .append('g')
                        .attr('class', 'axis axis--y')
                        .attr('transform', `translate(${axisYWidth}, 0)`)
                        .call(d3.axisLeft(y))
                        .attr('font-size', axisFontSize)
                        .attr('font-weight', axisFontWeight);

                    // create the lane to hold the label of axis x
                    const axisXLabelLane = svg
                        .append('g')
                        .attr('transform', `translate(${left + axisYLabelWidth + axisYWidth}, ${top})`)
                        .attr('width', g_w)
                        .attr('height', axisXLabelHeight);

                    // create the lane to hold the label of axis y
                    const axisYLabelLane = svg
                        .append('g')
                        .attr('transform', `translate(${left}, ${top + axisXHeight + axisXLabelHeight})`)
                        .attr('width', axisYLabelWidth)
                        .attr('height', g_h);


                    // start drawing
                    g.selectAll('.bar')
                        .data(data)
                        .enter()
                        .append('rect')
                        .attr('class', 'bar')
                        .attr('y', d => y(d.key))
                        .attr('height', y.bandwidth())
                        .attr('width', d => x(d.value))
                        .attr('fill', fill)
                        .attr('stroke', stroke)
                        .attr('fill-opacity', fillOpacity)
                        .attr('stroke-opacity', strokeOpacity)
                        .on('mouseover', function(d, i) {
                            g.call(tip);
                            tip.html(barTitle(d));
                            tip.show();


                            const tipSelection = d3.select('.d3-tip');
                            tipSelection.style('top', `${offset(this).top - tipSelection.node().getBoundingClientRect().height - 10}px`);
                            tipSelection.style('left', `${offset(this).left + this.getBBox().width/2 - tipSelection.node().getBoundingClientRect().width/2}px`);
                        })
                        .on('mouseout', function(d, i) {
                            // tip.hide();
                            d3.selectAll('.d3-tip').remove();
                        });

                    // draw the label of axis x
                    axisXLabelLane
                        .append('text')
                        .attr('class', 'label--x')
                        .attr('text-anchor', 'middle')
                        .attr('x', g_w/2)
                        .attr('y', axisXHeight/2)
                        .attr('fill', '#000')
                        .attr('fill-opacity', axisLabelFontOpacity)
                        .text(axisYLabel)
                        .attr('font-size', axisLabelFontSize)
                        .attr('font-weight', axisLabelFontWeight);

                    // draw the label of axis y
                    axisYLabelLane
                        .append('text')
                        .attr('class', 'label--y')
                        .attr('text-anchor', 'middle')
                        .attr('transform', 'rotate(-90)')
                        .attr('fill', '#000')
                        .attr('fill-opacity', axisLabelFontOpacity)
                        .attr('y', 0)
                        .attr('x', -g_h/2)
                        .text(axisXLabel)
                        .attr('font-size', axisLabelFontSize)
                        .attr('font-weight', axisLabelFontWeight);
                }

            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawBar();
            },
            onResize() {
                this.safeDraw();
            }
        }
    }
</script>

<style>
    @import url(../../css/index.css);

    .d3-bar .bar:hover {
        cursor: pointer;
    }
</style>
