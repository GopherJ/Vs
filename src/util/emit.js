/**
 *
 * @param instance
 * @param eventName
 * @param args
 */
function emit(instance, eventName, ...args) {
    instance.$emit(eventName, ...args);

    if (instance.$root === instance) {
        return;
    }


    if (instance.$parent.i) {
        instance.$root.$emit(eventName, {
            i: instance.$parent.i,
            payload: args
        });
    } else {
        instance.$root.$emit(eventName, ...args);
    }
}

export default emit;
