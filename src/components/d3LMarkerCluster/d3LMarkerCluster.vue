<template>
    <div class="d3-l-marker-cluster" :style="{ 'width' : width, 'height': height }"></div>
</template>

<script>
    import L from 'leaflet';
    import 'leaflet-fullscreen';
    import {isNull, isUndefined, isFunction} from 'lodash';
    import '../../utils/leaflet-indoor'
    import 'leaflet.markercluster'
    import mixins from '../../mixins/coords';

    export default {
        name: 'd3-l-marker-cluster',
        data() {
            return {
                _map: null,
                _tileLayer: null,
                _indoorLayer: null,
                _markerClusterLayer: null,
                _fullscreenControl: null,
                indoorLayerLevel: null,
            }
        },
        mixins: [mixins],
        methods: {
            drawLMarkerCluster() {
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

                        showCoverageOnHover = true,
                        zoomToBoundsOnClick = true,
                        spiderfyOnMaxZoom = true,
                        removeOutsideVisibleBounds = true,
                        animate = true,

                        animateAddingMarkers = false,
                        disableClusteringAtZoom = false,
                        maxClusterRadius = 80,
                        polygonOptions = {},
                        singleMarkerMode = false,
                        spiderLegPolylineOptions = { weight: 1.5, color: '#222', opacity: 0.5 },
                        spiderfyDistanceMultiplier = 1,
                        clusterPane = L.Marker.prototype.options.pane,
                        iconCreateFunction = undefined,
                        spiderfyShapePositions = undefined,

                        chunkedLoading = false,
                        chunkInterval = 200,
                        chunkDelay = 50,
                        chunkProgress = null
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

                const markerClusterGroupOptions = {
                    showCoverageOnHover,
                    zoomToBoundsOnClick,
                    spiderfyOnMaxZoom,
                    removeOutsideVisibleBounds,
                    animate,

                    animateAddingMarkers,
                    disableClusteringAtZoom,
                    maxClusterRadius,
                    polygonOptions,
                    singleMarkerMode,
                    spiderLegPolylineOptions,
                    spiderfyDistanceMultiplier,
                    clusterPane,
                };

                if (isFunction(iconCreateFunction)) {
                    markerClusterGroupOptions["iconCreateFunction"] = iconCreateFunction;
                }

                if (isFunction(spiderfyShapePositions)) {
                    markerClusterGroupOptions["spiderfyShapePositions"] = spiderfyShapePositions;
                }

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

                this._markerClusterLayer = L.markerClusterGroup(markerClusterGroupOptions).addTo(Map);
                if (!isMultipleLevel) {
                    this._markerClusterLayer.addLayers(data.map((x) => L.marker(x)));
                } else if (!isNull(this.indoorLayerLevel) && Array.isArray(data[this.indoorLayerLevel])) {
                    this._markerClusterLayer.addLayers(data[this.indoorLayerLevel].map((x) => L.marker(x)))
                }

                this._fullscreenControl = new L.Control.Fullscreen();
                Map.addControl(this._fullscreenControl);
            },
            reset() {
                this.$el.innerHTML = '';

                this._map = null;

                this._markerClusterLayer = null;
                this._indoorLayer = null;
                this._fullscreenControl = null;
                this._tileLayer = null;
                this.indoorLayerLevel = null;
            },
            safeDraw() {
                this.reset();
                this.drawLMarkerCluster();
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
                        if (!isNull(this._markerClusterLayer) && this._map.hasLayer(this._markerClusterLayer)) {
                            this._map.removeLayer(this._markerClusterLayer);
                        }

                        if (Array.isArray(this.data[n]) && this.data[n].length) {
                            const {
                                showCoverageOnHover = true,
                                zoomToBoundsOnClick = true,
                                spiderfyOnMaxZoom = true,
                                removeOutsideVisibleBounds = true,
                                animate = true,

                                animateAddingMarkers = false,
                                disableClusteringAtZoom = false,
                                maxClusterRadius = 80,
                                polygonOptions = {},
                                singleMarkerMode = false,
                                spiderLegPolylineOptions = { weight: 1.5, color: '#222', opacity: 0.5 },
                                spiderfyDistanceMultiplier = 1,
                                clusterPane = L.Marker.prototype.options.pane,
                                iconCreateFunction = undefined,
                                spiderfyShapePositions = undefined,

                                chunkedLoading = true,
                                chunkInterval = 200,
                                chunkDelay = 50,
                                chunkProgress = null
                            } = this.options;

                            const markerClusterGroupOptions = {
                                showCoverageOnHover,
                                zoomToBoundsOnClick,
                                spiderfyOnMaxZoom,
                                removeOutsideVisibleBounds,
                                animate,

                                animateAddingMarkers,
                                disableClusteringAtZoom,
                                maxClusterRadius,
                                polygonOptions,
                                singleMarkerMode,
                                spiderLegPolylineOptions,
                                spiderfyDistanceMultiplier,
                                clusterPane,
                            };

                            if (isFunction(iconCreateFunction)) {
                                markerClusterGroupOptions["iconCreateFunction"] = iconCreateFunction;
                            }

                            if (isFunction(spiderfyShapePositions)) {
                                markerClusterGroupOptions["spiderfyShapePositions"] = spiderfyShapePositions;
                            }

                            this._markerClusterLayer = L.markerClusterGroup(markerClusterGroupOptions).addTo(Map);
                            this._markerClusterLayer.addLayers(this.data[n].map((x) => L.marker(x)));
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



