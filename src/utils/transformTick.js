import * as d3 from 'd3';

const transformFirstTickTextToTextAnchorStart = (svg) => {
    svg.select('.axis.axis--x .tick:first-of-type text')
        .attr('text-anchor', 'start');
};

const transformLastTickTextToTextAnchorEnd = (svg) => {
    svg.select('.axis.axis--x .tick:last-child text')
        .attr('text-anchor', 'end');
};

const rotateAxisXTicks = function (texts, deg) {
    texts
        .each(function () {
            const text = d3.select(this);

            text
                .attr('text-anchor', 'end')
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr('transform', `rotate(${deg})`);
        });
};


export {
    transformFirstTickTextToTextAnchorStart,
    transformLastTickTextToTextAnchorEnd,
    rotateAxisXTicks
};
