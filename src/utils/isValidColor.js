/**
 * check if a string is a correct color format using browser
 *
 * @param {String} c
 */
function isValidColor(c) {
    let el = document.createElement('div');
    el.style.color = c;

    return el.style.color.length !== 0;
}

export default isValidColor;
