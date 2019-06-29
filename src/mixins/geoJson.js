/* eslint-disable */
import * as d3 from 'd3';
import { hideTip, isTipShowing } from '../plugins/tooltip';

export default {
    props: {
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '300px'
        },
        data: {
            type: Object,
            required: true
        },
        indoorMaps: {
            type: Array
        },
        options: {
            type: Object,
            default: () => ({})
        }
    },
    watch: {
        data: {
            deep: true,
            handler(n) {
                this.$nextTick(() => {
                    this.safeDraw();
                });
            }
        },
        indoorMaps: {
            deep: true,
            handler(n) {
                this.$nextTick(() => {
                    this.safeDraw();
                });
            }
        },
        options: {
            deep: true,
            handler(n) {
                this.$nextTick(() => {
                    this.safeDraw();
                });
            }
        }
    },
    activated() {
        const svgSelection = d3.select(this.$el).select('svg');

        if (svgSelection.empty()) {
            window.dispatchEvent(new Event('resize'));
        };
    },
    mounted() {
        setTimeout(this.safeDraw);
    },
    beforeDestroy() {
        if (isTipShowing()) hideTip();
    }
};
