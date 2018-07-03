<template>
    <div class="d3-l-heat" :style="{ 'width' : width, 'height': height }"></div>
</template>

<script>
    import L from 'leaflet';
    import LGridLayerGoogleMutant from 'leaflet.gridlayer.googlemutant';
    import LFullscreen from 'leaflet-fullscreen';
    import LIndoor from '../../lib/leaflet.indoor';
    import LHeat from '../../lib/leaflet.heat';
    import mixins from '../../mixins/coords';

    export default {
        name: 'd3-l-heat',
        data() {
            return {
                _map: null,
                _gridLayer: null,
                _tileLayer: null,
                _indoorLayer: null,
                _heatLayer: null,
                _fullscreenControl: null
            }
        },
        mixins: [mixins],
        methods: {
            drawLHeat() {
                const data = this.data,
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

                const container = document.createElement('div');
                container.style.width = '100%';
                container.style.height = '100%';

                const Map = this._map = L.map(this.$el.appendChild(container)).setView(center, zoom);
                this._gridLayer = L.gridLayer.googleMutant({
                    maxZoom,
                    minZoom,
                    type: 'roadmap'
                }).addTo(Map);

                this._tileLayer = L.tileLayer(url, {
                    attribution,
                    maxZoom
                }).addTo(Map);

                if (L.Util.isArray(indoorMaps) && indoorMaps.length > 0) {
                    this._indoorLayer = L.indoorLayer(indoorMaps, {
                        grayscale: false
                    }).addTo(Map);
                }

                this._heatLayer = L.heatLayer(data, {
                    minOpacity,
                    blur,
                    max,
                    radius
                }).addTo(Map);

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
                this._gridLayer = null;
            },
            safeDraw() {
                this.reset();
                this.drawLHeat();
            }
        }
    }
</script>

<style>
    @import url('../../css/index.css');
</style>



