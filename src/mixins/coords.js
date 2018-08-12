/* eslint-disable */

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
        data: {
            type: Array,
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
    mounted() {
        this.$nextTick(() => this.safeDraw());
    }
};
