<template>
    <div :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import d3Tip from 'd3-tip';
    import mixins from '../../mixins';
    import getGroupsData from '../../util/getGroupsData';

    // load d3-tip
    Object.assign(d3, {
        tip: d3Tip
    });

    export default {
        name: 'd3-timeline',
        mixins: [mixins],
        methods: {
            drawTimeline() {
                const [w, h] = this.getElWidthHeight(),
                      {left = 30, top = 30, right = 30, bottom = 30} = this.margin,
                      g_w = w - left - right,
                      g_h = h - top - bottom

            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawTimeline();
            }
        }
    }
</script>

<style>

</style>
