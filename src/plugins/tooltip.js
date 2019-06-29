import * as d3 from 'd3';
import offset from 'document-offset';
import { isFunction } from 'lodash';

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
            .style('left', 0)
            .style('top', 0)
            .style('position', 'absolute')
            .style('display', 'none')
            .style('visibility', 'hidden');
    }
})(d3.select('body'));


/**
 *
 * calculate tooltip offset left
 *
 * @param tooltip
 * @param target
 * @return {number}
 * @constructor
 */
const GetOffsetTop = (tooltip, target) => offset(target).top - tooltip.node().getBoundingClientRect().height - 10;


/**
 *
 * calculate tooltip offset top
 *
 * @param tooltip
 * @param target
 * @return {number}
 * @constructor
 */
const GetOffsetLeft = (tooltip, target) => offset(target).left + target.getBBox().width / 2 - tooltip.node().getBoundingClientRect().width / 2;


/**
 *
 * @param title
 * @param el
 * @return {Function}
 */
function showTip(title, el) {
    return function (d) {
        const target  = el || d3.event.target;

            tooltip
                .html(isFunction(title) ? title(d) : title);

            tooltip
                .style('display', 'block')
                .style('visibility', 'hidden');

            const top = GetOffsetTop(tooltip, target),
                left = GetOffsetLeft(tooltip, target);

            tooltip
                .style('top', `${top}px`)
                .style('left', `${left}px`);

            tooltip
                .style('visibility', 'visible');

            tooltip.node().classList.add('show');
    }
}

/**
 *
 * hide tooltip
 *
 * @return {void}
 */
function hideTip() {
    tooltip
        .style('display', 'none')
        .style('visibility', 'hidden');

    tooltip.node().classList.remove('show');
}

function isTipShowing() {
    return tooltip.style('display') === 'block' && tooltip.style('visibility') === 'visible';
}

export {
    showTip,
    hideTip,
    isTipShowing
};
