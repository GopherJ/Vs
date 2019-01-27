/*
 * L.TileLayer.Grayscale is a regular tilelayer with grayscale makeover.
 */

import L from 'leaflet';

L.TileLayer.Grayscale = L.TileLayer.extend({
    options: {
        quotaRed: 21,
        quotaGreen: 71,
        quotaBlue: 8,
        quotaDividerTune: 0,
        quotaDivider() {
            return this.quotaRed + this.quotaGreen + this.quotaBlue + this.quotaDividerTune;
        }
    },

    initialize(url, options = {}) {
        // so that we can access pixel data of tile
        options.crossOrigin = true;
        L.TileLayer.prototype.initialize.call(this, url, options);

        this.on('tileload', function (e) {
            this._makeGrayscale(e.tile);
        });
    },

    _createTile() {
        const tile = L.TileLayer.prototype._createTile.call(this);
        tile.crossOrigin = 'Anonymous';
        return tile;
    },

    _makeGrayscale(img) {
        if (img.getAttribute('data-grayscaled')) return;

        // img hosted server need also return 'Acess-Control-Allow-Origin' : '*'
        img.crossOrigin = '';

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pix = imgd.data;
        for (let i = 0, n = pix.length; i < n; i += 4) {
            // calculate brightness
            pix[i] = pix[i + 1] = pix[i + 2] = (this.options.quotaRed * pix[i] + this.options.quotaGreen * pix[i + 1] + this.options.quotaBlue * pix[i + 2]) / this.options.quotaDivider();
        }
        ctx.putImageData(imgd, 0, 0);
        img.setAttribute('data-grayscaled', true);
        img.src = canvas.toDataURL();
    },
});

L.tileLayer.grayscale = function (url, options) {
    return new L.TileLayer.Grayscale(url, options);
};
