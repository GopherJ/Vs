<template>
    <div :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import d3Tip from 'd3-tip';
    import mixins from '../../mixins';

    // load d3-tip
    Object.assign(d3, {
        tip: d3Tip
    });
    // data set
    // {
    //     group: String,
    //     from: Date,
    //     to: Date,
    //     label: String,
    // }
    // {
    //     group: String,
    //         at: Date,
    //     title: String
    // }

    export default {
        name: 'd3-timeline',
        mixins: [mixins],
        props: {
            data: {
                type: Array,
                required: true
            },
            options: {
                type: Object,
                default: () => ({})
            }
        },
        methods: {
            getGroups(data) {

            },
            drawTimeline() {

            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawTimeline();
            }
        },
        watch: {
            data: {
                deep: true,
                handler(n) {
                    this.safeDraw();
                }
            },
            options: {
                deep: true,
                handler(n) {
                    this.safeDraw();
                }
            }
        }
    }
</script>

<style>

</style>
