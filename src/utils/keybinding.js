import * as d3 from 'd3';
import { isFirefox } from './navigator';

/**
 *
 * @param callback
 */
const onspace = callback => {
    if (isFirefox) {
        d3.select('body')
            .on('keypress', () => {
                const ev = d3.event;
                if (ev.keyCode !== 0 || ev.shiftKey || ev.ctrlKey || ev.altKey) return;
                if (ev.target === document.body) ev.preventDefault();

                callback();
        });
    }

    else {
        d3.select('body')
            .on('keydown', () => {
                const ev = d3.event;
                if (ev.keyCode !== 32) return;
                if (ev.target === document.body) ev.preventDefault();

                callback();
        });
    }
};

export default {
    onspace
};

