/* eslint-disable */
import * as d3 from 'd3';
import { debounce, isFunction } from 'lodash';
import { hideTip, isTipShowing } from '../plugins/tooltip';

export default {
    data() {
        return {
            observer: null
        }
    },
    props: {
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '300px'
        },
        margin: {
            type: Object,
            default: () => ({})
        },
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
        ifExistsSvgThenRemove() {
            const svgSelection = d3.select(this.$el).select('svg');

            if (svgSelection.empty()) return;

            svgSelection.remove();
        },
        getElWidthHeight() {
            return [this.$el.clientWidth, this.$el.clientHeight];
        },
        getSelectionWidthHeight(selection) {
            return [
                selection.node().getBBox().width,
                selection.node().getBBox().height
            ];
        },
        getSelectionOffset(selection) {
            return [
                selection.node().getBBox().x,
                selection.node().getBBox().y
            ];
        }
    },
    watch: {
        width: {
            deep: false,
            handler(n) {
                this.$nextTick(() => {
                    this.safeDraw();
                });
            }
        },
        height: {
            deep: false,
            handler(n) {
                this.$nextTick(() => {
                    this.safeDraw();
                });
            }
        },
        margin: {
            deep: true,
            handler(n) {
                this.$nextTick(() => {
                    this.safeDraw();
                });
            }
        },
        data: {
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

        if (isFunction(window.MutationObserver)) {
            (this.observer = new MutationObserver(hideTip))
                .observe(this.$el, {childList: true, subtree: true});
        }

        this._handleResize = debounce(this.onResize, 500);

        window.addEventListener('resize', this._handleResize);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this._handleResize);

        (this.observer !== null) && this.observer.disconnect();

        if (isTipShowing) hideTip();
    }
};
