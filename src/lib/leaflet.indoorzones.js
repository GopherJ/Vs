/*
 * L.IndoorZone is custom geojson using geojson zone properties
 */

import L from 'leaflet';
import LIndoorZone from './leaflet.indoorzone';

/**
 *
 * @param arr
 * @returns {array}
 */
const unique  = arr => Array.from(new Set(arr));

/**
 *
 * @param s
 * @returns {boolean}
 */
const isEmpty = s   => s === undefined || s === '' || s === null;

L.IndoorZones = L.GeoJSON.extend({
    options: {
        onEachFeature(feature, layer) {
            const tags = feature.properties.tags,
                  name = feature.properties.name;

            if (L.Util.isArray(tags) && tags.length === 0) {
                layer.bindPopup(`Name: ${name}<br/>Tags: none`);
            } else {
                layer.bindPopup(`Name: ${name}<br/>Tags: ${tags}`);
            }
        },

        style(feature) {
            const fill = '#ffffff';

            return {
                fillColor: feature.properties.rgb_color ||  fill,
                weight: 1,
                color: '#ff7800',
                fillOpacity: 0.4,
            };
        }
    },

    initialize(featureCollection, options) {
        L.setOptions(this, options);

        this._zones = [];
        this._map = null;

        let tags = [], zoneTagHash = {};
        const features = featureCollection['features'];

        for (let i = 0, l = features.length; i < l; i += 1) {
            const feature = features[i];
            if (feature.geometry.type !== 'Polygon' || feature.properties.type !== 'map_zone') {
                continue;
            }

            const zone = L.indoorZone(feature, this.options);

            const Tags = feature.properties.tags;

            if (!L.Util.isArray(Tags)) {
                const tag = isEmpty(Tags) ? 'none' : Tags;

                if (!zoneTagHash[tag]) {
                    zoneTagHash[tag] = L.layerGroup();
                } else {
                    zoneTagHash[tag].addLayer(zone);
                    zoneTagHash[tag].addLayer(zone.getCounterMarker());
                }

                tags = tags.concat(tag);
            } else {
                if (Tags.length > 0) {
                    Tags.forEach(x => {
                        const tag = isEmpty(x) ? 'none' : x;

                        if (!zoneTagHash[tag]) {
                            zoneTagHash[tag] = L.layerGroup();
                        } else {
                            zoneTagHash[tag].addLayer(zone);
                            zoneTagHash[tag].addLayer(zone.getCounterMarker());
                        }
                    });
                } else {
                    const tag = 'none';

                    if (!zoneTagHash[tag]) {
                        zoneTagHash[tag] = L.layerGroup();
                    } else {
                        zoneTagHash[tag].addLayer(zone);
                        zoneTagHash[tag].addLayer(zone.getCounterMarker());
                    }
                }

                tags = tags.concat(tag);
            }

            this._zones.push(zone);
        }

        this._tags = unique(tags);
        const controlBox = this._tags.reduce((ite, cur) => {
            const tagName = `Zone - Tag: ${cur}`;
            ite[tagName] = zoneTagHash[cur];

            return ite;
        }, {});

        this._controlBox = L.control.layers(null, controlBox, {
            collapsed: true,
            position: 'topright'
        });
    },

    onAdd(map) {
        this._map = map;

        map.addControl(this._controlBox);
    },

    onRemove(map) {
        if (this._map !== null) {

            this._map.removeControl(this._controlBox);

            this._map = null;
        }
    },

    getAllZones() {
        return this._zones;
    }
});

L.indoorZones = function (featureCollection, options) {
    return new L.IndoorZones(featureCollection, options);
};
