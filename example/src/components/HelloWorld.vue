<template>
    <div class="section">
        <div class="box">
            <d3-metric :data="metricData"></d3-metric>
        </div>
        <div class="box">
            <d3-multi-line :data="multiLineData"></d3-multi-line>
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
                    key: 'slas',
                    value: 10
                },
                {
                    group: 'b',
                    key: 'sajs',
                    value: 20
                },{
                    group: 'b',
                    key: 'wqw',
                    value: 30
                },{
                    group: 'a',
                    key: 'ppo',
                    value: 20
                }
                ]
            }
        }
    }
</script>

<style scoped>
</style>
