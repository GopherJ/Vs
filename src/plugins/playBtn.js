import { isFunction } from 'lodash';
import shape from './shape';
import roundedRect from './roundedRect';

/**
 *
 * @type {{PLAYING: *, PAUSE: *}}
 */
const STATE = Object.freeze({
    PLAYING: 'PLAYING',
    PAUSE: 'PAUSE'
});

/**
 *
 * @param g
 * @param w
 * @param h
 * @param r
 * @param stroke
 * @param strokeWidth
 * @param onPlaying
 * @param onPause
 */
const playBtn = (g, w, h, r, stroke, strokeWidth, { onPlaying, onPause }) => {
    const btn = g
        .append('g')
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', stroke)
        .attr('stroke-width', strokeWidth)
        .attr('cursor', 'pointer')
        .attr('d', roundedRect(0, 0, w, h, r, true, true, true, true));

    const icon = g
        .append('g')
        .attr('transform', `translate(${(w - h) / 2}, 0)`)
        .append('path')
        .attr('fill', '#000')
        .attr('data-state', STATE.PAUSE)
        .attr('d', shape.triangle(h, h));

    btn.on('click', function () {
        const state = icon.attr('date-state');

        icon
            .attr('data-state', state === STATE.PAUSE ? STATE.PLAYING : STATE.PAUSE)
            .transition()
            .duration(360)
            .attr('d', function () {
                if (state === STATE.PAUSE) {
                    if (isFunction(onPlaying)) onPlaying();
                    return shape.triangle(h, h);
                }

                if (isFunction(onPause)) onPause();
                return shape.pause(h. h);
            });
    });
};

export default playBtn;
