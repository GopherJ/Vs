/* eslint-disable */
import d3SankeyCircular from './components/d3SankeyCircular';
import d3Timelion from './components/d3Timelion';
import d3Timeline from './components/d3Timeline';
import d3Pie from './components/d3Pie';
import d3Line from './components/d3Line';
import d3ProgressArc from './components/d3ProgressArc';
import d3Metric from './components/d3Metric';
import d3Circle from './components/d3Circle';
import d3MultiLine from './components/d3MultiLine';
import d3GroupedArea from './components/d3GroupedArea';
import d3HorizontalBar from './components/d3HorizontalBar';
import d3VerticalBar from './components/d3VerticalBar';
import d3WordCloud from './components/d3WordCloud';
import d3Area from './components/d3Area';
import d3Player from './components/d3Player';
import d3HorizontalSlider from './components/d3HorizontalSlider';
import d3VerticalSlider from './components/d3VerticalSlider';
import d3ICicleVertical from './components/d3ICicleVertical';
import d3ICicleHorizontal from './components/d3ICicleHorizontal';
import d3Sunburst from './components/d3Sunburst';
import d3Tree from './components/d3Tree';
import d3Pack from './components/d3Pack';
import d3Cluster from './components/d3Cluster';

import d3LChoropleth from './components/d3LChoropleth';
import d3LHeat from './components/d3LHeat';

import L from 'leaflet';
L.Icon.Default.imagePath = '.';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const install = (Vue, options = {}) => {
    if (options.store) {
        // register store
    }

    Vue.component(d3SankeyCircular.name, d3SankeyCircular);
    Vue.component(d3Timelion.name, d3Timelion);
    Vue.component(d3Timeline.name, d3Timeline);
    Vue.component(d3ProgressArc.name, d3ProgressArc);
    Vue.component(d3Pie.name, d3Pie);
    Vue.component(d3Line.name, d3Line);
    Vue.component(d3Metric.name, d3Metric);
    Vue.component(d3Circle.name, d3Circle);
    Vue.component(d3MultiLine.name, d3MultiLine);
    Vue.component(d3GroupedArea.name, d3GroupedArea);
    Vue.component(d3HorizontalBar.name, d3HorizontalBar);
    Vue.component(d3VerticalBar.name, d3VerticalBar);
    Vue.component(d3WordCloud.name, d3WordCloud);
    Vue.component(d3Area.name, d3Area);
    Vue.component(d3Player.name, d3Player);
    Vue.component(d3HorizontalSlider.name, d3HorizontalSlider);
    Vue.component(d3VerticalSlider.name, d3VerticalSlider);

    Vue.component(d3ICicleVertical.name, d3ICicleVertical);
    Vue.component(d3ICicleHorizontal.name, d3ICicleHorizontal);
    Vue.component(d3Sunburst.name, d3Sunburst);
    Vue.component(d3Tree.name, d3Tree);
    Vue.component(d3Pack.name, d3Pack);
    Vue.component(d3Cluster.name, d3Cluster);

    Vue.component(d3LChoropleth.name, d3LChoropleth);
    Vue.component(d3LHeat.name, d3LHeat);
};

export default {
    // global install
    install,
};

export {
    // local install
    d3SankeyCircular,
    d3Timelion,
    d3ProgressArc,
    d3Timeline,
    d3Pie,
    d3Line,
    d3Metric,
    d3Circle,
    d3MultiLine,
    d3GroupedArea,
    d3HorizontalBar,
    d3VerticalBar,
    d3Area,
    d3VerticalSlider,
    d3HorizontalSlider,
    d3WordCloud,

    d3Sunburst,
    d3Tree,
    d3Pack,
    d3Cluster,
    d3ICicleVertical,
    d3ICicleHorizontal,

    d3LChoropleth,
    d3LHeat,
};

