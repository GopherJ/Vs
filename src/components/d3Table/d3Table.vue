<template>
    <div class="d3-table" :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import tip from 'd3-tip';
    import mixins from '../../mixins';
    import offset from 'document-offset';
    import _ from 'lodash';

    Object.assign(d3, {
        tip
    });

    const GetAllKeys = (data) => data.reduce((ite, cur) => {
        const keys = Object.keys(cur);

        for (let i = 0, l = keys.length; i < l; i += 1) {
            ite.add(keys[i]);
        }

        return ite;
    }, new Set);

    export default {
        name: 'd3-table',
        mixins: [mixins],
        data() {
            return {
                curPage: 1
            }
        },
        methods: {
            drawTable() {
                const data = _.cloneDeep(this.data),
                    keys = GetAllKeys(data),
                    totalPage = data.length;

                const {left = 0, right = 0, top = 0, bottom = 0} = this.margin,




            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawTable();
            },
            onResize() {
                this.safeDraw();
            }
        }
    }
</script>

<style>
    @import url(../../css/index.css);
</style>
