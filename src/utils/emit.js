/**
 *
 * use $root as eventBus
 *
 * @param {Vue} vm
 * @param {string} eventName
 * @param {array} args
 * @return {void}
 */
function emit(vm, eventName, ...args) {
    vm.$emit(eventName, ...args);

    if (vm.$root === vm) return;

    if (vm.$parent.$props && vm.$parent.$props.i) {
        vm.$root.$emit(eventName, {
            i: vm.$parent.$props.i,
            payload: args
        });
    } else {
        vm.$root.$emit(eventName, ...args);
    }
}

export default emit;
