/**
 *
 * @param context
 * @param eventName
 * @param args
 */
function emit(context, eventName, ...args) {
    context.$emit(eventName, ...args);

    if (context.$root === context) {
        return;
    }


    if (context.$parent.i) {
        context.$root.$emit(eventName, {
            i: context.$parent.i,
            payload: args
        });
    }

    context.$root.$emit(eventName, ...args);
}

export default emit;
