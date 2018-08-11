/**
 *
 * make line round
 *
 * @param {d3.Selection} line
 * @param {Boolean} rounded
 */
function roundLine(line, rounded) {
    if (!rounded) return;

    line
        .attr('stroke-linecap', 'round');
}

export default roundLine;
