/*
 * L.IndoorZone is custom geojson using geojson zone properties
 */

import L from 'leaflet';
import LIndoorZone from './leaflet.indoorzone';

/**
 *
 * @param arr
 * @returns {any[]}
 */
const unique = arr => Array.from(new Set(...arr));

L.GeoJSON.IndoorZones = L.GeoJSON.extend({
    options: {
        onEachFeature(feature, layer) {
            const tags = feature.properties.tags,
                name = feature.properties.name;

            if (L.Util.isArray(tags) && tags.length === 0) {
                layer.bindPopup(`Name: ${name}<br/>Tags: none`);
            } else {
                layer.bindPopup(`Name: ${name}<br/>Tags: ${tags}`);
            }
        }
    },

    initialize(featureCollection, options) {
        L.setOptions(this, options);
        this._zones = L.layerGroup();
        this._map = null;

        let tags = [], zoneTagHash = {};
        const features = featureCollection['features'];

        for (let i = 0, l = features.length; i < l; i += 1) {
            const feature = features[i];
            if (feature.geometry.type !== 'Polygon' || feature.properties.type !== 'map_zone') {
                continue;
            }

            const zone = L.GeoJSON.indoorZone(feature);
            const tag = feature.properties.tags
                ? feature.properties.tags
                : 'none';

            if (!zoneTagHash[tag]) {
                zoneTagHash[tag] = L.layerGroup();
            } else {
                zoneTagHash[tag].addLayer(zone);
            }

            this._zones.addLayer(zone);
            tags = tags.concat(tag);
        }

        this._tags = unique(tags);
        this._controlBox = this._tags.reduce((ite, cur) => {
            const tagName = `Zone - Tag: ${cur}`;
            ite[tagName]  = zoneTagHash[cur];
        }, {});

        L.control.layers(null, this._controlBox, {
            collapsed: true,
            position: 'topright'
        });
    },

    addTo(map) {
        map.addLayer(this._zones);
        map.addControl(this._controlBox);

        return this;
    },

    onAdd(map) {
        this._map = map;
    },

    onRemove() {
        this._map.removeLayer(this._zones);
        this._map.removeControl(this._controlBox);

        this._map = null;
    }
});

L.GeoJSON.indoorZones = function (featureCollection, options) {
    return new L.GeoJSON.IndoorZones(featureCollection, options);
};
