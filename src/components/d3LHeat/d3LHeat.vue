<template>
    <div class="d3-l-heat" :style="{ 'width' : width, 'height': height }"></div>
</template>

<script>
    import L from 'leaflet';
    import '../../utils/leaflet-indoor';
    import 'leaflet-fullscreen';
    import '../../lib/leaflet.heat';
    import mixins from '../../mixins/coords';

    export default {
        name: 'd3-l-heat',
        data() {
            return {
                _map: null,
                _tileLayer: null,
                _indoorLayer: null,
                indoorLayerMapUuid: null,
                _indoorLayerUuidLevelMap: {},
                _heatLayer: null,
                _fullscreenControl: null
            }
        },
        mixins: [mixins],
        methods: {
            drawLHeat() {
                const data = this.data,
                    self = this,
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

                indoorMaps.forEach(indoorMap => {
                    this._indoorLayerUuidLevelMap[indoorMap.uuid] = indoorMap.level; 
                    this._indoorLayerUuidLevelMap[indoorMap.level] = indoorMap.uuid;
                });

                const container = document.createElement('div');
                container.style.width = '100%';
                container.style.height = '100%';

                const Map = this._map = L.map(this.$el.appendChild(container)).setView(center, zoom);

                this._tileLayer = L.tileLayer(url, {
                    attribution,
                    maxZoom,
                    minZoom
                }).addTo(Map);

                if (L.Util.isArray(indoorMaps) && indoorMaps.length > 0) {
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

                if (this.indoorLayerMapUuid !== null && Array.isArray(data[this.indoorLayerMapUuid])) {
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
                this.indoorLayerMapUuid = null;
                this._indoorLayerUuidLevelMap = {};
                this._fullscreenControl = null;
                this._tileLayer = null;
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
                    if (o !== null
                        && this._indoorLayer !== null
                        && this._heatLayer !== null
                        && this._map !== null
                        && this._map.hasLayer(this._heatLayer)
                        && Array.isArray(this.data[n])
                    ) {
                        this._map.removeLayer(this._heatLayer);
                        const {
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
</script>

<style>
    @import url('../../css/index.css');
</style>



