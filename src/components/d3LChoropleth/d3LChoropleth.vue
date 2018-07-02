<template>
    <div class="d3-l-choropleth" :style="{ 'width' : width, 'height': height }"></div>
</template>

<script>
    import L from 'leaflet';
    import LChoropleth from 'leaflet-choropleth';
    import LGridLayerGoogleMutant from 'leaflet.gridlayer.googlemutant';
    import LFullscreen from 'leaflet-fullscreen';
    import mixins from '../../mixins/geoJson';

    export default {
        name: 'd3-l-choropleth',
        data() {
            return {
                _map: null,
                _gridLayer: null,
                _tileLayer: null,
                _indoorLayer: null,
                _choroplethLayer: null,
                _fullscreenControl: null
            }
        },
        mixins: [mixins],
        methods: {
            drawLChoropleth() {
                const data = this.data,
                    indoorMaps = this.indoorMaps,
                    {
                        zoom = 18,
                        center,
                        url,
                        attribution,
                        maxZoom = 23,
                        minZoom = 1,

                        valueProperty = 'value',
                        scale = ['white', 'red'],
                        steps = 5,
                        mode = 'q',

                        color = '#fff',
                        weight = 2,
                        fillOpacity = 0.8
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
                    this._indoorLayer = L.indoor(indoorMaps, {
                        grayscale: true
                    }).addTo(Map);
                }

                this._choroplethLayer = L.choropleth(data, {
                    valueProperty,
                    scale,
                    steps,
                    mode,
                    style: {
                        color,
                        weight,
                        fillOpacity
                    },
                    onEachFeature: function (feature, layer) {
                        layer.bindPopup(feature.properties.value.toString());
                    }
                }).addTo(Map);

                this._fullscreenControl = new L.Control.Fullscreen();
                Map.addControl(this._fullscreenControl);
            },
            reset() {
                this.$el.innerHTML = '';

                this._map = null;
                this._choroplethLayer = null;
                this._indoorLayer = null;
                this._fullscreenControl = null;
                this._tileLayer = null;
                this._gridLayer = null;
            },
            safeDraw() {
                this.reset();
                this.drawLChoropleth();
            }
        }
    }
</script>

<style>
    @import url('../../css/index.css');
</style>


