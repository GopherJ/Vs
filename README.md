# Vs

Vue Visualisation Package using `d3.js` and `leaflet`. Package used in [Ubudu](http://www.ubudu.com). See also:
    - [LayoutGrid](https://github.com/GopherJ/LayoutGrid)  :  Creating a powerful dashboard using `Vs` and `vue-grid-layout`



## Installation

```
npm i -S d3-vs
```



## Usage

```javascript
import Vs from 'd3-vs';

// install globally all components
Vue.use(Vs);

// import only the components that you need and register it manually
import {
    // Flow transition
    d3SankeyCircular,

    // Special
    d3Timelion,
    d3Timeline,

    // Basic
    d3Pie,
    d3Line,
    d3Metric,
    d3MultiLine,
    d3HorizontalBar,
    d3VerticalBar,
    d3Area,

    // Functional
    d3Tracker,
    d3Slider,
    d3ProgressArc,

    // Layout
    d3Sunburst,
    d3Tree,
    d3Pack,
    d3Cluster,
    d3ICicleVertical,
    d3ICicleHorizontal,

    // Leaflet
    d3LChoropleth,
    d3LHeat
} from 'd3-vs';
```



## Basic


###d3Metric

This component is for showing simple scientific data. It accepts the type `Number` as data.

![d3Metric](./images/d3-metric.PNG)

`template`

```vue
<d3-metric
    :data="data"
    :options="options"
    :margin="margin"
    width="100%"
    height="400px">
</d3-metric>
```

`options`

|key|description|type|default|
|:---|:---|:---|:---|
|`axisXLabel`|`label of horizontally which will be put above the data`|`string OR null`|`null`|
|`axisLabelFontSize`|`label font size`|`number`|`12`|
|`axisLabelFontWeight`|`label font weight`|`number`|`400`|
|`axisLabelFontOpacity`|`label font opacity`|`number ([0, 1])`|`0.5`|
|`metricLabelColor`|`metric color`|`string (rgb, hex, rgba, hsl...)`|`black`|
|`metricLabelFontSize`|`metric font size`|`number`|`120`|
|`metricLabelFontWeight`|`metric font weight`|`number`|`900`|
|`metricLabelFontOpacity`|`metric font opacity`|`number ([0, 1])`|`0.5`|
|`metricTitle`|`metric tooltip`|`function`|`d => d`|
|`metricPrecision`|`metric precision`|`number`|`2`|




###d3Pie

This component can be a pie chart or a donut chart. It takes an array of elements like `{key : 'key', value : 'value'}`. `key` will be used
in tooltip, `value` will be used to calculate the angle needed.

![d3Pie](./images/d3-pie.PNG)

`template`
```
<d3-pie
    :data="data"
    :options="options"
    :margin="margin"
    width="100%"
    height="400px">
</d3-pie>
```
`options`
|key|description|type|default|
|:---|:---|:---|:---|
|`innerRadius`|`inner radius`|`number`|`50`|
|`cornerRadius`|`corner radius`|`number`|`0`|
|`padAngle`|`pad angle (percentage)`|`number`|`0.01`|
|`arcTitle`|`tooltip`|`function`|`d => d.data.key + '<br>' + d.data.value`|
|`arcLabel`|`label will be shown in arcs`|`string OR null`|`null`|
|`axisXLabel`|`label of axis x`|`string OR null`|`null`|
|`axisLabelFontSize`|`label font size`|`number`|`12`|
|`axisLabelFontWeight`|` abel font weight`|`number`|`400`|
|`axisLabelFontOpacity`|`label font opacity`|`number ([0, 1])`|`0.5`|
|`arcLabelFontSize`|`label font size of every arc`|`number`|`9`|
|`arcLabelFontWeight`|` abel font weight of every arc`|`number`|`400`|
|`arcLabelFontOpacity`|`label font opacity of every arc`|`number ([0, 1])`|`0.5`|
|`animationDuration`|`duration of animation`|`number`|`1000`|
|`delay`|`delay of animation (milliseconds)`|`number`|`50`|
|`defaultColor`|`color will be used when there is only one item in array`|`string (rgb, hex, rgba, hsl...)`|`rgb(175, 240, 91)`|












`template`
```vue


<d3-line
    :data="data"
    :options="options"
    :margin="margin"
    width="100%"
    height="400px">
</d3-line>

<d3-horizontal-bar
    :data="data"
    :options=""options
    :margin="margin"
    width="100%"
    height="400px">
</d3-horizontal-bar>

<d3-vertical-bar
    :data="data"
    :options="options"
    :margin="margin"
    width="100%"
    height="400px">
</d3-vertical-bar>

<d3-area
    :data="data"
    :options="options"
    :margin="margin"
    width="100%"
    height="400px">
</d3-area>

<d3-sankey-circular
    :nodes="nodes"
    :links="links"
    :options="options"
    :nodeTitle="nodeTitle"
    :linkTitle="linkTitle"
    width="100%"
    height="400px">
</d3-sankey-circular>

<d3-multi-line
    :data="data"
    :options="options"
    :margin="margin"
    width="100%"
    height="400px">
</d3-multi-line>

<d3-timelion
    :data="data"
    :options="options"
    :margin="margin"
    width="100%"
    height="400px"
    @range-updated="(dateTimeStart, dateTimeEnd, interval) => fetchDataWithCurrentInterval(dateTimeStart, dateTimeEnd, interval)"
    @interval-updated="interval => fetchDataWithInterval(interval)">
</d3-timelion>

<d3-timeline
    :data="data"
    :options="options"
    :margin="margin"
    width="100%"
    height="400px">
</d3-timeline>

<d3-progress-arc
    :data="data"
    :options="options"
    :margin="margin"
    width="100%"
    height="400px">
</d3-progress-arc>

<d3-tracker
    :data="data"
    :options="options"
    :margin="margin"
    width="100%"
    height="400px"
    @reference-updated="(dateTimeRange, entries) => yourMethod(dateTimeRange, entries)">
</d3-tracker>

<d3-slider
    v-model="data"
    :min="min"
    :max="max"
    :margin="margin"
    :options="options"
    width="100%"
    height="100%">
</d3-slider>

<d3-icicle-horizontal
    :data="data"
    :options="options"
    :margin="margin"
    width="100%"
    height="400px">
</d3-icicle-horizontal>

<d3-icicle-vertical
    :data="data"
    :options="options"
    :margin="margin"
    width="100%"
    height="400px">
</d3-icicle-vertical>

<d3-tree
    :data="data"
    :options="options"
    :margin="margin"
    width="100%"
    height="400px">
</d3-tree>

<d3-cluster
    :data="data"
    :options="options"
    :margin="margin"
    width="100%"
    height="400px">
</d3-cluster>

<d3-sunburst
    :data="data"
    :options="options"
    :margin="margin"
    width="100%"
    height="400px">
</d3-sunburst>

<d3-pack
    :data="data"
    :options="options"
    :margin="margin"
    width="100%"
    height="400px">
</d3-pack>

<d3-metric
    :data="data"
    :options="options"
    :margin="margin"
    width="100%"
    height="400px">
</d3-metric>

<d3-circle
    :data="data"
    :options="options"
    :margin="margin"
    width="100%"
    height="400px">
</d3-circle>

<d3-l-choropleth
    :data="data"
    :options="options"
    :indoorMaps="indoorMaps"
    width="100%"
    height="400px">
</d3-l-choropleth>

<d3-l-heat
    :data="data"
    :options="options"
    :indoorMaps="indoorMaps"
    width="100%"
    height="400px">
</d3-l-heat>
```


## Screenshots


![d3Circle](./images/d3-circle.PNG)

![d3HorizontalBar](./images/d3-horizontal-bar.PNG)

![d3VerticalBar](./images/d3-vertical-bar.PNG)


![d3Line](./images/d3-line.PNG)

![d3Area](./images/d3-area.PNG)

![d3MultiLine](./images/d3-multi-line.PNG)

![d3Timline](./images/d3-timeline.PNG)

![d3Timelion](./images/d3-timelion.PNG)

![d3Tracker](./images/d3-tracker.PNG)

![d3SankeyCircular](./images/d3-sankey-circular.PNG)

![d3LChoropleth](./images/d3-l-choropleth.PNG)

![d3LHeat](./images/d3-l-heat.PNG)

![d3ICicleVertical](./images/d3-icicle-vertical.PNG)

![d3ICicleHorizontal](./images/d3-icicle-horizontal.PNG)

![d3Sunburst](./images/d3-sunburst.PNG)

![d3Pack](./images/d3-pack.PNG)

![d3Tree](./images/d3-tree.PNG)

![d3Cluster](./images/d3-cluster.PNG)

![d3Slider](./images/d3-slider.PNG)

![d3ProgressArc](./images/d3-progress-arc.gif)



## ToDo

- `d3ColorPicker`
- `d3Gantt`
- `d3Gauge`
- `d3Goal`
- `d3HeatMap`
- `d3RadialBar`
- `d3RadialSector`
- `d3RadialLine`
- `d3ScatterPlot`
- `d3Table`
- `d3WordCloud`
- `d3Markdown`
- `d3JsonViewer`
- `d3LReplay`



## License
MIT

