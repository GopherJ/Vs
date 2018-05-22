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

    const formatMonth = d3.timeFormat('%b');

    const formatWeekDay = d3.timeFormat('%a');

    const formatKey = (key) => typeof key === 'number' ? new Date(key) : key;

    const diffDays = (d1, d2) => {
        const date1 = formatKey(d1),
            date2 = formatKey(d2);

        if (date2.getFullYear() === date1.getFullYear() && date2.getMonth() === date1.getMonth() && date2.getDate() === date1.getDate()) {
            return 0;
        }

        return Math.ceil((date2 - date1) / 1000 * 60 * 60 * 24);
    };

    export default {
        name: 'd3-heat-map',
        mixins: [mixins],
        methods: {
            drawHeatMap() {
                const _data = _.cloneDeep(this.data);

                let minDate, maxDate;
                if (_data.length === 1) {

                }

                [minDate, maxDate] = d3.extent(_data, d => formatKey(d.key));


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
