<template>
    <div class="d3-l-heat" :style="{ 'width' : width, 'height': height }"></div>
</template>

<script>
    import L from 'leaflet';
    import LGridLayerGoogleMutant from 'leaflet.gridlayer.googlemutant';
    import LFullscreen from 'leaflet-fullscreen';
    import mixins from '../../mixins/coords';
    import LIndoor from '../../lib/leaflet.indoor';
    import LIndoorZones from '../../lib/leaflet.indoorzones';
    import LHeat from '../../lib/leaflet.heat';

    export default {
        name: 'd3-l-heat',
        data() {
            return {
                _map: null,
                _gridLayer: null,
                _tile: null,

                _indoorLayer: null,
                _indoorLayerLevelControl: null,

                _heatLayer: null,
                _indoorZones: null,

                _fullscreenControl: null
            }
        },
        mixins: [mixins],
        methods: {
            drawLHeat() {
                const data = this.data,
                    indoorMaps = this.indoorMaps,
                    indoorZones = this.indoorZones,
                    {
                        zoom = 18,
                        center,
                        url,
                        attribution,
                        maxZoom = 23,
                        minZoom = 1,

                        minOpacity = '0.05',
                        radius = 25,
                        blur = 15,
                        gradient = {
                            0.4: 'blue',
                            0.65: 'lime',
                            1: 'red'
                        }
                    } = this.options;

                const Map = this._map = L.map(this.$el).setView(center, zoom);
                this._gridLayer = L.gridLayer.googleMutant({
                    maxZoom,
                    minZoom,
                    type: 'roadmap'
                }).addTo(Map);

                this._tile = L.tileLayer(url, {
                    attribution,
                    maxZoom
                }).addTo(Map);

                if (L.Util.isArray(indoorMaps) && indoorMaps.length > 0) {
                    const indoorLayer = this._indoorLayer = L.indoor(indoorMaps, {
                        grayscale: true
                    }).addTo(Map);

                    indoorLayer.setLevel('0');

                    const levelControl = this._indoorLayerLevelControl = L.Control.level({
                        level: '0',
                        levels: indoorLayer.getLevels()
                    }).addTo(Map);

                    levelControl.on('levelchange', indoorLayer.setLevel, indoorLayer);
                }

                this._heatLayer = L.heatLayer(data, {
                    minOpacity,
                    radius,
                    blur,
                    gradient
                }).addTo(Map);

                if (indoorZones) {
                    this._indoorZones = L.GeoJSON.indoorZones(data).addTo(Map);
                }

            },
            removeAll() {
                // if (this._indoorZones !== null) this._indoorZones.remove();
                // if (this._heatLayer !== null) this._heatLayer.remove();
                // if (this._indoorLayer !== null) this._indoorLayer.remove();
                // if (this._indoorLayerLevelControl !== null) this._indoorLayerLevelControl.remove();
                // if (this._tile !== null) this._tile.remove();
                // if (this._gridLayer !== null) this._gridLayer.remove();
                // if (this._map !== null) this._map.remove();
            },
            safeDraw() {
                // this.removeAll();
                this.drawLHeat();
            }
        }
    }
</script>



