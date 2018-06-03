import * as d3 from 'd3';

function moveLine(line, x, y) {
        let hueActual = 0,
            hueTarget = 0,
            hueError = 0,
            hueAlpha = 0.2,
            hueTimer = d3.timer(hueTween);

        function hue(x) {
            hueTarget = x;
            hueTimer.restart(hueTween);
        }

        function hueTween(x) {
            hueError = hueTarget - hueActual;
            if (hueError < 1e-3) hueActual = hueTarget, hueTimer.stop();
            else hueActual += hueAlpha * hueError;

            line
                .attr('x1', hueActual)
                .attr('x2', hueActual);
    }
}


function moveRect(rect, dx, dy) {

}

