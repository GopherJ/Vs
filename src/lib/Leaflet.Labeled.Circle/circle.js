import L from 'leaflet';

L.TextCircle = L.CircleMarker.extend({

    options: {
        textStyle: {
            color: '#fff',
            fontSize: 12,
            fontWeight: 300
        },
        shiftY: 7,
    },


    /**
     * @class LabeledCircle
     * @constructor
     * @extends {L.CircleMarker}
     * @param  {String}   text
     * @param  {L.LatLng} latlng
     * @param  {Object=}  options
     */
    initialize(text, latlng, options) {
        /**
         * @type {String}
         */
        this._text        = text;

        /**
         * @type {SVGTextElement}
         */
        this._textElement = null;

        /**
         * @type {TextNode}
         */
        this._textNode    = null;

        /**
         * @type {Object|Null}
         */
        this._textLayer   = null;

        L.CircleMarker.prototype.initialize.call(this, latlng, options);
    },


    /**
     * @param {String} text
     * @return {LabeledCircle}
     */
    setText(text) {
        this._text = text;
        if (this._textNode) {
            this._textElement.removeChild(this._textNode);
        }
        this._textNode = document.createTextNode(this._text);
        this._textElement.appendChild(this._textNode);

        return this;
    },


    /**
     * @return {String}
     */
    getText() {
        return this._text;
    },


    /**
     * Also bring text to front
     * @override
     */
    bringToFront() {
        L.CircleMarker.prototype.bringToFront.call(this);
        this._groupTextToPath();
    },


    /**
     * @override
     */
    bringToBack() {
        L.CircleMarker.prototype.bringToBack.call(this);
        this._groupTextToPath();
    },


    /**
     * Put text in the right position in the dom
     */
    _groupTextToPath() {
        const path        = this._path;
        const textElement = this._textElement;
        const next        = path.nextSibling;
        const parent      = path.parentNode;


        if (textElement && parent) {
            if (next && next !== textElement) {
                parent.insertBefore(textElement, next);
            } else {
                parent.appendChild(textElement);
            }
        }
    },


    /**
     * Position the text in container
     */
    _updatePath() {
        L.CircleMarker.prototype._updatePath.call(this);
        this._updateTextPosition();
    },


    /**
     * @override
     */
    _transform(matrix) {
        L.CircleMarker.prototype._transform.call(this, matrix);

        // wrap textElement with a fake layer for renderer
        // to be able to transform it
        this._textLayer = this._textLayer || { _path: this._textElement };
        if (matrix) {
            this._renderer.transformPath(this._textLayer, matrix);
        } else {
            this._renderer._resetTransformPath(this._textLayer);
            this._updateTextPosition();
            this._textLayer = null;
        }
    },


    /**
     * @param  {L.Map} map
     * @return {LabeledCircle}
     */
    onAdd(map) {
        L.CircleMarker.prototype.onAdd.call(this, map);
        this._initText();
        this._updateTextPosition();
        this.setStyle();
        return this;
    },


    /**
     * Create and insert text
     */
    _initText() {
        this._textElement = L.SVG.create('text');
        this._renderer._rootGroup.appendChild(this._textElement);
        this.setText(this._text);
    },


    /**
     * Calculate position for text
     */
    _updateTextPosition() {
        const textElement = this._textElement;
        if (textElement) {
            textElement.style.display = 'block';
            const bbox = textElement.getBBox();
            const textPosition = this._point.subtract(
                L.point(bbox.width, -bbox.height + this.options.shiftY).divideBy(2));

            textElement.setAttribute('x', textPosition.x);
            textElement.setAttribute('y', textPosition.y);
            this._groupTextToPath();
        }
    },


    /**
     * Set text style
     */
    setStyle(style) {
        L.CircleMarker.prototype.setStyle.call(this, style);
        if (this._textElement) {
            const styles = this.options.textStyle;
            for (let prop in styles) {
                if (styles.hasOwnProperty(prop)) {
                    let styleProp = prop;
                    if (prop === 'color') {
                        styleProp = 'stroke';
                    }
                    this._textElement.style[styleProp] = styles[prop];
                }
            }
        }
    },


    /**
     * Remove text
     */
    onRemove(map) {
        if (this._textElement) {
            if (this._textElement.parentNode) {
                this._textElement.parentNode.removeChild(this._textElement);
            }
            this._textElement = null;
            this._textNode = null;
            this._textLayer = null;
        }

        return L.CircleMarker.prototype.onRemove.call(this, map);
    }

});


L.textCircle = (text, latlng, options) => new L.TextCircle(text, latlng, options);
