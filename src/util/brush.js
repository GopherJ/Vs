import * as d3 from 'd3';
import emit from './emit';
import _ from 'lodash';

function brush(svg, extent, scale, data) {
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
                const bisecLeft = d3.bisector(d => scale(d.key)).left;

                let idx1 = bisecLeft(data, x1),
                    idx2 = bisecLeft(data, x2);

                if (idx2 > data.length - 1) {
                    idx2 -= 1;
                }

                const dateTimeStart = _.isNumber(data[idx1].key) ? new Date(data[idx1].key) : data[idx1].key,
                    dateTimeEnd = _.isNumber(data[idx2].key) ? new Date(data[idx2].key) : data[idx2].key;

                emit(this, 'range-updated', dateTimeStart, dateTimeEnd);
            }

            if (_.isFunction(scale.bandwidth)) {
                const bisecLeft = d3.bisector(d => scale(d.key) + scale.bandwidth() / 2).left;

                let idx1 = bisecLeft(data, x1),
                    idx2 = bisecLeft(data, x2);

                if (idx2 > data.length - 1) {
                    idx2 -= 1;
                }

                const dateTimeStart = _.isNumber(data[idx1].key) ? new Date(data[idx1].key) : data[idx1].key,
                    dateTimeEnd = _.isNumber(data[idx2].key) ? new Date(data[idx2].key) : data[idx2].key;

                emit(this, 'range-updated', dateTimeStart, dateTimeEnd);
            }

            brush.move(b, null);
        });

    b.call(brush);
}

export default brush;
