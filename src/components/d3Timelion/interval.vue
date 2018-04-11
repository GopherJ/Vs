<template>
    <select id="" v-model="selected">
        <option v-for="prop in intervals" :value="intervals[prop]">
            {{ prop }}
        </option>
    </select>
</template>

<script>
    /**
     * interval constants
     * @type {number}
     */
    const ms = 1,
        s = 1000 * ms,
        m = 60 * s,
        h = 60 * m,
        d = 24 * h,
        w = 7 * d,
        M = 30 * d,
        y = 365 * d;

    export default {
        name: 'interval',
        data: () => ({
            intervals: {
                'Millisecond': ms,
                'Second': s,
                'Minute': m,
                'Hourly': h,
                'Daily': d,
                'Weekly': w,
                'Monthly': M,
                'Yearly': y
            }
        }),
        props: {
            interval: {
                type: Number,
                default: m
            }
        },
        computed: {
            selected: {
                get() {
                    return this.interval;
                },
                set(n, o) {
                    if (n !== o) {
                        this.$emit('interval-updated', n);
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
