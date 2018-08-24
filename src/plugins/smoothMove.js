import * as d3 from 'd3';
import { isFunction } from 'lodash';

/**
 *
 * @param selection
 * @param x
 */
const moveX = (selection, x) => {
    switch (selection.node().tagName.toLowerCase()) {
        case 'circle':
            selection.attr('cx', x);
            break;
        case 'line':
            selection.attr({
                x1: x,
                x2: x
            });
            break;
        case 'rect':
            const w = +selection.node().getBBox().width;
            selection.attr('x',  x - w / 2);
            break;
    }
};

/**
 *
 * @param selection
 * @param hueMin
 * @param hueMax
 * @param onMoving
 * @param onMoved
 * @return {hue}
 */
const smoothMoveX = (selection, hueMin, hueMax, onMoving, onMoved) => {
        let hueActual = hueMin,
            hueTarget = hueMin,
            hueAlpha = 0.2,
            hueTimer = d3.timer(hueTween);

        return function hue(x) {
            hueTarget = x < hueMin ? hueMin : x > hueMax ? hueMax : x;
            hueTimer.restart(hueTween);
        };

        function hueTween() {
            let hueError = hueTarget - hueActual;
            if (hueError < 1e-3) hueActual = hueTarget, hueTimer.stop(), isFunction(onMoved) && onMoved(hueActual);
            else hueActual += hueAlpha * hueError;

            selection.call(moveX, hueActual);

            isFunction(onMoving) && onMoving(hueActual);
        }
};


/**
 *
 * @param selection
 * @param y
 */
const moveY = (selection, y) => {
    switch (selection.node().tagName.toLowerCase()) {
        case 'circle':
            selection.attr('cy', y);
            break;
    }
};


/**
 *
 * @param selection
 * @param hueMin
 * @param hueMax
 * @param onMoving
 * @param onMoved
 * @return {hue}
 */
const smoothMoveY = (selection, hueMin, hueMax, onMoving, onMoved) => {
    let hueActual = hueMax,
        hueTarget = hueMax,
        hueAlpha = 0.2,
        hueTimer = d3.timer(hueTween);

    return function hue(y) {
        hueTarget = y < hueMin ? hueMin : y > hueMax ? hueMax : y;
        hueTimer.restart(hueTween);
    };

    function hueTween() {
        let hueError = hueTarget - hueActual;
        if (hueError < 1e-3) hueActual = hueTarget, hueTimer.stop(), isFunction(onMoved) && onMoved(hueActual);
        else hueActual += hueAlpha * hueError;

        selection.call(moveY, hueActual);

        isFunction(onMoving) && onMoving(hueActual);
    }
};

export {
    smoothMoveX,
    smoothMoveY
};
