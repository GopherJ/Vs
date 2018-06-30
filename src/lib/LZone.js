const indoor_maps_api_url = `https://manager.ubudu.com/u_venues/${data}/geojson_features?access_token=${state.access_token}`;

Vue.axios.get(indoor_maps_api_url).then((response) => {
    overlayMaps = {};
    zones_layers_hash = {};

    if (!overlays) {
        overlays = L.layerGroup().addTo(state.current_map);
    } else {
        overlays.clearLayers();
    }

    const data = response.data.indoor_maps,
        map = state.current_map;

    if (layerbox != undefined) {
        map.removeControl(layerbox);
    }

    if (zones_overlays != undefined) {
        JQuery.each(zones_overlays, (index, zone_overlays) => {
            zone_overlays.clearLayers();
        });
    }

    const indoorLayer = new L.Indoor(data, overlays, {
        grayscale: false,
        onSetLevel: function showZonesOverlays(level) {
            // add layer controls/legend
            overlayMaps = {};
            zones_layers_hash = {};

            // then remove any previously-displayed layers
            overlays.clearLayers();

            if (layerbox != undefined) {
                map.removeControl(layerbox);
            }

            if (zones_overlays != undefined) {
                JQuery.each(zones_overlays, (index, zone_overlays) => {
                    zone_overlays.clearLayers();
                });
            }


            let tags_zones = ['none'];
            JQuery.each(data, (index, map) => {
                if (map.level == level) {
                    JQuery.each(map.map_features.features, (index, feature) => {
                        if (feature.geometry.type == 'Polygon' && feature.properties.type == 'map_zone') {
                            tags_zones = tags_zones.concat(feature.properties.tags);
                        }
                    });
                }
            });;
            tags_zones = JQuery.unique(tags_zones);

            // Now we create the overlays in the overlay control
            layer_zones_names = tags_zones.map((elem, index) => `Zones - Tag : ${elem}`);


            zones_overlays = tags_zones.map((elem, index) => L.layerGroup());

            JQuery.each(zones_overlays, (index, zone) => {
                zone.addTo(map);
            });

            JQuery.each(layer_zones_names, (index, zone_layer_name) => {
                overlayMaps[zone_layer_name] = zones_overlays[index];
                zones_layers_hash[tags_zones[index]] = zones_overlays[index];
            });

            layerbox = L.control.layers(null, overlayMaps, {collapsed: true, position: 'topright'});
            layerbox.addTo(map);

            // now we take care of the zones layers and add them to the right group layer
            const geoJsonLayers = [];
            JQuery.each(data, (index, map) => {
                if (map.level == level) {
                    JQuery.each(map.map_features.features, (index, feature) => {
                        if (feature.geometry.type == 'Polygon' && feature.properties.type == 'map_zone') {
                            let geoJsonLayer;
                            if (feature.properties.tags.length == 0) {
                                geoJsonLayer = L.geoJson.indoor_zone(feature);
                                zones_layers_hash.none.addLayer(geoJsonLayer);
                                zones_layers_hash.none.addLayer(geoJsonLayer.getCounterMarker());
                            } else {
                                JQuery.each(feature.properties.tags, (index, tag) => {
                                    geoJsonLayer = L.geoJson.indoor_zone(feature);
                                    // we add this newlayer to the vuex store state object hash

                                    // we add the layer to the group
                                    // we show both the polygon shape and the counter marker
                                    zones_layers_hash[tag].addLayer(geoJsonLayer);
                                    zones_layers_hash[tag].addLayer(geoJsonLayer.getCounterMarker());
                                });
                            }

                            geoJsonLayers.push(geoJsonLayer);
                        }
                    });
                    commit('RealTime/ZONES_DATA_ADD', geoJsonLayers);
                }
            });
        },
        onEachFeature(feature, layer) {
            layer.bindPopup(`Name: ${feature.properties.name}<br/>Type: ${feature.properties.type}`);
        },
        style(feature) {
            let fill = '#ff7800';

            if (feature.properties.rgb_color != null) {
                try {
                    fill = rgbToHex(feature.properties.rgb_color.split(',').slice(0, 3));
                } catch (e) {
                    console.log(e);
                }
            }

            return {
                fillColor: fill,
                weight: 1,
                color: '#ff7800',
                fillOpacity: 0.4,
            };
        },
    });

    // initialize we don't yet what level to show...
    // if there is only one layer we know it is this one
    if (response.data.indoor_maps.length === 1) {
        indoorLayer.setLevel(`${response.data.indoor_maps[0].level}`);
    } else {
        // otherwise by default we set it to level 0
        // TODO improve here the logic maybe we should look if 0 exist than if not show a level in the "middle"
        indoorLayer.setLevel('0');
    }

    indoorLayer.addTo(state.current_map);
    if (levelControl != undefined)
        map.removeControl(levelControl);

    levelControl = new L.Control.Level({
        level: this.indoor_map_level_default,
        levels: indoorLayer.getLevels(),
    });
    // Connect the level control to the indoor layer
    levelControl.addEventListener('levelchange', indoorLayer.setLevel, indoorLayer);
    levelControl.addTo(state.current_map);

    const bounds = response.data.indoor_maps[0].map_bounds;

    state.current_map.fitBounds(bounds, {padding: [20, 20]});

    // We now send the maps data in the websocket for the server analysis
    for (let i = data.length - 1; i >= 0; i--) {
        const data_to_post = {
            app_namespace: data[i].uuid, // DIRTY TODO MANAGE THAT ON THE SERVER
            type: 'UPDATE_MAP_DATA',
            map_json: JSON.stringify({map_features: data[i].map_features}),
        };
        /* state.socket.ws_socket.send(JSON.stringify({
                        "app_namespace":  JSON.stringify(data[i].uuid), //DIRTY TODO MANAGE THAT ON THE SERVER
                        "type": "UPDATE_MAP_DATA",
                        "map_json": JSON.stringify({"map_features": data[i].map_features})
                    })); */
        // const map_update_url = `http://traject.ubudu.com:40080/map_data/update/${data[i].uuid}`;
        const map_update_url = `http://${window.location.hostname}:40080/map_data/update/${data[i].uuid}`;
        Vue.axios.post(map_update_url, data_to_post).then((response) => {
            // console.log(response);
        }).catch((error) => {
            // unsuccesfull posting of data
            console.log(error);
        });
    }
}).catch((error) => {
    // unsuccesfull gathering of data or general error
    console.log(error);
});


// get the real time alert rules
// const alert_rules_url = `http://traject.ubudu.com:40080/alert_rules/${state.application_namespace}`;
const alert_rules_url = `http://${window.location.hostname}:40080/alert_rules/${state.application_namespace}`;
Vue.axios.get(alert_rules_url).then((response) => {
    commit('RealTime/SET_ALERT_RULES', JSON.stringify(response.data, null, 2));
});
// get the positions exipration_period
// const pos_expiration_period_url = `http://traject.ubudu.com:40080/positions_expiration_period/${state.application_namespace}`;
const pos_expiration_period_url = `http://${window.location.hostname}:40080/positions_expiration_period/${state.application_namespace}`;
Vue.axios.get(pos_expiration_period_url).then((response) => {
    commit('RealTime/UPDATE_POSITIONS_EXPIRATION_PERIOD', parseInt(response.data));
});
