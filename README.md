# Vs
Vue Visualisation Package with d3.


## Installation
```javascript
npm i -S GopherJ/Vs
```


## Lists

- `d3SankeyCircular`
- `d3Bar`
- `d3Line`
- `d3Pie`
- `d3Timelion`


## Usage

`main.js`
```
import Vs from 'Vs';

Vue.use(Vs);
```

`template`
```vue
<d3-pie :data="data" :options="{
    innerRadius: 20,
    cornerRadius: 10,
    padAngle: 0.01
}" width="100%" height="400px" :margin="{
    left: 30,
    top: 30,
    right: 30,
    bottom: 30
}"></d3-pie>

<d3-line :data="data" :options="{
    stroke: 'teal',
    strokeWidth: 2,
    fontSize: 14,
    label: 'value',
    circleRadius: 10,
    circleColor: 'red'
}" width="100%" height="400px" :margin="{
    left: 30,
    top: 30,
    right: 30,
    bottom: 30
}"></d3-line>

<d3-bar :data="data" :options="{
    fill: 'rgb(110, 173, 193)',
    stroke: 'rgb(110, 173, 193)',
    fontSize: 14,
    isVertical: false,
    label: 'value'
}" width="100%" height="400px" :margin="{
    left: 30,
    top: 30,
    right: 30,
    bottom: 30
}"></d3-bar>

<d3-sankey-circular :nodes="nodes" :links="links" :options="{
    nodeWidth = 20,
    nodeText = 'font-size: .8rem; font-weight: 600;',
    circularLinkGap = 4,
    circularLinkColor = 'red',
    linkColor = 'black',
    arrowLength = 10,
    gapLength = 150,
    arrowHeadSize = 4
}" width="100%" height="400px" :nodeTitle="d => `${d.name}\n${d.value}`" :linkTitle="d => `${d.source.name} → ${d.target.name}\n${d.value}`"></d3-sankey-circular>

<d3-timelion :data="data" :options="{
    fill: 'rgb(110, 173, 193)',
    stroke: 'rgb(110, 173, 193)',
    fontSize: 14,
    labelY: 'count'
}" :margin="{
    left: 30,
    top: 30,
    right: 30,
    bottom: 30
}"></d3-timelion>
```







