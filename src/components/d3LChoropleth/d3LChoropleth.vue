<template>
    <div class="d3-l-choropleth" :style="{ 'width' : width, 'height': height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import * as R from 'ramda';
    import L from 'leaflet';
    import LChoropleth from 'leaflet-choropleth';
    import LFullScreen from 'leaflet-fullscreen';
    import LGridLayerGoogleMutant from 'leaflet.gridlayer.googlemutant';
    import geoJsonMixin from '../../mixins/geojson';

    export default {
        name: 'd3-l-choropleth',
        mixins: [geoJsonMixin],
        methods: {
           drawLChoropleth() {
               const geoJSON = this.data;

               const { left = 0, top = 0, right = 0, bottom = 0 } = this.margin,
               {
                   zoom, center, maxZoom, url, attribution, params
               } = this.options,
               [w, h] = this.getElWidthHeight(),
               g_w = w - left - right,
               g_h = h - top - bottom;

               const gt0 = R.gt(R.__, 0);
               if (!R.all(gt0)([g_w, g_h])) return;

               const leafletMap = d3.select(this.$el)
                .append('div')
                .attr('id', 'leaflet-map')
                .style('width', g_w)
                .style('height', g_h);

                const Map = L.map('leaflet-map').setView(center, zoom);

                const Tile = L.tileLayer(url, { attribution }).addTo(Map);
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



