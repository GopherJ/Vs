/* eslint-disable */
import d3SankeyCircular from './components/d3SankeyCircular';
import d3Timelion from './components/d3Timelion';
// import d3Timeline from './components/d3Timeline';
import d3Pie from './components/d3Pie';
import d3Line from './components/d3Line';
import d3Bar from './components/d3Bar';
import d3ProgressArc from './components/d3ProgressArc';
// import Buefy from 'buefy';
import 'buefy/lib/buefy.min.css';

const install = (Vue, options = {}) => {
    if (options.store) {
        // register store
    }
    Vue.component(d3SankeyCircular.name, d3SankeyCircular);
    Vue.component(d3Timelion.name, d3Timelion);
    // Vue.component(d3Timeline.name, d3Timeline);
    Vue.component(d3ProgressArc.name, d3ProgressArc);
    Vue.component(d3Pie.name, d3Pie);
    Vue.component(d3Line.name, d3Line);
    Vue.component(d3Bar.name, d3Bar);
};

export default {
    // global install
    install,

    // local install
    d3SankeyCircular,
    d3Timelion,
    d3ProgressArc,
    // d3Timeline,
    d3Pie,
    d3Line,
    d3Bar
};

