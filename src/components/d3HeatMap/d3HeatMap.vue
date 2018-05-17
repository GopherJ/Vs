<template>
    <div class="d3-heat-map" :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import tip from 'd3-tip';
    import mixins from '../../mixins';
    import offset from 'document-offset';
    import _ from 'lodash';

    Object.assign(d3, {
        tip
    });

    const timeFormat = "%B %d, %Y";

    const keyFormat = (key) => {
        return typeof key === 'number' ? new Date(key) : key;
    };

    export default {
        name: 'd3-heat-map',
        mixins: [mixins],
        methods: {
            drawHeatMap() {
                const _data = _.cloneDeep(this.data),
                    [minDate, maxDate] = d3.extent(_data, d => keyFormat(d.key))
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
