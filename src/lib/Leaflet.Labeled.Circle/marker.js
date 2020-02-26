import L from 'leaflet';

import './circle'
import '../Leaflet.Path.Drag';

L.LabeledMarker = L.FeatureGroup.extend({

  options: {

    /**
     * @param  {LabeledMarker} marker
     * @param  {Object}        feature
     * @return {String}
     */
    getLabelText: (marker, feature) => feature.properties.text,

    /**
     * @param  {LabeledMarker} marker
     * @param  {Object}        feature
     * @param  {L.LatLng}      latlng
     * @return {L.LatLng}
     */
    getLabelPosition: (marker, feature, latlng) => {
      return feature.properties.labelPosition ?
        L.latLng(feature.properties.labelPosition.slice().reverse()) :
        latlng;
    },

    labelPositionKey: 'labelPosition',

    markerOptions: {
      color: '#f00',
      fillOpacity: 0.75,
      draggable: true,
      radius: 15
    },

    anchorOptions: {
      color: '#00f',
      radius: 3
    },

    lineOptions: {
      color: '#f00',
      dashArray: [2, 6],
      lineCap: 'square',
      weight: 2
    }

  },


  /**
   * @class LabeledMarker
   * @constructor
   * @extends {L.FeatureGroup}
   *
   * @param  {L.LatLng} latlng
   * @param  {Object=}  feature
   * @param  {Object=}  options
   */
  initialize(latlng, feature, options) {
    L.Util.setOptions(this, options);

    /**
     * @type {Object}
     */
    this.feature = feature || {
      type: 'Feature',
      properties: {},
      geometry: {
        'type': 'Point'
      }
    };

    /**
     * @type {L.LatLng}
     */
    this._latlng = latlng;


    /**
     * @type {CircleLabel}
     */
    this._marker = null;


    /**
     * @type {L.CircleMarker}
     */
    this._anchor = null;


    /**
     * @type {L.Polyline}
     */
    this._line = null;


    /**
     * @type {L.Point}
     */
    this._initialDistance = null;

    this._createLayers();
    L.LayerGroup.prototype.initialize.call(this,
      [this._anchor, this._line, this._marker]);
  },


  /**
   * @return {L.LatLng}
   */
  getLabelPosition() {
    return this._marker.getLatLng();
  },


  /**
   * @return {L.LatLng}
   */
  getLatLng() {
    return this._latlng;
  },


  /**
   * Serialize
   * @return {Object}
   */
  toGeoJSON(geometryCollection) {
    const feature = L.GeoJSON.getFeature(this, {
      type: 'Point',
      coordinates: L.GeoJSON.latLngToCoords(this._anchor.getLatLng())
    });
    feature.properties[this.options.labelPositionKey] =
      L.GeoJSON.latLngToCoords(this._marker.getLatLng());
    feature.properties.text = this._marker.getText();
    return geometryCollection ? toGeometryCollection(feature, this.options.labelPositionKey) : feature;
  },


  /**
   * @param {String} text
   * @return {LabeledMarker}
   */
  setText(text) {
    this._marker.setText(text);
    return this;
  },


  /**
   * Creates anchor, line and label
   */
  _createLayers() {
    const opts = this.options;
    const pos  = opts.getLabelPosition(this, this.feature, this._latlng);
    const text = opts.getLabelText(this, this.feature);

    if ('draggable' in opts) {
      opts.markerOptions.draggable = opts.draggable;
    }

    this._marker = new L.TextCircle(text, pos,
      L.Util.extend({
        interactive: this.options.interactive
      },
        L.LabeledMarker.prototype.options.markerOptions,
        opts.markerOptions)
    ).on('drag',      this._onMarkerDrag,      this)
     .on('dragstart', this._onMarkerDragStart, this)
     .on('dragend',   this._onMarkerDragEnd,   this);

    this._anchor = new L.CircleMarker(this._latlng,
      L.Util.extend({}, L.LabeledMarker.prototype.options.anchorOptions,
        opts.anchorOptions));

    this._line = new L.Polyline([this._latlng, this._marker.getLatLng()],
      L.Util.extend({}, L.LabeledMarker.prototype.options.lineOptions,
        opts.lineOptions));
  },


  /**
   * Store shift to be precise while dragging
   * @param  {Event} evt
   */
  _onMarkerDragStart(evt) {
    this._initialDistance = L.DomEvent.getMousePosition(evt)
      .subtract(this._map.latLngToContainerPoint(this._marker.getLatLng()));
    this.fire('label:' + evt.type, evt);
    //L.Util.requestAnimFrame(this._marker.bringToFront, this._marker);
  },


  /**
   * Line dragging
   * @param  {DragEvent} evt
   */
  _onMarkerDrag(evt) {
    const latlng = this._map.containerPointToLatLng(
      L.DomEvent.getMousePosition(evt)._subtract(this._initialDistance));
    this._line.setLatLngs([latlng, this._latlng]);
    this.fire('label:' + evt.type, evt);
  },


  _onMarkerDragEnd(evt) {
    this._line.setLatLngs([this._marker.getLatLng(), this._latlng]);
    this.fire('label:' + evt.type, evt);
  },


  enableDragging() {
    if (this._marker.dragging) this._marker.dragging.enable();
    return this;
  },


  disableDragging() {
    if (this._marker.dragging) this._marker.dragging.disable();
    return this;
  }

});


/**
 * @param  {Object} feature
 * @param  {String=} key
 * @return {Object}
 */
function toGeometryCollection(feature, key) {
  key = key || 'labelPosition';
  const anchorPos = feature.geometry.coordinates.slice();
  let labelPos  = feature.properties[key];

  if (!labelPos) throw new Error('No label position set');

  labelPos = labelPos.slice();
  const geometries = [{
    type: 'Point',
    coordinates: anchorPos
  }, {
    type: 'LineString',
    coordinates: [
      anchorPos.slice(),
      labelPos
    ]
  }, {
    type: 'Point',
    coordinates: labelPos.slice()
  }, {
    type: 'Point',
    coordinates: labelPos.slice()
  }];

  return {
    type: 'Feature',
    properties: L.Util.extend({}, feature.properties, {
      geometriesTypes: ['anchor', 'connection', 'label', 'textbox']
    }),
    bbox: feature.bbox,
    geometry: {
      type: 'GeometryCollection',
      geometries: geometries
    }
  };
}

L.LabeledMarker.toGeometryCollection = toGeometryCollection;

L.labeledCircleMarker = (latlng, feature, options) => {
  return new L.LabeledMarker(latlng, feature, options);
};
