<template>
    <div class="d3-heat-map" :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import _ from 'lodash';
    import moment from 'moment';
    import mixins from '../../mixins';
    import { showTip, hideTip } from '../../utils/tooltip';
    import isAxisTime from '../../utils/isAxisTime';

    export default {
        name: 'd3-heat-map',
        mixins: [mixins],
        methods: {
            calculateBinSize(g_w, g_h, paddingInner, paddingOuter, numX, numY) {
                const w = (g_w - g_w * paddingOuter * 2) / numX + (numX - 1) * paddingInner,
                    h = (g_h - g_h * paddingOuter * 2) / numY + (numY - 1) * paddingInner;

                return Math.min(w, h);
            },
            calculatePadding(paddingOuter, g_w, g_h) {
                return [paddingOuter * g_w, paddingOuter * g_h];
            },
            diffByDays(a, b) {
                return  moment(a).diff(moment(b), 'days');
            },
            calculateBinPos(date, dateMin, size, px, py) {
                return this.diffByDays(date, dateMin)
            },
            drawHeatMap() {
                const data = _.cloneDeep(this.data);

                const { left = 0, right = 0, top = 0, bottom = 0 } = this.margin,
                    {
                        isMonthLabelLaneShow = true,
                        isWeekDayLabelLaneShow = true,
                        isMarkerLaneShow = true,

                        fontSize = 12,
                        fontWeight = 400,
                        fontOpacity = 1,

                        paddingInner = 0.05,
                        paddingOuter = 0,

                        backgroundColor = '#ddd',
                        foregroundColor = 'green',

                        fillOpacity = 0.6,
                        strokeOpacity = 1,

                        bin ='rect'
                    } = this.options,
                    {
                        monthLabelLaneHeight = isMonthLabelLaneShow ? 60 : 0,
                        weekDayLabelLaneWidth = isWeekDayLabelLaneShow ? 60 : 0,
                        markerLaneHeight = isMarkerLaneShow ? 60 : 0
                    } = this.options,
                    [w, h] = this.getElWidthHeight(),
                    g_w = w - left - right - weekDayLabelLaneWidth,
                    g_h = h - top - bottom - markerLaneHeight - monthLabelLaneHeight,
                    [px, py] = this.calculatePadding(paddingOuter, g_w, g_h),
                    tickFormat = d3.timeFormat('%B %d, %Y'),
                    [dateMax, dateMin] = d3.extent(data, d => d.key),
                    numX = Math.ceil(this.diffByDays(dateMax, dateMin) / 7),
                    numY = 7,
                    dateStart = moment(dateMax).subtract(1, 'y'),
                    dateEnd = moment(dateMax);

                if (![g_w, g_h].every(el => el > 0)) {
                    return;
                }

                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);

                const g = svg
                    .append('g')
                    .attr('transform', `translate(${left + weekDayLabelLaneWidth}, ${top + monthLabelLaneHeight})`)
                    .attr('width', g_w)
                    .attr('height', g_h);

                const



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

    .d3-heatmap text {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: pointer;
    }
</style>
