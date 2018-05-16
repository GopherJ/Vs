<template>
    <div class="d3-metric" :style="{ 'width' : width, 'height' : height}"></div>
</template>

<script>
    import * as d3 from 'd3';
    import _ from 'lodash';
    import tip from 'd3-tip';
    import offset from 'document-offset';

    // load d3-tip
    Object.assign(d3, {
        tip
    });

    export default {
        name: 'd3-metric',
        props: {
            width: {
                type: String,
                default: '100%'
            },
            height: {
                type: String,
                default: '400px'
            },
            margin: {
                type: Object,
                default: () => ({})
            },
            data: {
                type: [Number, String],
                required: true
            },
            options: {
                type: Object,
                default: () => ({})
            }
        },
        methods: {
            getElWidthHeight() {
                return [this.$el.clientWidth, this.$el.clientHeight];
            },
            ifExistsSvgThenRemove() {
                const svgSelection = d3.select(this.$el).select('svg');

                if (svgSelection.empty()) {
                    return;
                }

                svgSelection.remove();
            },
            drawMetric() {
                // constants
                const data = this.data,
                    {
                        axisXLabel = 'key',
                        axisLabelFontSize = 12,
                        axisLabelFontWeight = 400,
                        axisLabelFontOpacity = 0.5,

                        metricLabelColor = 'black',
                        metricLabelFontSize = 120,
                        metricLabelFontWeight = 900,
                        metricLabelFontOpacity = 0.5,

                        metricTitle = d => `${d}`
                    } = this.options,
                    {
                        axisXLabelLaneHeight = _.isNull(axisXLabel) ? 0 : 30
                    } = this.options;

                const [w, h] = this.getElWidthHeight(),
                    {left = 0, top = 0, right = 0, bottom = 0} = this.margin,
                    g_w = w - left - right,
                    g_h = h - top - bottom - axisXLabelLaneHeight;

                if (![g_w, g_h].every(el => el > 0)) {
                    return;
                }

                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);

                const axisXLabelLane = svg
                    .append('g')
                    .attr('transform', `translate(${left}, ${top})`)
                    .attr('width', g_w)
                    .attr('height', axisXLabelLaneHeight);

                const g = svg
                    .append('g')
                    .attr('transform', `translate(${left}, ${top + axisXLabelLaneHeight})`)
                    .attr('width', g_w)
                    .attr('height', g_h);

                const tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([0, 0]);

                axisXLabelLane
                    .append('text')
                    .attr('text-anchor', 'middle')
                    .attr('x', g_w / 2)
                    .attr('y', axisXLabelLaneHeight / 2)
                    .attr('dy', '0.35em')
                    .text(axisXLabel)
                    .attr('fill', '#000')
                    .attr('fill-opacity', axisLabelFontOpacity)
                    .attr('font-size', axisLabelFontSize)
                    .attr('font-weight', axisLabelFontWeight);

                g.append('text')
                    .datum(data)
                    .attr('text-anchor', 'middle')
                    .attr('x', g_w / 2)
                    .attr('y', g_h / 2)
                    .attr('dy', '0.35em')
                    .text(typeof data === 'number' ? d3.format(',')(data).toString() : data)
                    .attr('fill', metricLabelColor)
                    .attr('fill-opacity', metricLabelFontOpacity)
                    .attr('font-size', metricLabelFontSize)
                    .attr('font-weight', metricLabelFontWeight)
                    .on('mouseover', (d) => {
                        g.call(tip);
                        tip.html(metricTitle(d));
                        tip.show();

                        const tipSelection = d3.select('.d3-tip');
                        tipSelection.style('top', `${offset(this).top - tipSelection.node().getBoundingClientRect().height - 10}px`);
                        tipSelection.style('left', `${offset(this).left + this.getBBox().width / 2 - tipSelection.node().getBoundingClientRect().width / 2}px`);
                    })
                    .on('mouseout', (_) => {
                        d3.selectAll('.d3-tip').remove();
                    });
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawMetric();
            },
            onResize() {
                this.safeDraw();
            }
        },
        watch: {
            width: {
                deep: false,
                handler(n) {
                    this.$nextTick(() => {
                        this.safeDraw();
                    });
                }
            },
            height: {
                deep: false,
                handler(n) {
                    if (this.safeDraw) {
                        this.$nextTick(() => {
                            this.safeDraw();
                        });
                    }
                }
            },
            margin: {
                deep: true,
                handler(n) {
                    if (this.safeDraw) {
                        this.$nextTick(() => {
                            this.safeDraw();
                        });
                    }
                }
            },
            data: {
                deep: false,
                handler(n) {
                    if (this.safeDraw) {
                        this.$nextTick(() => {
                            this.safeDraw();
                        });
                    }
                }
            },
            options: {
                deep: true,
                handler(n) {
                    if (this.safeDraw) {
                        this.$nextTick(() => {
                            this.safeDraw();
                        });
                    }
                }
            }
        },
        mounted() {
            // container must have width and height
            if (!this.getElWidthHeight().every(el => el > 0)) {
                return;
            }

            // debounce to avoid continue resize
            this._handleResize = _.debounce((e) => {
                this.onResize();
            }, 500);

            // check if svg exists in current component
            // if exists then remove it and draw the graph
            this.safeDraw();

            window.addEventListener('resize', this._handleResize);
        },
        beforeDestroy() {
            window.removeEventListener('resize', this._handleResize);
        }
    }
</script>

<style>
    @import url(../../css/index.css);

    .d3-metric text {
        cursor: pointer;

        /*https://stackoverflow.com/questions/3949103/css-font-weight-thicker-than-900*/
        /*text-shadow: 1px 0;*/
    }
</style>
