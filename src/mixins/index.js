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
                paddingInner = 0.3;
            }

            // mobile
            if (width < 560) {
                paddingInner = 0.5;
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
            if (d3.select(this.$el).select('svg').empty()) {
                return;
            }
            d3.select(this.$el).select('svg').remove();
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
                if(this.safeDraw) {
                    this.safeDraw();
                }
            }
        },
        height: {
            deep: false,
            handler(n) {
                if(this.safeDraw) {
                    this.safeDraw();
                }
            }
        },
        margin: {
            deep: true,
            handler(n) {
                if(this.safeDraw) {
                    this.safeDraw();
                }
            }
        },
        data: {
            deep: true,
            handler(n) {
                if(this.safeDraw) {
                    this.safeDraw();
                }
            }
        },
        options: {
            deep: true,
            handler(n) {
                if (this.safeDraw) {
                    this.safeDraw();
                }
            }
        }
    },
    mounted() {
        // initialisation
        if (!this.safeDraw || !this.data.length === 0) {
            return;
        }

        if (this.getElWidthHeight().some(el => !el)) {
            throw new Error('Invalid width or height');
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
