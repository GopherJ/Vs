import * as d3 from 'd3';

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
            default: () => ({
                left: 30,
                right: 30,
                top: 30,
                bottom: 30
            })
        }
    },
    methods: {
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
    mounted() {
        this._handleResize = (e) => {
            if (this.onResize) {
                this.onResize();
            }
        };

        window.addEventListener('resize', this._handleResize);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this._handleResize);
    }
};
