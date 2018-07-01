<template>
    <div class="d3-l-heat" :style="{ 'width' : width, 'height': height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import L from 'leaflet';
    import LChoropleth from 'leaflet-choropleth';
    import LGridLayerGoogleMutant from 'leaflet.gridlayer.googlemutant';
    import mixins from '../../mixins/coords';
    import LIndoor from '../../lib/leaflet.indoor';
    import LIndoorZones from '../../lib/leaflet.indoorzones';
    import LHeat from '../../lib/leaflet.heat';

    export default {
        name: 'd3-l-heat',
        mixins: [mixins],
        methods: {
            drawLHeat() {
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

                const indoorLayer = L.indoor(indoorMap, {
                    grayscale: true
                }).addTo(Map);

                indoorLayer.setLevel('0');

                const levelControl = L.Control.level({
                    level: '0',
                    levels: indoorLayer.getLevels()
                }).addTo(Map);

                levelControl.on('levelchange', indoorLayer.setLevel, indoorLayer);

                // L.choropleth(data, {
                //     valueProperty: 'value',
                //     scale: ['white', 'red'],
                //     steps: 5,
                //     mode: 'q',
                //     style: {
                //         color: '#fff',
                //         weight: 2,
                //         fillOpacity: 0.8
                //     },
                //     onEachFeature: function (feature, layer) {
                //         layer.bindPopup(feature.properties.value)
                //     }
                // }).addTo(Map);
                //
                // L.GeoJSON.indoorZones(data).addTo(Map);

                L.heatLayer(data, {radius: 8, max: 0.4}).addTo(Map);
            },
            safeDraw() {
                this.ifExistsMapThenRemove();
                this.drawLHeat();
            },
            onResize() {
                this.safeDraw();
            }
        }
    }
</script>



