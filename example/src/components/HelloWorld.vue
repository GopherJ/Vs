<template>
    <div class="section">
        <div class="box">
            <d3-metric :data="metricData"></d3-metric>
        </div>
        <div class="box">
            <d3-multi-line :data="multiLineData"></d3-multi-line>
        </div>
        <div class="box">
            <d3-circle :data="0.3"></d3-circle>
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
                    key: '1',
                    value: 10
                },
                {
                    group: 'b',
                    key: '1',
                    value: 20
                },{
                    group: 'c',
                    key: '1',
                    value: 30
                },{
                    group: 'a',
                    key: '2',
                    value: 20
                },{
                    group: 'c',
                    key: '2',
                    value: 10
                },
                {
                    group: 'd',
                    key: '1',
                    value: 20
                },{
                    group: 'd',
                    key: '2',
                    value: 40
                },
                {
                    group: 'b',
                    key: '2',
                    value: 30
                },{
                    group: 'a',
                    key: '3',
                    value: 50
                },
                    {
                    group: 'a',
                    key: '4',
                    value: 10
                },
                {
                    group: 'b',
                    key: '3',
                    value: 20
                },{
                    group: 'b',
                    key: '4',
                    value: 30
                },{
                    group: 'a',
                    key: '5',
                    value: 20
                }
                ]
            }
        }
    }
</script>

<style scoped>
</style>
