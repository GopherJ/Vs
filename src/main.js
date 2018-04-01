/* eslint-disable */
import d3SankeyCircular from './components/d3SankeyCircular';
import d3Timelion from './components/d3Timelion';
import d3Pie from './components/d3Pie';

const install = (Vue, options = {}) => {
    if (options.store) {
        // register store
    }

    Vue.component(d3SankeyCircular.name, d3SankeyCircular);
    Vue.component(d3Timelion.name, d3Timelion);
    Vue.component(d3Pie.name, d3Pie);
};

export default {
    // global install
    install,

    // local install
    d3SankeyCircular,
    d3Timelion,
    d3Pie
};

