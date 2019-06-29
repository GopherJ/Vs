import * as d3 from 'd3';
import { isNumber, isDate, isString, debounce } from 'lodash';
import { hideTip, isTipShowing } from '../plugins/tooltip';

export default {
    data() {
        return {
            val: null
        }
    },
    props: {
        min: {
            type: [Number, Date, String],
            default: 1
        },
        max: {
            type: [Number, Date, String],
            default: 10
        },
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '100%'
        },
        margin: {
            type: Object,
            default: () => ({})
        },
        options: {
            type: Object,
            default: () => ({})
        }
    },
    methods: {
        isTheSameType(a, b) {
            return isNumber(a) && isNumber(b)
                || isDate(a) && isDate(b)
                || isString(a) && isString(b);
        },
        ifExistsSvgThenRemove() {
            const svgSelection = d3.select(this.$el).select('svg');
            if (svgSelection.empty()) return;

            svgSelection.remove();
        },
        getElWidthHeight() {
            return [
                this.$el.clientWidth,
                this.$el.clientHeight
            ];
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
            deep: true,
            handler() {
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
        this.$nextTick(this.safeDraw);

        this._handlerResize = debounce(this.onResize, 500);

        window.addEventListener('resize', this._handlerResize);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this._handlerResize);
        if (isTipShowing()) hideTip();
    }
};
