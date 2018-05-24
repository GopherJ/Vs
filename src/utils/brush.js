import * as d3 from 'd3';
import _ from 'lodash';
import emit from './emit';
import isValidDate from './isValidDate';

function brushX(svg, extent, scale, data) {
    const b = svg.append('g')
        .attr('class', 'brush');

    const brush = d3.brushX();

    brush
        .extent(extent)
        .on('end', () => {
            if (_.isNull(d3.event) || _.isNull(d3.event.selection)) {
                return;
            }

            const [x1, x2] = Array.prototype.map
                .call(d3.event.selection, el => el - extent[0][0]);

            if (_.isFunction(scale.invert)) {
                const dateTimeStart = scale.invert(x1),
                    dateTimeEnd = scale.invert(x2);

                emit(this, 'range-updated', dateTimeStart, dateTimeEnd);
            }

            if (_.isFunction(scale.step)) {
                const bisecRight = d3.bisector(d => scale(d.key)).right;

                let idx1 = bisecRight(data, x1),
                    idx2 = bisecRight(data, x2);

                if (idx2 > data.length - 1) {
                    idx2 -= 1;
                }

                const dateTimeStart = data[idx1].key,
                    dateTimeEnd = data[idx2].key;

                if ([dateTimeStart, dateTimeEnd].every(el => isValidDate(el))) {
                    emit(this, 'range-updated', dateTimeStart, dateTimeEnd);
                }
            }

            if (_.isFunction(scale.bandwidth)) {
                const bisecLeft = d3.bisector((d, x) => scale(d.key) + scale.bandwidth() - x).right;

                let idx1 = bisecLeft(data, x1),
                    idx2 = bisecLeft(data, x2);

                if (idx2 > data.length - 1) {
                    idx2 -= 1;
                }

                const dateTimeStart = data[idx1].key,
                    dateTimeEnd = data[idx2].key;

                if ([dateTimeStart, dateTimeEnd].every(el => isValidDate(el))) {
                    emit(this, 'range-updated', dateTimeStart, dateTimeEnd);
                }
            }

            brush.move(b, null);
        });

    b.call(brush);
}

function brushY(svg, extent, scale, data) {
        const b = svg.append('g')
            .attr('class', 'brush');

        const brush = d3.brushY();

        brush
            .extent(extent)
            .on('end', () => {
                if (_.isNull(d3.event) || _.isNull(d3.event.selection)) {
                    return;
                }

                const [y1, y2] = Array.prototype.map
                    .call(d3.event.selection, el => el - extent[0][1]);

                if (_.isFunction(scale.invert)) {
                    const dateTimeStart = scale.invert(y1),
                        dateTimeEnd = scale.invert(y2);

                    emit(this, 'range-updated', dateTimeStart, dateTimeEnd);
                }

                if (_.isFunction(scale.step)) {
                    const bisecLeft = d3.bisector(d => scale(d.key)).right;

                    let idx1 = bisecLeft(data, y1),
                        idx2 = bisecLeft(data, y2);

                    if (idx2 > data.length - 1) {
                        idx2 -= 1;
                    }

                    const dateTimeStart = data[idx1].key,
                        dateTimeEnd = data[idx2].key;

                    if ([dateTimeStart, dateTimeEnd].every(el => isValidDate(el))) {
                        emit(this, 'range-updated', dateTimeStart, dateTimeEnd);
                    }
                }

                if (_.isFunction(scale.bandwidth)) {
                    const bisecLeft = d3.bisector((d, x) => scale(d.key) + scale.bandwidth() - x).right;

                    let idx1 = bisecLeft(data, y1),
                        idx2 = bisecLeft(data, y2);

                    if (idx2 > data.length - 1) {
                        idx2 -= 1;
                    }

                    const dateTimeStart = data[idx1].key,
                        dateTimeEnd = data[idx2].key;

                    if ([dateTimeStart, dateTimeEnd].every(el => isValidDate(el))) {
                        emit(this, 'range-updated', dateTimeStart, dateTimeEnd);
                    }
                }

                brush.move(b, null);
            });

        b.call(brush);
}

export {
    brushX,
    brushY
};
