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
        indoorZones: {
            type: Object
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
                if (!this.safeDraw) return;

                this.safeDraw();
            }
        },
        indoorMaps: {
            deep: true,
            handler(n) {
                if (!this.safeDraw) return;

                this.safeDraw();
            }
        },
        indoorZones: {
            deep: true,
            handler(n) {
                if (!this.safeDraw) return;

                this.safeDraw();
            }
        },
        options: {
            deep: true,
            handler(n) {
                if (!this.safeDraw) return;

                this.safeDraw();
            }
        }
    },
    mounted() {
        if (!this.safeDraw) return;

        this.safeDraw();
    }
};
