/**
 * https://stackoverflow.com/questions/12115691/svg-d3-js-rounded-corner-on-one-corner-of-a-rectangle
 *
 * x-coordinate
 * y-coordinate
 * width
 * height
 * corner radius
*  top_left rounded?
*  top_right rounded?
*  bottom_left rounded?
*  bottom_right rounded?
 *
 * @param x
 * @param y
 * @param w
 * @param h
 * @param r
 * @param tl
 * @param tr
 * @param bl
 * @param br
 * @returns {string}
 */
function roundedRect(x, y, w, h, r, tl, tr, bl, br) {
    let retval;
    retval  = 'M' + (x + r) + ',' + y;
    retval += 'h' + (w - 2*r);
    if (tr) { retval += 'a' + r + ',' + r + ' 0 0 1 ' + r + ',' + r; }
    else { retval += 'h' + r; retval += 'v' + r; }
    retval += 'v' + (h - 2*r);
    if (br) { retval += 'a' + r + ',' + r + ' 0 0 1 ' + -r + ',' + r; }
    else { retval += 'v' + r; retval += 'h' + -r; }
    retval += 'h' + (2*r - w);
    if (bl) { retval += 'a' + r + ',' + r + ' 0 0 1 ' + -r + ',' + -r; }
    else { retval += 'h' + -r; retval += 'v' + -r; }
    retval += 'v' + (2*r - h);
    if (tl) { retval += 'a' + r + ',' + r + ' 0 0 1 ' + r + ',' + -r; }
    else { retval += 'v' + -r; retval += 'h' + r; }
    retval += 'z';
    return retval;
}

export default roundedRect;
