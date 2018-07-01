/*
 * L.IndoorZone is custom geoJson using geoJson zone properties
 */

import L from 'leaflet';
import LabeledMarker from 'leaflet-labeled-circle';
import centroid from '@turf/centroid';

L.GeoJSON.IndoorZone = L.GeoJSON.extend({
    options: {
        onEachFeature(feature, layer) {
            if (L.Util.isArray(feature.properties.tags) && feature.properties.tags.length === 0) {
                layer.bindPopup(`Name: ${feature.properties.name}<br/>Tags: none`);
            } else {
                layer.bindPopup(`Name: ${feature.properties.name}<br/>Tags: ${feature.properties.tags}`);
            }
        },

        style(feature) {
            let fill = '#ffffff';

            return {
                fillColor: feature.properties.rgb_color ||  fill,
                weight: 1,
                color: '#ff7800',
                fillOpacity: 0.4,
            };
        }
    },

    initialize(feature, options) {
        L.setOptions(this, options);

        L.GeoJSON.prototype.initialize.call(this, feature, options);

        this._zoneId = feature.properties.id;
        this._zoneName = feature.properties.name;

        const [lng, lat] = centroid(feature).geometry.coordinates;

        const circleFeature = {
            type: 'Feature',
            properties: {
                text: 0,
                labelPosition: [
                    lng,
                    lat,
                ]
            },
            geometry: {
                type: 'Point',
                coordinates: [lng, lat]
            }
        };

        this._labeled_circle_marker = new LabeledMarker(
            [lat, lng],
            circleFeature,
            {
                markerOptions: {
                    color: '#050',
                    radius: 20
                }
            }
        );
    },

    getCounterMarker() {
        return this._labeled_circle_marker;
    },

    getZoneId() {
        return this._zoneId;
    },

    getZoneName() {
        return this._zoneName;
    },

    updateLabelText(text) {
        this._labeled_circle_marker.setText(text);
    },

    setDefaultFillColor() {
        const fill = 'white';
        this.updateFillColor(fill);
    },

    updateFillColor(color) {
        this.setStyle({
            fillColor: color,
            weight: 1,
            color: '#ff7800',
            fillOpacity: 0.4,
        });
    }
});

L.GeoJSON.indoorZone = function (feature, options) {
    return new L.GeoJSON.IndoorZone(feature, options);
};
