<template>
    <div class="d3-circle" :style="{ 'width' : width, 'height' : height}"></div>
</template>

<script>
    import * as d3 from 'd3';
    import tip from 'd3-tip';
    import offset from 'document-offset';
    import _ from 'lodash';

    // load d3-tip
    Object.assign(d3, {
        tip
    });

    export default {
        name: 'd3-circle',
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
            drawCircle() {
                const data = _.cloneDeep(this.data),
                    { left = 0, top = 0, right = 0, bottom = 0 } = this.margin,
                    [w, h] = this.getElWidthHeight(),
                    g_w = w - left - right,
                    g_h = h - top - bottom,
                    outerRadius = Math.min(g_w, g_h) / 2,
                    {
                        innerRadiusRatio = 0.8,
                        circleForeground = 'rgb(230, 237, 244)',
                        circleBackground = 'rgb(0, 181, 241)',
                        label = '',
                        labelColor = 'rgb(0, 181, 241)',
                        labelFontSize = 18,
                        labelFontWeight = ,
                        labelFontOpacity = 0.1
                    } = this.options,
                    innerRadius = innerRadiusRatio * outerRadius;
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawCircle();
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
            if (this.getElWidthHeight().some(el => !el)) {
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

<style scoped>
</style>
