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
                            "level": 0,
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
                            "beacons_positions": {
                                "type": "FeatureCollection",
                                "features": [
                                    {
                                        "type": "Feature",
                                        "properties": {
                                            "id": 37386,
                                            "name": "ILS 4/3307",
                                            "url": "/u_beacon_devices/37386",
                                            "level": 0,
                                            "type": "beacon_pos",
                                            "battery": null,
                                            "battery_updated_at": null
                                        },
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates": [
                                                2.37269133289332,
                                                48.8438817937675
                                            ]
                                        }
                                    },
                                    {
                                        "type": "Feature",
                                        "properties": {
                                            "id": 37387,
                                            "name": "ILS 4/3306",
                                            "url": "/u_beacon_devices/37387",
                                            "level": 0,
                                            "type": "beacon_pos",
                                            "battery": null,
                                            "battery_updated_at": null
                                        },
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates": [
                                                2.3726741705265,
                                                48.8438922718441
                                            ]
                                        }
                                    },
                                    {
                                        "type": "Feature",
                                        "properties": {
                                            "id": 37388,
                                            "name": "ILS 4/3311",
                                            "url": "/u_beacon_devices/37388",
                                            "level": 0,
                                            "type": "beacon_pos",
                                            "battery": null,
                                            "battery_updated_at": null
                                        },
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates": [
                                                2.37261726373128,
                                                48.8438366296443
                                            ]
                                        }
                                    },
                                    {
                                        "type": "Feature",
                                        "properties": {
                                            "id": 37389,
                                            "name": "ILS 4/3301",
                                            "url": "/u_beacon_devices/37389",
                                            "level": 0,
                                            "type": "beacon_pos",
                                            "battery": null,
                                            "battery_updated_at": null
                                        },
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates": [
                                                2.37260010136447,
                                                48.8438521661027
                                            ]
                                        }
                                    },
                                    {
                                        "type": "Feature",
                                        "properties": {
                                            "id": 37390,
                                            "name": "ILS 5/263",
                                            "url": "/u_beacon_devices/37390",
                                            "level": 0,
                                            "type": "beacon_pos",
                                            "battery": null,
                                            "battery_updated_at": null
                                        },
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates": [
                                                2.37259287871789,
                                                48.8438161251324
                                            ]
                                        }
                                    },
                                    {
                                        "type": "Feature",
                                        "properties": {
                                            "id": 37391,
                                            "name": "ILS 5/287",
                                            "url": "/u_beacon_devices/37391",
                                            "level": 0,
                                            "type": "beacon_pos",
                                            "battery": null,
                                            "battery_updated_at": null
                                        },
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates": [
                                                2.37257300650368,
                                                48.8438358166901
                                            ]
                                        }
                                    },
                                    {
                                        "type": "Feature",
                                        "properties": {
                                            "id": 37392,
                                            "name": "ILS 5/272",
                                            "url": "/u_beacon_devices/37392",
                                            "level": 0,
                                            "type": "beacon_pos",
                                            "battery": null,
                                            "battery_updated_at": null
                                        },
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates": [
                                                2.37252874204982,
                                                48.8437838779484
                                            ]
                                        }
                                    },
                                    {
                                        "type": "Feature",
                                        "properties": {
                                            "id": 37393,
                                            "name": "ILS 5/297",
                                            "url": "/u_beacon_devices/37393",
                                            "level": 0,
                                            "type": "beacon_pos",
                                            "battery": null,
                                            "battery_updated_at": null
                                        },
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates": [
                                                2.37251952856869,
                                                48.8438004983457
                                            ]
                                        }
                                    }
                                ]
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
