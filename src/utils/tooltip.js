import * as d3 from 'd3';
import offset from 'document-offset';

/**
 * get tooltip div
 */
const tooltip = (function (body) {
    const selection = body.select('.d3-tip');

    if (!selection.empty()) {
        return selection;
    } else {
        return body
            .append('div')
            .attr('class', 'd3-tip')
            .style('position', 'absolute')
            .style('visibility', 'hidden');
    }
})(d3.select('body'));

/**
 *
 * calculate tooltip offset top
 *
 * @param {d3.Selection} tooltip
 * @param {HTMLElement} target
 */
const GetOffsetTop = (tooltip, target) => offset(target).top - tooltip.node().getBoundingClientRect().height - 10;


/**
 *
 * calculate tooltip offset left
 *
 * @param {d3.Selection} tooltip
 * @param {HTMLElement} target
 */
const GetOffsetLeft = (tooltip, target) => offset(target).left + target.getBBox().width / 2 - tooltip.node().getBoundingClientRect().width / 2;

/**
 *
 * show tooltip
 *
 * @param {string} title
 * @return {void}
 */
function showTip(title) {
    const target = d3.event.target;

    tooltip
        .html(title);

    const top = GetOffsetTop(tooltip, target),
        left = GetOffsetLeft(tooltip, target);

    tooltip
        .style('top', `${top}px`)
        .style('left', `${left}px`);

    tooltip
        .style('visibility', 'visible');

    tooltip.node().classList.add('show');
}

/**
 *
 * hide tooltip
 *
 * @return {void}
 */
function hideTip() {
    tooltip
        .style('visibility', 'hidden');

    tooltip.node().classList.remove('show');
}

export {
    showTip,
    hideTip
};
