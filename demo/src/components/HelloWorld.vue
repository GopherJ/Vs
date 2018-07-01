<template>
    <div>
        <section class="hero is-primary is-bold">
            <div class="hero-head has-text-centered">
                <header class="section">
                    <h3 class="title">Vs</h3>
                    <h4 class="subtitle">0.4.3</h4>
                </header>
            </div>
        </section>

        <section class="section">
            <div class="tile is-parent is-vertical">
                <article class="tile is-child content">
                    <h2 class="title">d3Metric</h2>

                    <hr>

                    <div class="columns">
                        <div class="column is-12 box">
                            <d3-l-choropleth v-bind="testMap"></d3-l-choropleth>
                        </div>
                    </div>
                </article>
            </div>
        </section>
    </div>
</template>

<script>
    export default {
        name: "HelloWorld",
        data() {
            return {
                horizontalBarData: [
                    {key: new Date(2017, 1, 1), value: 3},
                    {key: new Date(2017, 6, 1), value: 4},
                    {key: new Date(2017, 12, 1), value: 5},
                ],
                testMap: {
                    data: {
                        "type": "FeatureCollection",
                        "features": [
                            {
                                "type": "Feature",
                                "properties": {
                                    "id": 61357,
                                    "value": 10,
                                    "name": "coffee",
                                    "tags": [
                                        "café"
                                    ],
                                    "rgb_color": null,
                                    "level": 0,
                                    "type": "map_zone"
                                },
                                "geometry": {
                                    "type": "Polygon",
                                    "coordinates": [
                                        [
                                            [
                                                2.37254728065663,
                                                48.843755876192
                                            ],
                                            [
                                                2.37273786465381,
                                                48.8438700510955
                                            ],
                                            [
                                                2.37271909501773,
                                                48.8438873941188
                                            ],
                                            [
                                                2.37253356438411,
                                                48.8437732192153
                                            ],
                                            [
                                                2.37254728065663,
                                                48.843755876192
                                            ]
                                        ]
                                    ]
                                }
                            },
                            {
                                "type": "Feature",
                                "properties": {
                                    "id": 61332,
                                    "name": "sales",
                                    "value": 15,
                                    "tags": [
                                        "café"
                                    ],
                                    "rgb_color": null,
                                    "level": 0,
                                    "type": "map_zone"
                                },
                                "geometry": {
                                    "type": "Polygon",
                                    "coordinates": [
                                        [
                                            [
                                                2.37249370033574,
                                                48.8437972465289
                                            ],
                                            [
                                                2.37252585719145,
                                                48.8437755677497
                                            ],
                                            [
                                                2.37260859786514,
                                                48.8438261515677
                                            ],
                                            [
                                                2.37257680232242,
                                                48.8438474690339
                                            ],
                                            [
                                                2.37249370033574,
                                                48.8437972465289
                                            ]
                                        ]
                                    ]
                                }
                            },
                            {
                                "type": "Feature",
                                "properties": {
                                    "id": 61333,
                                    "name": "tech",
                                    "value": 20,
                                    "tags": [
                                        "frigo"
                                    ],
                                    "rgb_color": null,
                                    "level": 0,
                                    "type": "map_zone"
                                },
                                "geometry": {
                                    "type": "Polygon",
                                    "coordinates": [
                                        [
                                            [
                                                2.37260662004924,
                                                48.8438652396112
                                            ],
                                            [
                                                2.3726817580992,
                                                48.8439130473407
                                            ],
                                            [
                                                2.37271626348932,
                                                48.8438892006837
                                            ],
                                            [
                                                2.37266441507589,
                                                48.8438575857975
                                            ],
                                            [
                                                2.37261599913583,
                                                48.8438285001021
                                            ],
                                            [
                                                2.37258113243273,
                                                48.8438516241332
                                            ],
                                            [
                                                2.37260662004924,
                                                48.8438652396112
                                            ]
                                        ]
                                    ]
                                }
                            }
                        ]
                    },
                    indoorMap: [
                        {
                            "name": null,
                            "uuid": "e80df700fb26013508f232dca1892d8d",
                            "id": 88044,
                            "tiles_url_base": "https://imagesd.ubudu.com/u_maps_tiles/87685/7f82eefde0d901a939500acc41a3a655/{z}/{x}/{y}.png",
                            "map_bounds": [
                                [
                                    48.8435976211,
                                    2.3722844945
                                ],
                                [
                                    48.8439614633,
                                    2.372866931
                                ]
                            ],
                            "level": 4,
                            "map_features": {
                                "type": "FeatureCollection",
                                "features": [
                                    {
                                        "type": "Feature",
                                        "properties": {
                                            "id": 61357,
                                            "value": 10,
                                            "name": "coffee",
                                            "tags": [
                                                "café"
                                            ],
                                            "rgb_color": null,
                                            "level": 0,
                                            "type": "map_zone"
                                        },
                                        "geometry": {
                                            "type": "Polygon",
                                            "coordinates": [
                                                [
                                                    [
                                                        2.37254728065663,
                                                        48.843755876192
                                                    ],
                                                    [
                                                        2.37273786465381,
                                                        48.8438700510955
                                                    ],
                                                    [
                                                        2.37271909501773,
                                                        48.8438873941188
                                                    ],
                                                    [
                                                        2.37253356438411,
                                                        48.8437732192153
                                                    ],
                                                    [
                                                        2.37254728065663,
                                                        48.843755876192
                                                    ]
                                                ]
                                            ]
                                        }
                                    },
                                    {
                                        "type": "Feature",
                                        "properties": {
                                            "id": 61332,
                                            "name": "sales",
                                            "value": 10,
                                            "tags": [
                                                "café"
                                            ],
                                            "rgb_color": null,
                                            "level": 0,
                                            "type": "map_zone"
                                        },
                                        "geometry": {
                                            "type": "Polygon",
                                            "coordinates": [
                                                [
                                                    [
                                                        2.37249370033574,
                                                        48.8437972465289
                                                    ],
                                                    [
                                                        2.37252585719145,
                                                        48.8437755677497
                                                    ],
                                                    [
                                                        2.37260859786514,
                                                        48.8438261515677
                                                    ],
                                                    [
                                                        2.37257680232242,
                                                        48.8438474690339
                                                    ],
                                                    [
                                                        2.37249370033574,
                                                        48.8437972465289
                                                    ]
                                                ]
                                            ]
                                        }
                                    },
                                    {
                                        "type": "Feature",
                                        "properties": {
                                            "id": 61333,
                                            "name": "tech",
                                            "value": 20,
                                            "tags": [
                                                "frigo"
                                            ],
                                            "rgb_color": null,
                                            "level": 0,
                                            "type": "map_zone"
                                        },
                                        "geometry": {
                                            "type": "Polygon",
                                            "coordinates": [
                                                [
                                                    [
                                                        2.37260662004924,
                                                        48.8438652396112
                                                    ],
                                                    [
                                                        2.3726817580992,
                                                        48.8439130473407
                                                    ],
                                                    [
                                                        2.37271626348932,
                                                        48.8438892006837
                                                    ],
                                                    [
                                                        2.37266441507589,
                                                        48.8438575857975
                                                    ],
                                                    [
                                                        2.37261599913583,
                                                        48.8438285001021
                                                    ],
                                                    [
                                                        2.37258113243273,
                                                        48.8438516241332
                                                    ],
                                                    [
                                                        2.37260662004924,
                                                        48.8438652396112
                                                    ]
                                                ]
                                            ]
                                        }
                                    }
                                ]
                            },
                        },
                        {
                            "name": null,
                            "uuid": "e80df700fb26013508f232dca1892d8d",
                            "id": 88044,
                            "tiles_url_base": "https://imagesd.ubudu.com/u_maps_tiles/87685/7f82eefde0d901a939500acc41a3a655/{z}/{x}/{y}.png",
                            "map_bounds": [
                                [
                                    48.8435976211,
                                    2.3722844945
                                ],
                                [
                                    48.8439614633,
                                    2.372866931
                                ]
                            ],
                            "level": 1,
                            "map_features": {
                                "type": "FeatureCollection",
                                "features": [
                                    {
                                        "type": "Feature",
                                        "properties": {
                                            "id": 61357,
                                            "value": 10,
                                            "name": "coffee",
                                            "tags": [
                                                "café"
                                            ],
                                            "rgb_color": null,
                                            "level": 0,
                                            "type": "map_zone"
                                        },
                                        "geometry": {
                                            "type": "Polygon",
                                            "coordinates": [
                                                [
                                                    [
                                                        2.37254728065663,
                                                        48.843755876192
                                                    ],
                                                    [
                                                        2.37273786465381,
                                                        48.8438700510955
                                                    ],
                                                    [
                                                        2.37271909501773,
                                                        48.8438873941188
                                                    ],
                                                    [
                                                        2.37253356438411,
                                                        48.8437732192153
                                                    ],
                                                    [
                                                        2.37254728065663,
                                                        48.843755876192
                                                    ]
                                                ]
                                            ]
                                        }
                                    },
                                    {
                                        "type": "Feature",
                                        "properties": {
                                            "id": 61332,
                                            "name": "sales",
                                            "value": 10,
                                            "tags": [
                                                "café"
                                            ],
                                            "rgb_color": null,
                                            "level": 0,
                                            "type": "map_zone"
                                        },
                                        "geometry": {
                                            "type": "Polygon",
                                            "coordinates": [
                                                [
                                                    [
                                                        2.37249370033574,
                                                        48.8437972465289
                                                    ],
                                                    [
                                                        2.37252585719145,
                                                        48.8437755677497
                                                    ],
                                                    [
                                                        2.37260859786514,
                                                        48.8438261515677
                                                    ],
                                                    [
                                                        2.37257680232242,
                                                        48.8438474690339
                                                    ],
                                                    [
                                                        2.37249370033574,
                                                        48.8437972465289
                                                    ]
                                                ]
                                            ]
                                        }
                                    },
                                    {
                                        "type": "Feature",
                                        "properties": {
                                            "id": 61333,
                                            "name": "tech",
                                            "value": 20,
                                            "tags": [
                                                "frigo"
                                            ],
                                            "rgb_color": null,
                                            "level": 0,
                                            "type": "map_zone"
                                        },
                                        "geometry": {
                                            "type": "Polygon",
                                            "coordinates": [
                                                [
                                                    [
                                                        2.37260662004924,
                                                        48.8438652396112
                                                    ],
                                                    [
                                                        2.3726817580992,
                                                        48.8439130473407
                                                    ],
                                                    [
                                                        2.37271626348932,
                                                        48.8438892006837
                                                    ],
                                                    [
                                                        2.37266441507589,
                                                        48.8438575857975
                                                    ],
                                                    [
                                                        2.37261599913583,
                                                        48.8438285001021
                                                    ],
                                                    [
                                                        2.37258113243273,
                                                        48.8438516241332
                                                    ],
                                                    [
                                                        2.37260662004924,
                                                        48.8438652396112
                                                    ]
                                                ]
                                            ]
                                        }
                                    }
                                ]
                            },
                        },
                        {
                            "name": null,
                            "uuid": "e80df700fb26013508f232dca1892d8d",
                            "id": 88044,
                            "tiles_url_base": "https://imagesd.ubudu.com/u_maps_tiles/87685/7f82eefde0d901a939500acc41a3a655/{z}/{x}/{y}.png",
                            "map_bounds": [
                                [
                                    48.8435976211,
                                    2.3722844945
                                ],
                                [
                                    48.8439614633,
                                    2.372866931
                                ]
                            ],
                            "level": 3,
                            "map_features": {
                                "type": "FeatureCollection",
                                "features": [
                                    {
                                        "type": "Feature",
                                        "properties": {
                                            "id": 61357,
                                            "value": 10,
                                            "name": "coffee",
                                            "tags": [
                                                "café"
                                            ],
                                            "rgb_color": null,
                                            "level": 0,
                                            "type": "map_zone"
                                        },
                                        "geometry": {
                                            "type": "Polygon",
                                            "coordinates": [
                                                [
                                                    [
                                                        2.37254728065663,
                                                        48.843755876192
                                                    ],
                                                    [
                                                        2.37273786465381,
                                                        48.8438700510955
                                                    ],
                                                    [
                                                        2.37271909501773,
                                                        48.8438873941188
                                                    ],
                                                    [
                                                        2.37253356438411,
                                                        48.8437732192153
                                                    ],
                                                    [
                                                        2.37254728065663,
                                                        48.843755876192
                                                    ]
                                                ]
                                            ]
                                        }
                                    },
                                    {
                                        "type": "Feature",
                                        "properties": {
                                            "id": 61332,
                                            "name": "sales",
                                            "value": 10,
                                            "tags": [
                                                "café"
                                            ],
                                            "rgb_color": null,
                                            "level": 0,
                                            "type": "map_zone"
                                        },
                                        "geometry": {
                                            "type": "Polygon",
                                            "coordinates": [
                                                [
                                                    [
                                                        2.37249370033574,
                                                        48.8437972465289
                                                    ],
                                                    [
                                                        2.37252585719145,
                                                        48.8437755677497
                                                    ],
                                                    [
                                                        2.37260859786514,
                                                        48.8438261515677
                                                    ],
                                                    [
                                                        2.37257680232242,
                                                        48.8438474690339
                                                    ],
                                                    [
                                                        2.37249370033574,
                                                        48.8437972465289
                                                    ]
                                                ]
                                            ]
                                        }
                                    },
                                    {
                                        "type": "Feature",
                                        "properties": {
                                            "id": 61333,
                                            "name": "tech",
                                            "value": 20,
                                            "tags": [
                                                "frigo"
                                            ],
                                            "rgb_color": null,
                                            "level": 0,
                                            "type": "map_zone"
                                        },
                                        "geometry": {
                                            "type": "Polygon",
                                            "coordinates": [
                                                [
                                                    [
                                                        2.37260662004924,
                                                        48.8438652396112
                                                    ],
                                                    [
                                                        2.3726817580992,
                                                        48.8439130473407
                                                    ],
                                                    [
                                                        2.37271626348932,
                                                        48.8438892006837
                                                    ],
                                                    [
                                                        2.37266441507589,
                                                        48.8438575857975
                                                    ],
                                                    [
                                                        2.37261599913583,
                                                        48.8438285001021
                                                    ],
                                                    [
                                                        2.37258113243273,
                                                        48.8438516241332
                                                    ],
                                                    [
                                                        2.37260662004924,
                                                        48.8438652396112
                                                    ]
                                                ]
                                            ]
                                        }
                                    }
                                ]
                            },
                        },
                        {
                            "name": null,
                            "uuid": "77c786505854013620d05643e2323d1b",
                            "id": 88234,
                            "tiles_url_base": "https://imagesd.ubudu.com/u_maps_tiles/88231/a20279e4029b7463029bde82e88532d7/{z}/{x}/{y}.png",
                            "map_bounds": [[48.8338348357, 2.3705487277], [48.8342279085, 2.3711223583]],
                            "level": 0,
                            "map_features": {
                                "type": "FeatureCollection",
                                "features": [{
                                    "type": "Feature",
                                    "properties": {
                                        "id": 61459,
                                        "name": "new",
                                        "tags": [],
                                        "rgb_color": null,
                                        "level": 0,
                                        "type": "map_zone"
                                    },
                                    "geometry": {
                                        "type": "Polygon",
                                        "coordinates": [[[2.37099076518877, 48.8340412782977], [2.37105148375337, 48.8339724243803], [2.37098802600541, 48.8339473451388], [2.37093004662418, 48.83401574307], [2.37099076518877, 48.8340412782977]]]
                                    }
                                }, {
                                    "type": "Feature",
                                    "properties": {
                                        "id": 61458,
                                        "name": "Ubiik",
                                        "tags": [],
                                        "rgb_color": null,
                                        "level": 0,
                                        "type": "map_zone"
                                    },
                                    "geometry": {
                                        "type": "Polygon",
                                        "coordinates": [[[2.3707893210788, 48.8339621156928], [2.37081899556525, 48.8339298178319], [2.37086875561306, 48.8339487222102], [2.37084182030998, 48.8339815140705], [2.3707893210788, 48.8339621156928]]]
                                    }
                                }, {
                                    "type": "Feature",
                                    "properties": {
                                        "id": 61457,
                                        "name": "Ubudu workshop",
                                        "tags": [],
                                        "rgb_color": null,
                                        "level": 0,
                                        "type": "map_zone"
                                    },
                                    "geometry": {
                                        "type": "Polygon",
                                        "coordinates": [[[2.3709102998941, 48.8340090350854], [2.37093951785, 48.8339743801336], [2.37087742969372, 48.8339497568784], [2.37084821173783, 48.8339844118302], [2.3709102998941, 48.8340090350854]]]
                                    }
                                }]
                            }
                        }
                    ],
                    options: {
                        zoom: 19,
                        maxZoom: 23,
                        center: [48.843825, 2.372587],
                        url: 'https://{s}.tiles.mapbox.com/v4/fkruta.ljd3a238/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZmtydXRhIiwiYSI6InZLQXp0LXMifQ.IzN6KCblMOhYUoTydg80ug',
                        attribution: '&copy; <a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>',
                    }
                }
            };
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
