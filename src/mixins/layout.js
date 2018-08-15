/* eslint-disable */
import * as d3 from 'd3';
import { debounce } from 'lodash';
import { hideTip } from '../plugins/tooltip';

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
            default: '400px'
        },
        margin: {
            type: Object,
            default: () => ({})
        },
        data: {
            type: Object,
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

            if (svgSelection.empty()) {
                return;
            }

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
    mounted() {
        this.observer = new MutationObserver(_ => {
            hideTip();
        }).observe(this.$el, { childList: true });

        this._handleResize = debounce((e) => {
            if (this.onResize) this.onResize();
        }, 500);

        this.$nextTick(() => this.safeDraw());

        window.addEventListener('resize', this._handleResize);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this._handleResize);

        this.observer.disconnect();
    }
};
