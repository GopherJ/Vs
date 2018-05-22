/**
 *
 * @type {Readonly<{Millisecond: number, Second: number, Minute: number, Hour: number, Day: number, Week: number, Month: number, Year: number}>}
 */
const INTERVAL = Object.freeze({
    Millisecond : 1,
    Second : 1000,
    Minute: 60 * 1000,
    Hour : 60 * 60 * 1000,
    Day : 24 * 60 * 60 * 1000,
    Week : 7 * 24 * 60 * 60 * 1000,
    Month : 30 * 24 * 60 * 60 * 1000,
    Year : 365 * 24 * 60 * 60 * 1000
});

export default INTERVAL;
