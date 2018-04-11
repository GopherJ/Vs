const namespaced = true;

const state = {
    interval: 60 * 1000,
    data: []
};

const mutations = {
    UPDATE_INTERVAL(state, interval) {
        state.interval = interval;
    },
    UPDATE_DATA(state, data) {
        state.data = data;
    }
};

const getters = {
    GET_TIMELION_DATA(state) {
        return state.data;
    }
};

export default {
    namespaced,
    state,
    mutations,
    getters
};
