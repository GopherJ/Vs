<template>
    <div class="d3-l-heat" :style="{ 'width' : width, 'height': height }"></div>
</template>

<script>
    import L from 'leaflet';
    import 'leaflet-fullscreen';
    import {isNull, isUndefined} from 'lodash';
    import 'l-indoor-map'
    import '../../lib/Leaflet.Heat';
    import mixins from '../../mixins/coords';

    export default {
        name: 'd3-l-heat',
        data() {
            return {
                _map: null,
                _tileLayer: null,
                _indoorLayer: null,
                _heatLayer: null,
                _fullscreenControl: null,
                indoorLayerLevel: null,
            }
        },
        mixins: [mixins],
        methods: {
            drawLHeat() {
                const self = this,
                    data = this.data,
                    indoorMaps = this.indoorMaps,
                    {
                        zoom = 18,
                        center,
                        url,
                        attribution,
                        maxZoom = 23,
                        minZoom = 1,

                        id = "mapbox/light-v10",

                        accessToken = "",

                        minOpacity= 0.05,
                        radius = 8,
                        blur = 15,
                        max = 0.4
                    } = this.options,
                    isMultipleLevel = !Array.isArray(data);

                if (isUndefined(center) || isUndefined(url) || isUndefined(attribution)) {
                    return;
                }

                const container = document.createElement('div');
                container.style.width  = '100%';
                container.style.height = '100%';

                const Map = this._map = L.map(this.$el.appendChild(container)).setView(center, zoom);

                this._tileLayer = L.tileLayer(url, {
                    attribution,
                    maxZoom,
                    minZoom,
                    id,
                    accessToken
                }).addTo(Map);

                if (Array.isArray(indoorMaps) && indoorMaps.length) {
                    this._indoorLayer = new L.Indoor(indoorMaps, {
                        grayscale: false,
                        hide_zones: true,
                        has_lock: false,
                        has_bound_control: true,

                        onSetLevel() {
                            self.indoorLayerLevel = this.getLevel();
                        }
                    }).addTo(Map);

                    this.indoorLayerLevel = this._indoorLayer.getLevel();
                }

                if (!isMultipleLevel) {
                    this._heatLayer = L.heatLayer(data, {
                        minOpacity,
                        blur,
                        max,
                        radius
                    }).addTo(Map);
                } else if (!isNull(this.indoorLayerLevel) && Array.isArray(data[this.indoorLayerLevel])) {
                    this._heatLayer = L.heatLayer(data[this.indoorLayerLevel], {
                        minOpacity,
                        blur,
                        max,
                        radius
                    }).addTo(Map);
                }

                this._fullscreenControl = new L.Control.Fullscreen();
                Map.addControl(this._fullscreenControl);
            },
            reset() {
                this.$el.innerHTML = '';

                this._map = null;

                this._heatLayer = null;
                this._indoorLayer = null;
                this._fullscreenControl = null;
                this._tileLayer = null;
                this.indoorLayerLevel = null;
            },
            safeDraw() {
                this.reset();
                this.drawLHeat();
            }
        },
        watch: {
            indoorLayerLevel: {
                deep: false,
                handler(n, o) {
                    const isMultipleLevel = !Array.isArray(this.data);
                    if (isMultipleLevel
                        && !isNull(o)
                        && !isNull(n)
                        && !isNull(this._indoorLayer)
                        && !isNull(this._map)
                    ) {
                        if (!isNull(this._heatLayer) && this._map.hasLayer(this._heatLayer)) {
                            this._map.removeLayer(this._heatLayer);
                        }

                        if (Array.isArray(this.data[n]) && this.data[n].length) {
                            const {
                                minOpacity= 0.05,
                                radius = 8,
                                blur = 15,
                                max = 0.4
                            } = this.options;

                            this._heatLayer = L.heatLayer(this.data[n], {
                                minOpacity,
                                blur,
                                max,
                                radius
                            }).addTo(this._map);
                        }
                    }
                }
            }
        }
    }
</script>

<style>
    @import url('../../css/index.css');
</style>



