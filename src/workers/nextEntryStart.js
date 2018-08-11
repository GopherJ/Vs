import { Point, Interval } from '../utils/getTrackerLanes';

const message = 'nextEntryStart';

const func = (lanes, reference) => {
    let next;

    for (let i = 0, l = lanes.length; i < l; i += 1) {
        const lane = lanes[i];

        for (let I = 0, L = lane.length; I < L; I += 1) {
            const entry = lane[I];

            if (entry instanceof Interval && entry.from > reference) {
                next = !next ? entry.from : (next > entry.from ? entry.from : next);
                break;
            }

            else if (entry instanceof Point && entry.at > reference) {
                next = !next ? entry.at : (next > entry.at ? entry.at : next);
                break;
            }
        }
    }

    return next;
};

export default {
    message,
    func
};
