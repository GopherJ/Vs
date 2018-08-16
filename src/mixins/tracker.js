import { isBoolean } from 'lodash';
import { hideTip } from '../plugins/tooltip';

export default {
    data() {
        return {
            timer: null,
            reference: null,
            scale: null,
            pause: true,
            play: null,
            observer: null
        }
    },
    methods: {
        setPause(n) {
            if (isBoolean(n)) this.pause = n;
            else this.pause = !this.pause;
        }
    },
    watch: {
        pause(n) {
            if (n) this.timer.stop();
            if (!n) this.play();

            this.$emit('change', n);
        }
    },
    mounted() {
        this.observer = new MutationObserver(_ => {
            hideTip();
        }).observe(this.$el, { childList: true, subtree: true });
    },
    beforeDestroy() {
        this.observer.disconnect();
    }
};
