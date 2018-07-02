<template>
    <div class="d3-l-choropleth" :style="{ 'width' : width, 'height': height }"></div>
</template>

<script>
    import L from 'leaflet';
    import LChoropleth from 'leaflet-choropleth';
    import LGridLayerGoogleMutant from 'leaflet.gridlayer.googlemutant';
    import LFullscreen from 'leaflet-fullscreen';
    import mixins from '../../mixins/geoJson';
    import LIndoor from '../../lib/leaflet.indoor';
    import LIndoorZones from '../../lib/leaflet.indoorzones';

    export default {
        name: 'd3-l-choropleth',
        data() {
            return {
                _map: null,
                _gridLayer: null,
                _tile: null,

                _indoorLayer: null,
                _indoorLayerLevelControl: null,

                _choroplethLayer: null,
                _indoorZones: null,

                _fullscreenControl: null
            }
        },
        mixins: [mixins],
        methods: {
            drawLChoropleth() {
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

                        valueProperty = 'value',
                        scale = ['white', 'red'],
                        steps = 5,
                        mode = 'q',
                        style: {
                            color = '#fff',
                            weight = 2,
                            fillOpacity = 0.8
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
                        layer.bindPopup(feature.properties.value)
                    }
                }).addTo(Map);

                if (indoorZones) {
                    this._indoorZones = L.GeoJSON.indoorZones(data).addTo(Map);
                }

                this._fullscreenControl = L.Control.Fullscreen().addTo(Map);
            },
            removeAll() {
                if (this._fullscreenControl !== null) this._fullscreenControl.remove();
                if (this._indoorZones !== null) this._indoorZones.remove();
                if (this._choroplethLayer !== null) this._choroplethLayer.remove();
                if (this._indoorLayer !== null) this._indoorLayer.remove();
                if (this._indoorLayerLevelControl !== null) this._indoorLayerLevelControl.remove();
                if (this._tile !== null) this._tile.remove();
                if (this._gridLayer !== null) this._gridLayer.remove();
                if (this._map !== null) this._map.remove();
            },
            safeDraw() {
                this.removeAll();
                this.drawLChoropleth();
            }
        }
    }
</script>



