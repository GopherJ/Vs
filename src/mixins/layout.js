/* eslint-disable */
import * as d3 from 'd3';
import _ from 'lodash';

export default {
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
        getChildElWidthHeight(selector) {
            const childNode = this.$el.querySelector(selector);

            return [this.$el.clientWidth - childNode.clientWidth, childNode.clientHeight];
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
                if(this.safeDraw) {
                    this.$nextTick(() => {
                        this.safeDraw();
                    });
                }
            }
        },
        margin: {
            deep: true,
            handler(n) {
                if(this.safeDraw) {
                    this.$nextTick(() => {
                        this.safeDraw();
                    });
                }
            }
        },
        data: {
            deep: true,
            handler(n) {
                if(this.safeDraw) {
                    this.$nextTick(() => {
                        this.safeDraw();
                    });
                }
            }
        },
        options: {
            deep: true,
            handler(n) {
                if (this.safeDraw) {
                    this.$nextTick(() => {
                        this.safeDraw();
                    });
                }
            }
        }
    },
    mounted() {
        if (!this.safeDraw) {
            return;
        }

        if (!this.getElWidthHeight().every(el => el > 0)) {
            return;
        }

        this._handleResize = _.debounce((e) => {
            if (this.onResize) {
                this.onResize();
            }
        }, 500);

        this.safeDraw();

        window.addEventListener('resize', this._handleResize);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this._handleResize);
    }
};
