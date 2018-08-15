import * as d3 from 'd3';

function smoothMoveLineX(line, x0) {
        let hueActual = x0,
            hueTarget = x0,
            hueAlpha = 0.2,
            hueTimer = d3.timer(hueTween);

        return function hue(x) {
            hueTarget = x;
            hueTimer.restart(hueTween);
        };

        function hueTween() {
            let hueError = hueTarget - hueActual;
            if (hueError < 1e-3) hueActual = hueTarget, hueTimer.stop();
            else hueActual += hueAlpha * hueError;

            line
                .attr('x1', hueActual)
                .attr('x2', hueActual);
        }
}

function smoothMoveCircleX(circle, hueMin, hueMax, onMoved) {
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
            if (hueError < 1e-3) hueActual = hueTarget, hueTimer.stop();
            else hueActual += hueAlpha * hueError;

            circle
                .attr('cx', hueActual);

            onMoved(hueActual);
        }
}


function smoothMoveRectX(rect, x0, w) {
        let hueActual = x0,
            hueTarget = x0,
            hueAlpha = 0.2,
            hueTimer = d3.timer(hueTween);

        return function hue(x) {
            hueTarget = x;
            hueTimer.restart(hueTween);
        };

        function hueTween(x) {
            let hueError = hueTarget - hueActual - w / 2;
            if (hueError < 1e-3) hueActual = hueTarget - w / 2, hueTimer.stop();
            else hueActual += hueAlpha * hueError;

            rect
                .attr('x', hueActual);
        }
}


export {
    smoothMoveCircleX,
    smoothMoveLineX,
    smoothMoveRectX
};
