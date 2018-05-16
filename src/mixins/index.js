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
            type: Array,
            required: true
        },
        options: {
            type: Object,
            default: () => ({})
        }
    },
    methods: {
        // will be used by horizontal bar
        selectPaddingInnerOuterX(width) {
            let paddingInner, paddingOuter = 0.1;

            // desktop or plus
            if (width > 970) {
                paddingInner = 0.1;
            }

            // tablet
            if (width >= 560 && width <= 970) {
                paddingInner = 0.15;
            }

            // mobile
            if (width < 560) {
                paddingInner = 0.2;
            }

            return [paddingInner, paddingOuter];
        },
        // will be used by vertical bar
        selectPaddingInnerOuterY(height) {
            let paddingInner, paddingOuter = 0.1;

            if (height > 970) {
                paddingInner = 0.1;
            }

            if (height > 560 && height <= 970) {
                paddingInner = 0.3;
            }

            if (height < 560) {
                paddingInner = 0.5;
            }

            return [paddingInner, paddingOuter];
        },
        selectTicksNumY(height) {
            let ticksY;

            if (height > 400) {
                ticksY = 10;
            }

            if (height > 200 && height <= 400) {
                ticksY = 5;
            }

            if (height <= 200 && height > 100) {
                ticksY = 3;
            }

            if (height <= 100) {
                ticksY = 2;
            }

            if (height <= 50) {
                ticksY = 1;
            }

            return ticksY;
        },
        selectTicksNumX(width) {
            let ticksX;

            // desktop or plus
            if (width > 960) {
                ticksX = 10;
            }

            // tablet
            if (width >= 560 && width <= 960) {
                ticksX = 5;
            }

            // mobile
            if (width < 560) {
                ticksX = 2
            }

            return ticksX;
        },
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
        // need safeDraw exists
        // need data exists
        if (!this.safeDraw || this.data.length === 0) {
            return;
        }

        // container must have width and height
        if (!this.getElWidthHeight().every(el => el > 0)) {
            return;
        }

        // debounce to avoid continue resize
        this._handleResize = _.debounce((e) => {
            // if onResize exists then use it
            if (this.onResize) {
                this.onResize();
            }
        }, 500);

        // check if svg exists in current component
        // if exists then remove it and draw the graph
        this.safeDraw();

        window.addEventListener('resize', this._handleResize);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this._handleResize);
    }
};
