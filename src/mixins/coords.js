/* eslint-disable */
import * as d3 from "d3"
import { hideTip, isTipShowing } from "../plugins/tooltip"

export default {
    props: {
        width: {
            type: String,
            default: "100%",
        },
        height: {
            type: String,
            default: "300px",
        },
        data: {
            required: true,
            validator: prop =>
                Object.prototype.toString.call(prop) === "[object Object]" ||
                Object.prototype.toString.call(prop) === "[object Array]",
        },
        indoorMaps: {
            type: Array,
        },
        options: {
            type: Object,
            default: () => ({}),
        },
    },
    watch: {
        data: {
            deep: true,
            handler(n) {
                this.$nextTick(() => {
                    this.safeDraw()
                })
            },
        },
        indoorMaps: {
            deep: true,
            handler(n) {
                this.$nextTick(() => {
                    this.safeDraw()
                })
            },
        },
        options: {
            deep: true,
            handler(n) {
                this.$nextTick(() => {
                    this.safeDraw()
                })
            },
        },
    },
    activated() {
        const svgSelection = d3.select(this.$el).select("svg")

        if (svgSelection.empty()) {
            window.dispatchEvent(new Event("resize"))
        }
    },
    deactivated() {
        if (isTipShowing()) hideTip()
    },
    mounted() {
        setTimeout(this.safeDraw)
    },
    beforeDestroy() {
        if (isTipShowing()) hideTip()
    },
}
