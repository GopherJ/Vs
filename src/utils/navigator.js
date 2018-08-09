/**
 *
 * detect if the navigator is firefox
 *
 * @type {boolean}
 */
export const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

/**
 * max concurrency of navigator
 */
export const hardwareConcurrency = navigator.hardwareConcurrency || 4;
