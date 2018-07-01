<template>
    <div class="d3-l-choropleth" :style="{ 'width' : width, 'height': height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import L from 'leaflet';
    import LChoropleth from 'leaflet-choropleth';
    import LGridLayerGoogleMutant from 'leaflet.gridlayer.googlemutant';
    import mixins from '../../mixins/geojson';
    import LIndoor from '../../lib/leaflet.indoor';
    import LIndoorZones from '../../lib/leaflet.indoorzones';

    export default {
        name: 'd3-l-choropleth',
        mixins: [mixins],
        methods: {
            drawLChoropleth() {
                const data = this.data,
                    indoorMap = this.indoorMap,
                    {
                        zoom, center, url, attribution, maxZoom
                    } = this.options;

                const Map = L.map(this.$el).setView(center, zoom);
                L.gridLayer.googleMutant({
                    maxZoom,
                    type: 'roadmap'
                });

                const Tile = L.tileLayer(url, {
                    attribution,
                    maxZoom
                }).addTo(Map);

                L.choropleth(data, {
                    valueProperty: 'value',
                    scale: ['white', 'red'],
                    steps: 5,
                    mode: 'q',
                    style: {
                        color: '#fff',
                        weight: 2,
                        fillOpacity: 0.8
                    },
                    onEachFeature: function(feature, layer) {
                        layer.bindPopup(feature.properties.value)
                    }
                }).addTo(Map);

                const indoorLayer = L.indoor(indoorMap, {
                    grayscale: true
                }).addTo(Map);

                indoorLayer.setLevel('0');

                const levelControl = L.Control.level({
                    level: '0',
                    levels: indoorLayer.getLevels()
                }).addTo(Map);

                levelControl.on('levelchange', indoorLayer.setLevel, indoorLayer);

                L.indoorZones(data).addTo(Map);
            },
            safeDraw() {
                this.ifExistsMapThenRemove();
                this.drawLChoropleth();
            },
            onResize() {
                this.safeDraw();
            }
        }
    }
</script>



