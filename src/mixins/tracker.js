import { Point, Interval } from '../utils/getTrackerLanes';

export default {
    data() {
        return {
            timer: null,
            reference: null,
            scale: null,
            pause: true,
            play: null,
            worker: null
        }
    },
    methods: {
        getTimeRange(dateTimeStart, dateTimeEnd) {
            const reference = this.reference;

            if (reference > dateTimeEnd)
                return [dateTimeStart, reference];

            if (reference < dateTimeStart)
                return [reference, dateTimeEnd];

            return [dateTimeStart, reference];
        },
        setPause(n) {
            if (isBoolean(n)) this.pause = n;
            else this.pause = !this.pause;
        },
        findPassingEntriesWhenPlay(lanes, dateTimeStart, dateTimeEnd, playDuration) {
            const entries = [],
                referenceTimestamp = this.reference.getTime();

            for (let i = 0, l = lanes.length; i < l; i += 1) {
                const lane = lanes[i];

                for (let I = 0, L = lane.length; I < L; I += 1) {
                    const entry = lane[I];

                    if (entry instanceof Point) {
                        const speed = (dateTimeEnd.getTime() - dateTimeStart.getTime()) / playDuration * 16,
                            atTimestamp = entry.at.getTime();

                        if (referenceTimestamp <= atTimestamp && (referenceTimestamp + speed) >= atTimestamp) {
                            entries.push(entry);
                        }
                    }

                    else {
                        const fromTimestamp = entry.from.getTime(),
                            toTimestamp = entry.to.getTime(),
                            speed = (dateTimeEnd.getTime() - dateTimeStart.getTime()) / playDuration * 16;

                        if ((referenceTimestamp >= fromTimestamp && referenceTimestamp <= toTimestamp)
                            || (referenceTimestamp <= fromTimestamp && (referenceTimestamp + speed) >= toTimestamp)
                        ) {
                            entries.push(entry);
                        }
                    }
                }
            }

            return entries;
        },
        findPassingEntriesWhenDrag(lanes, dateTimeStart, dateTimeEnd, oldX) {
            const entries = [],
                referenceTimestamp = this.reference.getTime(),
                oldReferenceTimestamp = this.scale.invert(oldX).getTime();

            for (let i = 0, l = lanes.length; i < l; i += 1) {
                const lane = lanes[i];

                for (let I = 0, L = lane.length; I < L; I += 1) {
                    const entry = lane[I];

                    if (entry instanceof Point) {
                        const atTimestamp = entry.at.getTime();

                        if ((oldReferenceTimestamp < referenceTimestamp && oldReferenceTimestamp <= atTimestamp && referenceTimestamp >= atTimestamp)
                            || (oldReferenceTimestamp > referenceTimestamp && referenceTimestamp <= atTimestamp && oldReferenceTimestamp >= atTimestamp)
                        ) {
                            entries.push(entry);
                        }
                    }

                    else {
                        const fromTimestamp = entry.from.getTime(),
                            toTimestamp = entry.to.getTime();

                        if (oldReferenceTimestamp < referenceTimestamp && !(oldReferenceTimestamp > toTimestamp || referenceTimestamp < fromTimestamp)
                            || oldReferenceTimestamp > referenceTimestamp && !(referenceTimestamp > toTimestamp || oldReferenceTimestamp < fromTimestamp)
                        ) {
                            entries.push(entry);
                        }
                    }
                }
            }

            return entries;
        },
        getNextEntryFrom(lanes) {
            let next;

            for (let i = 0, l = lanes.length; i < l; i += 1) {
                const lane = lanes[i];

                for (let I = 0, L = lane.length; I < L; I += 1) {
                    const entry = lane[I];

                    if (entry instanceof Interval && entry.from > this.reference) {
                        next = !next ? entry.from : (next > entry.from ? entry.from : next);
                        break;
                    }

                    else if (entry instanceof Point && entry.at > this.reference) {
                        next = !next ? entry.at : (next > entry.at ? entry.at : next);
                        break;
                    }
                }
            }

            return next;
        }
    },
    watch: {
        pause(n, o) {
            if (n) this.timer.stop();
            if (!n) this.play();

            this.$emit('change', n);
        }
    }
};
