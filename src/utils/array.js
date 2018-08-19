export const isArray = Array.isArray;

export const isSimpleExtent = arr => isArray(arr) && arr.length === 2;

export const isExtent = arr => isArray(arr) && isArray(arr[0]) && arr[0].length === 2 && isArray(arr[1]) && arr[1].length === 2;

export const map = Array.prototype.map;

export const slice = Array.prototype.slice;
