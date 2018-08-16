import * as d3 from 'd3';
import { isFunction } from 'lodash';

function smoothMoveCircleX(circle, hueMin, hueMax, onMoving, onMoved) {
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

            circle
                .attr('cx', hueActual);

            isFunction(onMoving) && onMoving(hueActual);
        }
}

export {
    smoothMoveCircleX,
};
