import * as d3 from 'd3';
import { isNull, isUndefined, isFunction, } from 'lodash';
import { map } from '../utils/array';

/*
    ToDo: check if it's user-driven event

    https://github.com/d3/d3-selection/issues/122
 */

/**
 *
 * @param extent
 * @param scale
 * @param data
 * @return {*[]}
 */
const brushInvertX = (extent, scale, data) => {
    if (isNull(d3.event.selection)) return;

    const [xLeft, xRight] = map
        .call(d3.event.selection, el => el - extent[0][0]);

    if (isFunction(scale.invert)) return {
        start: scale.invert(xLeft),
        end: scale.invert(xRight)
    };

    if (!isFunction(scale.bandwidth)) {
        const bisector = d3.bisector(d => d.key);

        return {
            start: data[bisector.left(data, xLeft)].key,
            end: data[bisector.right(data, xRight) - 1].key
        };
    }

    const bisecLeft  = d3.bisector(d => scale(d.key) + scale.bandwidth()).left;
    const bisecRight = d3.bisector(d => scale(d.key)).right;

    return {
        start: data[bisecLeft(data, xLeft, 0, data.length - 1)].key,
        end: data[bisecRight(data, xRight) - 1].key
    };
};

/**
 *
 * @param extent
 * @param scale
 * @param data
 * @return {*[]}
 */
const brushInvertY = (extent, scale, data) => {
    if (isNull(d3.event.selection)) return;

    const [yTop, yBottom] = map
        .call(d3.event.selection, el => el - extent[0][1]);

    if (isFunction(scale.invert)) return {
        start: scale.invert(yTop),
        end: scale.invert(yBottom)
    };

    if (!isFunction(scale.bandwidth)) {
        const bisector  = d3.bisector(d => d.key);

        return {
            start: data[bisector.left(data, yTop)].key,
            end: data[bisector.right(data, yBottom) - 1].key
        };
    }

    const bisecLeft  = d3.bisector(d => scale(d.key) + scale.bandwidth()).left;
    const bisecRight = d3.bisector(d => scale(d.key)).right;

    return {
        start: data[bisecLeft(data, yTop, 0, data.length - 1)].key,
        end: data[bisecRight(data, yBottom) - 1].key
    };
};

/**
 *
 * @param svg
 * @param extent
 * @param scale
 * @param data
 * @param brushed
 * @param brushing
 */
function brushX(svg, extent, scale, { brushed, brushing }, data) {
    const brushSelection = svg.select('.brush');
    let b = !brushSelection.empty()
        ? brushSelection
        : svg.append('g').attr('class', 'brush');

    const brush = d3.brushX();
    const undefinedWrapper = (x, f, clean) => {
        if (!isUndefined(x)) {
            if (clean) brush.move(b, null);
            f(x);
        }
    };


    brush
        .extent(extent);

    brush.on('start', () => {
        b.raise();
    });

    if (isFunction(brushing)) {
        brush.on('brush', () => {
            undefinedWrapper(brushInvertX(extent, scale, data), brushing, false);
        });
    }

    if (isFunction(brushed)) {
        brush.on('end', () => {
            undefinedWrapper(brushInvertX(extent, scale, data), brushed, true);
        });
    }

    b.call(brush);
}

/**
 *
 * @param svg
 * @param extent
 * @param scale
 * @param brushed
 * @param brushing
 * @param data
 */
function brushY(svg, extent, scale, { brushed, brushing }, data) {
    const brushSelection = svg.select('.brush');
    let b = !brushSelection.empty()
        ? brushSelection
        : svg.append('g').attr('class', 'brush');

    const brush = d3.brushY();
    const undefinedWrapper = (x, f, clean) => {
        if (!isUndefined(x)) {
            f(x);
            if (clean) brush.move(b, null);
        }
    };

    brush
        .extent(extent);

    brush.on('start', () => {
        b.raise();
    });

    if (isFunction(brushing)) {
        brush.on('brush', () => {
            undefinedWrapper(brushInvertY(extent, scale, data), brushing, false);
        });
    }

    if (isFunction(brushed)) {
        brush.on('end', () => {
            undefinedWrapper(brushInvertY(extent, scale, data), brushed, true);
        });
    }

    b.call(brush);
}

export {
    brushX,
    brushY
};
