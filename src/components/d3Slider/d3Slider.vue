<template>
    <div class="d3-slider" :style="{ 'width' : width, 'height': height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import { showTip, hideTip } from '../../utils/tooltip';

    export default {
        name: 'd3-slider',
        props: {
            min: {
                type: [Number, Date],
                default: 1
            },
            max: {
                type: [Number, Date],
                default: 10
            },
            width: {
                type: String,
                default: '100%'
            },
            height: {
                type: String,
                default: '400px'
            },
            margin: {
                type: Object
            }
        },
        methods: {
            ifExistsSvgThenRemove() {
                const svgSelection = d3.select(this.$el).select('svg');
                if (svgSelection.empty()) {
                    return;
                }

                svgSelection.remove();
            },
            getElWidthHeight() {
                return [this.$el.clientWidth, this.$el.clientHeight];
            },
            drawSlider() {
                const min = this.min,
                    max = this.max;

                const [w, h] = this.getElWidthHeight(),


            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawSlider();
            },
            onResize() {
                this.safeDraw();
            }
        },
        watch: {
            width() {
                this.$nextTick(() => {
                    this.safeDraw();
                });
            },
            height() {
                this.$nextTick(() => {
                    this.safeDraw();
                });
            },
            min() {
                this.$nextTick(() => {
                    this.safeDraw();
                });
            },
            max() {
                this.$nextTick(() => {
                    this.safeDraw();
                });
            },
            margin: {
                deep: true
            }
        },
        mounted() {

        }
    }
</script>

<style>
</style>

