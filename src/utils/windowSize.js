/**
 *
 * window width
 *
 * @returns {number}
 */
export const windowWidth = () => window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

/**
 *
 * window height
 *
 * @returns {number}
 */
export const windowHeight = () => window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;
