<template>
    <div class="d3-table" :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import tip from 'd3-tip';
    import offset from 'document-offset';
    import _ from 'lodash';

    export default {
        name: 'd3-table',
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

        }
    }
</script>

<style scoped>
    @import url(../../css/index.css);
</style>
