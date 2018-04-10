// how to make svg respond to window
// https://bl.ocks.org/curran/3a68b0c81991e2e94b19

/**
 * compute width and height of d3SankeyCircular
 */
const compute_html_element_w_h = (selection) => {
    return [selection.node().getBoundingClientRect().width, selection.node().getBoundingClientRect().height]
};


/**
 * compute offset of svg elements
 */
const compute_selection_offset = (selection) => {
    // https://stackoverflow.com/questions/21990857/d3-js-how-to-get-the-computed-width-and-height-for-an-arbitrary-element

    // for svg elements we can only use selection.node().getBBox()
    // {
    //     height: 5,
    //         width: 5,
    //     y: 50,
    //     x: 20
    // }
    return [selection.node().getBBox().x,
            selection.node().getBBox().y];

    // for html elements we can use selection.node().getBoundingClientRect()
    // left, right
    // top, bottom
    // height, width
};


/**
 * calculate d3.selection's width and height
 *
 * https://stackoverflow.com/questions/21990857/d3-js-how-to-get-the-computed-width-and-height-for-an-arbitrary-element/42247372
 * @param selection
 */
const compute_selection_w_h = (selection) => {
    return [selection.node().getBBox().width,
        selection.node().getBBox().height];
};




export default {
    compute_selection_w_h,
    compute_html_element_w_h,
    compute_selection_offset
};
