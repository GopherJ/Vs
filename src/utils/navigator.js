/**
 *
 * detect if the navigator is firefox
 *
 * @type {boolean}
 */
export const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

/**
 *
 * https://stackoverflow.com/questions/4565112/javascript-how-to-find-out-if-the-user-browser-is-chrome
 *
 * detect if the navigator is chrome
 *
 * @type {boolean}
 */
export const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

/**
 *
 * https://stackoverflow.com/questions/7944460/detect-safari-browser/23522755
 *
 * detect if the navigator is safari
 *
 * @type {boolean}
 */
export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

/**
 * max concurrency of navigator
 */
export const hardwareConcurrency = navigator.hardwareConcurrency || 4;
