<template>
    <div :style="{ 'width' : width, 'height' : height }" class="d3-time-line"></div>
</template>

<script>
    import * as d3 from 'd3';
    import * as tip from 'd3-tip';
    import mixins from '../../mixins';
    import getGroupsData from '../../util/getGroupsData';

    export default {
        name: 'd3-timeline',
        mixins: [mixins],
        methods: {
            drawTimeline() {
                const [w, h] = this.getElWidthHeight(),
                    data = this.data,
                    {left = 0, top = 0, right = 0, bottom = 0} = this.margin,
                    {
                        // group config
                        groupLabelFontSize = 14,
                        groupLabelFontWeight = 400,
                        groupLabelWidth = 60,
                        groupLaneHeight = 200,

                        // axisX config
                        axisXHeight = 30,
                        axisXFontSize = 12,
                        axisXFontWeight = 400,



                    } = this.options,
                    g_w = w - left - right,
                    g_h = h - top - bottom

            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawTimeline();
            },
            onResize() {
                this.safeDraw();
            }
        }
    }
</script>

<style>
    @import url(../../css/index.css);
</style>
