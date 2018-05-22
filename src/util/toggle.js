import * as d3 from 'd3';

const toggleCross = (container, rect, stroke, strokeWidth) => {
    const selection = container.selectAll('line');
    if (!selection.empty()) {
        selection.remove();
        return;
    }

    const pos = rect.node().getBBox();

    const x1 = pos.x,
        y1 = pos.y,
        x2 = pos.x + pos.width,
        y2 = pos.y + pos.height;

    container.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', stroke)
        .attr('stroke-width', strokeWidth)
        .attr('pointer-events', 'none');

    container.append('line')
        .attr('x1', x2)
        .attr('y1', y1)
        .attr('x2', x1)
        .attr('y2', y2)
        .attr('stroke', stroke)
        .attr('stroke-width', strokeWidth)
        .attr('pointer-events', 'none');
};

const toggleClass = (svg, className) => {
    svg
        .selectAll(className)
        .each(function () {
            const selection = d3.select(this),
                display = selection.style('display');

            selection.style('display', display === 'inline' ? 'none' : 'inline');
        });
};

export {
    toggleCross,
    toggleClass
};

