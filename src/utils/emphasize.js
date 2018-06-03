import * as d3 from 'd3';

function emphasize(innerRadius, outerRadius, xScale, yScale, fill, fillOpacity) {
    const arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(0)
        .endAngle(2 * Math.PI);

    return d3.select(this.parentNode)
        .append('path')
        .attr('transform', d => `translate(${xScale(d.key)}, ${yScale(d.value)})`)
        .attr('d', arc)
        .attr('fill', fill)
        .attr('fillOpacity', fillOpacity)
        .node();
}

export default emphasize;
