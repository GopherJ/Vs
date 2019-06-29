/* eslint-disable */
import * as d3 from 'd3';
import { debounce } from 'lodash';
import { hideTip, isTipShowing } from '../plugins/tooltip';

export default {
    props: {
        nodes: {
            type: Array,
            required: true,
            default: () => [],
        },
        links: {
            type: Array,
            required: true,
            default: () => [],
        },
        options: {
            type: Object,
            default: () => ({}),
        },
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '300px'
        },
        nodeTitle: {
            type: Function,
            default: d => `${d.name}<br>${d.value}`,
        },
        linkTitle: {
            type: Function,
            default: d => `${d.source.name} → ${d.target.name}<br>${d.value}`,
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
                selection.node().getBoundingClientRect().width,
                selection.node().getBoundingClientRect().height
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
        nodes: {
            deep: true,
            handler(n, o) {
                this.$nextTick(() => {
                    this.safeDraw();
                });
            }
        },
        links: {
            deep: true,
            handler(n, o) {
                this.$nextTick(() => {
                    this.safeDraw();
                });
            }
        },
        options: {
            deep: true,
            handler(n, o) {
                this.$nextTick(() => {
                    this.safeDraw();
                });
            }
        },
        width(n) {
            this.$nextTick(() => {
                this.safeDraw();
            });
        },
        height(n) {
            this.$nextTick(() => {
                this.safeDraw();
            });
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

        this.listener = debounce(this.onResize, 500);

        window.addEventListener('resize', this.listener);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.listener);
        if (isTipShowing()) hideTip();
    }
};
