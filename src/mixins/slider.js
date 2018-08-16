import * as d3 from 'd3';
import { isNumber, isDate, isString, debounce } from 'lodash';

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
    mounted() {
        this._handlerResize = debounce((e) => {
            if (this.onResize) this.onResize();
        }, 500);

        this.$nextTick(() => this.safeDraw());

        window.addEventListener('resize', this._handlerResize);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this._handlerResize);
    }
};
