<template>
    <div class="d3-heat-map" :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import mixins from '../../mixins';
    import _ from 'lodash';

    export default {
        name: 'd3-heat-map',
        mixins: [mixins],
        methods: {
            drawHeatMap() {
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawHeatMap();
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
