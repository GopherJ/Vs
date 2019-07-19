<template>
    <div class="d3-l-heat" :style="{ 'width' : width, 'height': height }"></div>
</template>

<script>
    import L from 'leaflet';
    import 'leaflet-fullscreen';
    import {isNull, isUndefined} from 'lodash';
    import '../../utils/leaflet-indoor';
    import '../../lib/leaflet.heat';
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
                indoorLayerMapUuid: null,
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

                        minOpacity= 0.05,
                        radius = 8,
                        blur = 15,
                        max = 0.4
                    } = this.options;

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
                    minZoom
                }).addTo(Map);

                if (Array.isArray(indoorMaps) && indoorMaps.length) {
                    this._indoorLayer = new L.Indoor(indoorMaps, {
                        grayscale: false,
                        hide_zones: true,
                        has_lock: false,
                        has_bound_control: true,

                        onSetLevel() {
                            self.indoorLayerMapUuid = this.getLevelMapUuid();
                        }
                    }).addTo(Map);

                    this.indoorLayerMapUuid = this._indoorLayer.getLevelMapUuid();
                }

                if (!isNull(this.indoorLayerMapUuid) && Array.isArray(data[this.indoorLayerMapUuid])) {
                    this._heatLayer = L.heatLayer(data[this.indoorLayerMapUuid], {
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
                this.indoorLayerMapUuid = null;
            },
            safeDraw() {
                this.reset();
                this.drawLHeat();
            }
        },
        watch: {
            indoorLayerMapUuid: {
                deep: false,
                handler(n, o) {
                    if (!isNull(o)
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



