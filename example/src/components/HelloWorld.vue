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
        <d3-vertical-bar :data="multiLineData" @range-updated="(...args) => console(args)"></d3-vertical-bar>
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
        <div class="box">
            <d3-timeline :data="timelineData"></d3-timeline>
        </div>
        <div class="box">
            <d3-sankey-circular :nodes="nodes" :links="links"></d3-sankey-circular>
        </div>
        <div class="box">
            <d3-timelion :data="timelionData"></d3-timelion>
        </div>
        <div class="box">
            <d3-area :data="timelionData"></d3-area>
        </div>
        <div class="box">
            <d3-tracker ref="tracker" :data="sliderData" :height="'200px'" @reference-updated="(...x) => console(x)" @range-updated="(...x) => console(x)"></d3-tracker>
        </div>
        <div class="box">
            <button class="button" @click="$refs.tracker.setPause()">skjqlwj</button>
        </div>
        <div class="box">
            <d3-slider :min="new Date(2017, 1, 1)" :max="new Date(2018, 1, 1)" @drag-end="(...x) => console(x)"></d3-slider>
            <d3-slider min="brown" max="steelblue" @drag-end="(...x) => console(x)"></d3-slider>
            <d3-slider :min="1" :max="10" @drag-end="(...x) => console(x)"></d3-slider>
        </div>
        <div class="box">
            <d3-icicle :data="icicleData"> </d3-icicle>
        </div>
        <div class="box">
            <d3-sunburst :data="icicleData"></d3-sunburst>
        </div>
        <div class="box">
            <d3-tree :data="icicleData"></d3-tree>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'HelloWorld',
        data() {
            return {
                icicleData: {
  "key": "A1",
  "children": [
    {
      "key": "B1",
      "children": [
        {
          "key": "C1",
          "value": 100
        },
        {
          "key": "C2",
          "value": 300
        },
        {
          "key": "C3",
          "value": 200
        }
      ]
    },
    {
      "key": "B2",
      "value": 200
    }
  ]
},
                trackerData2:  [
    {
        "id": "e53b8392adbef393",
        "from": "2018-05-25T06:43:47.861Z",
        "to": "2018-05-25T08:19:59.110Z",
        "title": "Fri May 25 2018 08:00:00 GMT+0200 (Romance Daylight Time)<br>2376",
        "label": "e53b8392adbef393"
    },
    {
        "id": "e53b8392adbef393",
        "from": "2018-05-25T09:15:41.006Z",
        "to": "2018-05-25T09:18:17.530Z",
        "title": "Fri May 25 2018 10:30:00 GMT+0200 (Romance Daylight Time)<br>176",
        "label": "e53b8392adbef393"
    },
    {
        "id": "e53b8392adbef393",
        "from": "2018-05-25T11:35:35.627Z",
        "to": "2018-05-25T13:04:39.897Z",
        "title": "Fri May 25 2018 13:00:00 GMT+0200 (Romance Daylight Time)<br>482",
        "label": "e53b8392adbef393"
    },
    {
        "id": "e53b8392adbef393",
        "from": "2018-05-25T13:30:54.431Z",
        "to": "2018-05-25T15:47:06.449Z",
        "title": "Fri May 25 2018 15:30:00 GMT+0200 (Romance Daylight Time)<br>119",
        "label": "e53b8392adbef393"
    },
    {
        "id": "e53b8392adbef393",
        "from": "2018-05-25T16:02:49.980Z",
        "to": "2018-05-25T16:45:33.502Z",
        "title": "Fri May 25 2018 18:00:00 GMT+0200 (Romance Daylight Time)<br>81",
        "label": "e53b8392adbef393"
    }
],
                metricData: 40000,
                timelionData:
                    [
                        {
                            "key": 1492256104916,
                            "value": 24.92506528632471
                        },
                        {
                            "key": 1460720104916,
                            "value": 45.530455717461535
                        },
                        {
                            "key": 1429184104916,
                            "value": 24.99696518622455
                        },
                        {
                            "key": 1397648104916,
                            "value": 33.742346701920525
                        },
                        {
                            "key": 1366112104916,
                            "value": 50.885476964208124
                        },
                        {
                            "key": 1334576104916,
                            "value": 97.5477088909558
                        },
                        {
                            "key": 1303040104916,
                            "value": 33.382291611728334
                        },
                        {
                            "key": 1271504104916,
                            "value": 28.366296062876128
                        },
                        {
                            "key": 1239968104916,
                            "value": 29.342472731189762
                        },
                        {
                            "key": 1208432104916,
                            "value": 90.33312702499624
                        },
                        {
                            "key": 1176896104916,
                            "value": 59.940402493671584
                        },
                        {
                            "key": 1145360104916,
                            "value": 45.44284972156446
                        },
                        {
                            "key": 1113824104916,
                            "value": 39.22211220343625
                        },
                        {
                            "key": 1082288104916,
                            "value": 47.350360469506526
                        },
                        {
                            "key": 1050752104916,
                            "value": 82.17506150769812
                        },
                        {
                            "key": 1019216104916,
                            "value": 73.23478668070958
                        },
                        {
                            "key": 987680104916,
                            "value": 19.430658222096064
                        },
                        {
                            "key": 956144104916,
                            "value": 66.5497153800747
                        },
                        {
                            "key": 924608104916,
                            "value": 72.71574718462011
                        },
                        {
                            "key": 893072104916,
                            "value": 82.14376060333201
                        },
                        {
                            "key": 861536104916,
                            "value": 12.03999575121194
                        },
                        {
                            "key": 830000104916,
                            "value": 37.563018451724936
                        },
                        {
                            "key": 798464104916,
                            "value": 21.430084941162054
                        },
                        {
                            "key": 766928104916,
                            "value": 96.87931404425588
                        },
                        {
                            "key": 735392104916,
                            "value": 92.24499458760346
                        },
                        {
                            "key": 703856104916,
                            "value": 33.989890530846075
                        },
                        {
                            "key": 672320104916,
                            "value": 41.56191574651663
                        },
                        {
                            "key": 640784104916,
                            "value": 88.42507863314431
                        },
                        {
                            "key": 609248104916,
                            "value": 79.7337714588073
                        },
                        {
                            "key": 577712104916,
                            "value": 15.426651488665089
                        },
                        {
                            "key": 546176104916,
                            "value": 82.00658694240691
                        },
                        {
                            "key": 514640104916,
                            "value": 47.877006396984555
                        },
                        {
                            "key": 483104104916,
                            "value": 58.51417858515661
                        },
                        {
                            "key": 451568104916,
                            "value": 70.97849962601813
                        },
                        {
                            "key": 420032104916,
                            "value": 18.84709979159307
                        },
                        {
                            "key": 388496104916,
                            "value": 62.99109655054198
                        },
                        {
                            "key": 356960104916,
                            "value": 86.27531759375223
                        },
                        {
                            "key": 325424104916,
                            "value": 85.21505798341676
                        },
                        {
                            "key": 293888104916,
                            "value": 53.188691415121525
                        },
                        {
                            "key": 262352104916,
                            "value": 82.0492047136508
                        },
                        {
                            "key": 230816104916,
                            "value": 47.41213464562015
                        },
                        {
                            "key": 199280104916,
                            "value": 48.69480413928136
                        },
                        {
                            "key": 167744104916,
                            "value": 86.51890707255095
                        },
                        {
                            "key": 136208104916,
                            "value": 10.94680833660594
                        },
                        {
                            "key": 104672104916,
                            "value": 27.721588734413636
                        },
                        {
                            "key": 73136104916,
                            "value": 76.3437011339861
                        },
                        {
                            "key": 41600104916,
                            "value": 57.72031276286144
                        },
                        {
                            "key": 10064104916,
                            "value": 61.614975108268425
                        },
                        {
                            "key": -21471895084,
                            "value": 77.51061440096413
                        },
                        {
                            "key": -53007895084,
                            "value": 92.47637856894694
                        }
                    ].map(x => ({
                        key: new Date(x.key),
                        value: x.value
                    })),

                nodes: [
                    {
                        "name": "OUTSIDE_ALL_ZONES"
                    },
                    {
                        "name": "sales"
                    },
                    {
                        "name": "tech"
                    },
                    {
                        "name": "coffee"
                    }
                ],
                links: [
                    {
                        "source": "sales",
                        "target": "OUTSIDE_ALL_ZONES",
                        "userid": "67ea8ec6c040a5af",
                        "value": 33
                    },
                    {
                        "source": "OUTSIDE_ALL_ZONES",
                        "target": "sales",
                        "userid": "67ea8ec6c040a5af",
                        "value": 28
                    },
                    {
                        "source": "tech",
                        "target": "sales",
                        "userid": "231bed80cb5b7ce3",
                        "value": 6
                    },
                    {
                        "source": "sales",
                        "target": "OUTSIDE_ALL_ZONES",
                        "userid": "231bed80cb5b7ce3",
                        "value": 9
                    },
                    {
                        "source": "tech",
                        "target": "OUTSIDE_ALL_ZONES",
                        "userid": "67ea8ec6c040a5af",
                        "value": 7
                    },
                    {
                        "source": "sales",
                        "target": "tech",
                        "userid": "67ea8ec6c040a5af",
                        "value": 4
                    },
                    {
                        "source": "tech",
                        "target": "sales",
                        "userid": "67ea8ec6c040a5af",
                        "value": 7
                    },
                    {
                        "source": "OUTSIDE_ALL_ZONES",
                        "target": "tech",
                        "userid": "67ea8ec6c040a5af",
                        "value": 6
                    },
                    {
                        "source": "tech",
                        "target": "OUTSIDE_ALL_ZONES",
                        "userid": "231bed80cb5b7ce3",
                        "value": 9
                    },
                    {
                        "source": "sales",
                        "target": "tech",
                        "userid": "231bed80cb5b7ce3",
                        "value": 6
                    },
                    {
                        "source": "OUTSIDE_ALL_ZONES",
                        "target": "sales",
                        "userid": "231bed80cb5b7ce3",
                        "value": 8
                    },
                    {
                        "source": "OUTSIDE_ALL_ZONES",
                        "target": "tech",
                        "userid": "231bed80cb5b7ce3",
                        "value": 12
                    },
                    {
                        "source": "tech",
                        "target": "coffee",
                        "userid": "231bed80cb5b7ce3",
                        "value": 2
                    },
                    {
                        "source": "coffee",
                        "target": "OUTSIDE_ALL_ZONES",
                        "userid": "231bed80cb5b7ce3",
                        "value": 4
                    },
                    {
                        "source": "sales",
                        "target": "OUTSIDE_ALL_ZONES",
                        "userid": "a826a473bfd66921",
                        "value": 0
                    },
                    {
                        "source": "OUTSIDE_ALL_ZONES",
                        "target": "coffee",
                        "userid": "231bed80cb5b7ce3",
                        "value": 5
                    },
                    {
                        "source": "coffee",
                        "target": "sales",
                        "userid": "231bed80cb5b7ce3",
                        "value": 1
                    },
                    {
                        "source": "coffee",
                        "target": "tech",
                        "userid": "231bed80cb5b7ce3",
                        "value": 1
                    }
                ],
                timelineData: [
                    {
                        "group": "Name",
                        "at": 1462053600000,
                        "symbol": "symbolCircle",
                        "title": "kjlqwjq",
                        "className": "entry--point--warn"
                    },
                    {
                        "group": "Name",
                        "at": 1462053600000,
                        "title": "wlqjlw",
                        "className": "entry--point--success",
                        "symbol": "symbolWye"
                    },
                    {
                        "group": "Name",
                        "at": 1467324000000,
                        "className": "entry--point--error",
                        "title": "lqwpqow",
                        "symbol": "symbolSquare"
                    },
                    {
                        "group": "Name",
                        "at": 1470002400000,
                        "className": "entry--point--error",
                        "symbol": "symbolDiamond",
                        "title": "wopqowp"
                    },
                    {
                        "group": "Name",
                        "at": 1472680800000,
                        "title": "qoiwiu",
                        "className": "entry--point--error",
                        "symbol": "symbolTriangle"
                    },
                    {
                        "group": "Name",
                        "at": 1475272800000,
                        "symbol": "symbolSquare",
                        "title": "poiwsklajs"
                    },
                    {
                        "group": "Type",
                        "at": 1462917600000,
                        "title": "owqpwpqw",
                        "className": "entry--point--success",
                        "symbol": "symbolSquare"
                    },
                    {
                        "group": "Type",
                        "at": 1463263200000,
                        "className": "entry--point--success",
                        "symbol": "symbolCross",
                        "title": "qpwiqiwpo"
                    },
                    {
                        "group": "Type",
                        "at": 1468101600000,
                        "className": "entry--point--success",
                        "symbol": "symbolCross",
                        "title": "wqpwipqw"
                    },
                    {
                        "group": "Type",
                        "label": "I'm a label with a custom class",
                        "from": 1464732000000,
                        "to": 1467324000000,
                        "title": "This is my title"
                    },
                    {
                        "group": "Type",
                        "at": 1475272800000,
                        "title": "wqwqwipqw",
                        "className": "entry--point--warn",
                        "symbol": "symbolStar"
                    },
                    {
                        "group": "Type",
                        "symbol": "symbolStar",
                        "at": 1477954800000,
                        "title": "wqsjksals"
                    },
                    {
                        "group": "Imp",
                        "label": "I'am a label of class 'entry--interval--error'",
                        "from": 1463263200000,
                        "to": 1467324000000,
                        "className": "entry--interval--error"
                    },
                    {
                        "group": "Imp",
                        "label": "I'am a label of class 'entry--interval--success'",
                        "from": 1470002400000,
                        "to": 1473631200000,
                        "className": "entry--interval--success"
                    }
                ],

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
                    }, {
                        group: 'c',
                        key: new Date(2017, 8, 1),
                        value: 30
                    }, {
                        group: 'a',
                        key: new Date(2017, 9, 1),
                        value: 20
                    }, {
                        group: 'c',
                        key: new Date(2017, 10, 1),
                        value: 10
                    },
                    {
                        group: 'd',
                        key: new Date(2017, 11, 1),
                        value: 20
                    }, {
                        group: 'd',
                        key: new Date(2017, 12, 1),
                        value: 40
                    },
                    {
                        group: 'b',
                        key: new Date(2018, 1, 1),
                        value: 30
                    }, {
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
                    }, {
                        group: 'b',
                        key: new Date(2018, 5, 1),
                        value: 30
                    }, {
                        group: 'a',
                        key: new Date(2018, 6, 1),
                        value: 20
                    }
                ],
                sliderData: [
                    {
                        from : new Date(2018, 1, 1),
                        to: new Date(2018, 1,2),
                        label: 'gps tracker',
                        id: 1,
                        title: 'a'
                    },

                    {
                        from : new Date(2018, 1, 1),
                        to: new Date(2018, 1,2),
                        label: 'gps tracker',
                        id: 2,
                        title: 'b'
                    },

                    {
                        from : new Date(2018, 1, 2),
                        to: new Date(2018, 1,3),
                        label: 'gps tracker',
                        id: 3,
                        title: 'c'
                    },
                    {
                        at : new Date(2018,1, 1, 12),
                        id: 4,
                        title: 'd'
                    }
                ],

            }
        },
        methods:{
            console(args) {
                console.log(args)
            },
            t() {
                console.log(this.$refs.tracker)
            }
        }
    }
</script>

<style scoped>
</style>
