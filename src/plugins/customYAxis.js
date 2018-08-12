/**
 *
 * @param g
 * @param yAxis
 */
const customYAxis = (g, yAxis) => {
    g.call(yAxis);
    g.select('.domain').remove();
    g.selectAll('.tick:not(:first-of-type) line').attr('stroke', '#777').attr('stroke-dasharray', '2,2');
    g.selectAll('.tick text').attr('x', 4).attr('dy', -4);
};

export default customYAxis;
