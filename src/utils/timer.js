import * as d3 from 'd3';

/**
 *
 * @param fn
 * @param interval
 * @return {*|Timer}
 * @constructor
 */
function Timer(fn, interval) {
    if (!this instanceof Timer) return new Timer(fn, interval);

    this._isStarted = false;
    this._fn = fn;
    this._interval = interval;
    this._timer = null;
}

/**
 *
 * @type {{constructor: Timer, start: (function(): Timer), stop: (function(): Timer), restart: (function(*): Timer), isStarted: (function(): boolean), timer: (function(): (null|*))}}
 */
Timer.prototype = {
    constructor: Timer,
    start: function () {
        this._isStarted = true;
        this._timer = d3.interval(this._fn, this._interval);

        return this;
    },
    stop: function() {
        if (this._isStarted) this._timer.stop();

        return this;
    },
    restart: function(interval) {
        this.stop();

        if (arguments.length) {
            this._interval = interval;
        }

        this._timer = d3.interval(this._fn, this._interval);

        return this;
    },
    isStarted: function () {
        return this._isStarted;
    }
};

export default Timer;
