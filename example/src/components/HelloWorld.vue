<template>
    <div class="section">
        <div class="box">
            <d3-metric :data="metricData"></d3-metric>
        </div>
        <div class="box">
            <d3-multi-line :data="multiLineData"></d3-multi-line>
        </div>
        <div class="box">
            <d3-horizontal-bar :data="multiLineData"></d3-horizontal-bar>
        </div>
        <div class="box">
            <d3-vertical-bar :data="multiLineData"></d3-vertical-bar>
        </div>
        <div class="box">
            <d3-circle :data="0.3"></d3-circle>
        </div>
        <div class="box">
            <d3-line :data="multiLineData"></d3-line>
        </div>
        <div class="box">
            <d3-pie :data="multiLineData"></d3-pie>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'HelloWorld',
        data() {
            return {
                metricData: 40000,
                multiLineData: [{
                    group: 'a',
                    key: new Date(2017, 6, 1),
                    value: 10,
                    children: [
                        {
                            key: 1,
                            value: 2,
                        },
                        {
                            key: 2,
                            value: 3,
                        },
                        {
                            key: 3,
                            value: 5
                        }
                    ]
                },
                {
                    group: 'b',
                    key: new Date(2017, 7, 1),
                    value: 20,
                    children: [
                        {
                            key: 'a',
                            value: 4
                        },
                        {
                            key: 'b',
                            value: 5
                        },
                        {
                            key: 'c',
                            value: 11
                        }
                    ]
                },{
                    group: 'c',
                    key: new Date(2017, 8, 1),
                    value: 30
                },{
                    group: 'a',
                    key: new Date(2017, 9, 1),
                    value: 20
                },{
                    group: 'c',
                    key: new Date(2017, 10, 1),
                    value: 10
                },
                {
                    group: 'd',
                    key: new Date(2017, 11, 1),
                    value: 20
                },{
                    group: 'd',
                    key: new Date(2017, 12, 1),
                    value: 40
                },
                {
                    group: 'b',
                    key: new Date(2018, 1, 1),
                    value: 30
                },{
                    group: 'a',
                    key: new Date(2018, 2, 1),
                    value: 50
                },
                    {
                    group: 'a',
                    key: new Date(2018, 3, 1),
                    value: 10
                },
                {
                    group: 'b',
                    key: new Date(2018, 4, 1),
                    value: 20
                },{
                    group: 'b',
                    key: new Date(2018, 5, 1),
                    value: 30
                },{
                    group: 'a',
                    key: new Date(2018, 6, 1),
                    value: 20
                }
                ]
            }
        }
    }
</script>

<style scoped>
</style>
