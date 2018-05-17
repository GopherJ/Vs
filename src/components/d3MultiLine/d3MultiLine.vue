<template>
    <div class="d3-multi-line" :style="{ 'width' : width, 'height' : height }"></div>
</template>

<script>
    import * as d3 from 'd3';
    import tip from 'd3-tip';
    import mixins from '../../mixins';
    import classifyGroup from '../../util/classifyGroup';
    import _ from 'lodash';
    import offset from 'document-offset';

    Object.assign(d3, {
        tip
    });

    const GetAllKeys = (data) => [...new Set(data.map(d => d.key))];

    const TransformAxisToVertical = function (texts) {
        texts
            .each(function (d, i) {
                const text = d3.select(this);

                const y = text.attr('y');

                text
                    .attr('text-anchor', 'start')
                    .attr('transform', `rotate(90)`)
                    .attr('y', null)
                    .attr('x', y);

                if (i !== texts.size() - 1) {
                    text
                        .attr('dy', null);
                }
            });
    };

    const ToggleCross = function (container, rect, stroke, strokeWidth) {
        const selection = container.selectAll('line');
        if (!selection.empty()) {
            selection.remove();
            return;
        }

        const pos = rect.node().getBBox();

        const x1 = pos.x,
            y1 = pos.y,
            x2 = pos.x + pos.width,
            y2 = pos.y + pos.height;

        container.append('line')
            .attr('x1', x1)
            .attr('y1', y1)
            .attr('x2', x2)
            .attr('y2', y2)
            .attr('stroke', stroke)
            .attr('stroke-width', strokeWidth)
            .attr('pointer-events', 'none');

        container.append('line')
            .attr('x1', x2)
            .attr('y1', y1)
            .attr('x2', x1)
            .attr('y2', y2)
            .attr('stroke', stroke)
            .attr('stroke-width', strokeWidth)
            .attr('pointer-events', 'none');
    };

    const calculateRealBBox = (g) => {
        const pos = g.node().getBBox(),
            transform = g.attr('transform'),
            [translateX, translateY] = transform !== null ? transform.split(/\(|\)|\,/).slice(1, 3).map(x => parseFloat(x)) : [0, 0];

        return {
            x: pos.x + translateX,
            y: pos.y + translateY,
            width: pos.width,
            height: pos.height
        };
    };

    export default {
        name: 'd3-multi-line',
        mixins: [mixins],
        methods: {
            drawMultiLine() {
                const _data = _.cloneDeep(this.data),
                    data = classifyGroup(_data, 'group'),
                    groups = Object.keys(data);

                if (groups.length === 0) {
                    return;
                }

                const {left = 0, top = 0, right = 0, bottom = 0} = this.margin,
                    {
                        strokeWidth = 2,

                        circleRadius = 5,
                        circleTitle = d => `${d.value}`,

                        crossWidth = 2,
                        crossColor = 'white',

                        axisXLabel = 'key',
                        axisYLabel = 'Value',

                        axisXGroupLabelLaneHeight = 30,
                        axisXGroupLabelWidth = 15,
                        axisXGroupLabelFillColorOpacity = 1,
                        axisXGroupLabelBorderColorOpacity = 0.6,
                        axisXGroupLabelGap = 10,

                        axisLabelFontSize = 12,
                        axisLabelFontWeight = 400,
                        axisLabelFontOpacity = 0.5,

                        axisXLaneHeight = 30,
                        axisYLaneWidth = 40,

                        axisFontSize = 12,
                        axisFontWeight = 400,
                        axisFontOpacity = 0.5,

                        isAxisXTime = false,

                        dashedGroups = groups,
                        strokeDashArray = 5,

                        curve = 'curveCardinal',

                        isAxisXTextHorizontal = true,

                        screenAdaptive = true
                    } = this.options,
                    {
                        axisXLabelLaneHeight = _.isNull(axisXLabel) ? 0 : 30,
                        axisYLabelLaneWidth = _.isNull(axisYLabel) ? 0 : 30,
                    } = this.options;

                const [w, h] = this.getElWidthHeight(),
                    g_w = w - left - right - axisYLabelLaneWidth - axisYLaneWidth,
                    g_h = h - top - bottom - axisXLabelLaneHeight - axisXLaneHeight - axisXGroupLabelLaneHeight;

                if (![g_w, g_h].every(el => el > 0)) {
                    return;
                }

                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);

                const schemeCategory20 = d3.scaleOrdinal()
                    .domain(groups)
                    .range(d3.schemeCategory20);

                const axisXGroupLabelLane = svg.append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth + axisYLaneWidth}, ${top})`)
                    .attr('width', g_w)
                    .attr('height', axisXGroupLabelLaneHeight);

                const axisYLabelLane = svg.append('g')
                    .attr('transform', `translate(${left}, ${top + axisXGroupLabelLaneHeight})`)
                    .attr('width', axisYLabelLaneWidth)
                    .attr('height', g_h);

                const axisXLabelLane = svg.append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth + axisYLaneWidth}, ${top + axisXGroupLabelLaneHeight + g_h + axisXLaneHeight})`)
                    .attr('width', g_w)
                    .attr('height', axisXLabelLaneHeight);

                const axisYLane = svg.append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth}, ${top + axisXGroupLabelLaneHeight})`)
                    .attr('width', axisYLaneWidth)
                    .attr('height', g_h);

                const axisXLane = svg.append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth + axisYLaneWidth}, ${top + axisXGroupLabelLaneHeight + g_h})`)
                    .attr('width', g_w)
                    .attr('height', axisXLaneHeight);

                const tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([0, 0]);

                const g = svg.append('g')
                    .attr('transform', `translate(${left + axisYLabelLaneWidth + axisYLaneWidth}, ${top + axisXGroupLabelLaneHeight})`)
                    .attr('width', g_w)
                    .attr('height', g_h);

                svg.append('defs')
                    .append('clipPath')
                    .attr('id', 'clip-multi-line-g')
                    .append('rect')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', g_w)
                    .attr('height', g_h);

                const GroupLabelContainer = axisXGroupLabelLane
                    .append('g');

                let previousPos;
                GroupLabelContainer
                    .selectAll('.label .label--group')
                    .data(groups)
                    .enter()
                    .append('g')
                    .each(function (d, i) {
                        const _g = d3.select(this);

                        let label;
                        label = _g.append('rect')
                            .attr('width', axisXGroupLabelWidth)
                            .attr('height', axisXGroupLabelLaneHeight)
                            .attr('fill', d => schemeCategory20(d))
                            .attr('fill-opacity', axisXGroupLabelFillColorOpacity)
                            .attr('stroke', d => schemeCategory20(d))
                            .attr('stroke-opacity', axisXGroupLabelBorderColorOpacity)
                            .on('click', function (d) {
                                ToggleCross(_g, d3.select(this), crossColor, crossWidth);

                                svg.selectAll(`.d3-multi-line-${d}`)
                                    .each(function (_d) {
                                        const selection = d3.select(this),
                                            display = selection.style('display');

                                        selection.style('display', display === 'inline' ? 'none' : 'inline');
                                    });
                            });

                        const labelPos = label.node().getBBox();

                        _g.append('text')
                            .attr('class', 'label label--group')
                            .attr('text-anchor', 'start')
                            .attr('x', labelPos.x + labelPos.width)
                            .attr('y', axisXGroupLabelLaneHeight / 2)
                            .attr('dy', '0.35em')
                            .text(d);

                        if (i !== 0) {
                            _g.attr('transform', `translate(${previousPos.x + previousPos.width + axisXGroupLabelGap}, 0)`);
                        }

                        previousPos = calculateRealBBox(_g);
                    });

                const GroupLabelContainerPos = GroupLabelContainer.node().getBBox();
                GroupLabelContainer
                    .attr('transform', `translate(${(g_w - GroupLabelContainerPos.width) / 2}, 0)`);

                axisXLabelLane
                    .append('text')
                    .attr('class', 'label label--x')
                    .attr('text-anchor', 'middle')
                    .attr('x', g_w / 2)
                    .attr('y', axisXLabelLaneHeight / 2)
                    .attr('dy', '0.35em')
                    .text(axisXLabel)
                    .attr('fill', '#000')
                    .attr('fill-opacity', axisLabelFontOpacity)
                    .attr('font-size', axisLabelFontSize)
                    .attr('font-weight', axisLabelFontWeight);

                axisYLabelLane
                    .append('text')
                    .attr('class', 'label label--y')
                    .attr('text-anchor', 'middle')
                    .attr('transform', 'rotate(-90)')
                    .attr('y', axisYLabelLaneWidth / 2)
                    .attr('x', -g_h / 2)
                    .text(axisYLabel)
                    .attr('fill', '#000')
                    .attr('fill-opacity', axisLabelFontOpacity)
                    .attr('font-size', axisLabelFontSize)
                    .attr('font-weight', axisLabelFontWeight);

                const scaleY = d3.scaleLinear()
                    .domain([0, d3.max(_data.map(d => d.value))])
                    .range([g_h, 0]);

                let scaleX;
                if (_data.length !== 1) {
                    scaleX = isAxisXTime
                        ? d3.scaleTime().domain(d3.extent(_data.map(d => typeof d === 'number' ? new Date(d.key) : d.key))).range([0, g_w])
                        : d3.scalePoint().domain(GetAllKeys(_data)).range([0, g_w]);
                }

                else {
                    scaleX = d3.scalePoint().domain(_data.map(d => d.key)).range([0, g_w]);
                }

                axisYLane
                    .append('g')
                    .attr('transform', `translate(${axisYLaneWidth}, 0)`)
                    .attr('class', 'axis axis--y')
                    .call(d3.axisLeft(scaleY).ticks(this.selectTicksNumY(g_h)))
                    .attr('fill-opacity', axisFontOpacity)
                    .attr('font-size', axisFontSize)
                    .attr('font-weight', axisFontWeight);

                const axisX = axisXLane
                    .append('g')
                    .attr('class', 'axis axis--x')
                    .call(d3.axisBottom(scaleX))
                    .attr('fill-opacity', axisFontOpacity)
                    .attr('font-size', axisFontSize)
                    .attr('font-weight', axisFontWeight);

                if (!isAxisXTextHorizontal) {
                    const texts = axisX.selectAll('text');

                    TransformAxisToVertical(texts);
                }

                else {
                    svg.select('.axis.axis--x .tick:last-child text')
                        .attr('text-anchor', 'end');

                    svg.select('.axis.axis--x .tick:first-of-type text')
                        .attr('text-anchor', 'start');
                }

                if (isAxisXTextHorizontal && screenAdaptive) {
                    const ticks = axisX.selectAll('.tick'),
                        texts = axisX.selectAll('text');

                    let previousTickEndX,
                        textLengthSum = 0;

                    ticks.each(function (d, i) {
                        const tick = d3.select(this),
                            textLength = tick.select('text').node().getComputedTextLength(),
                            tickPos = tick.node().getBBox(),
                            tickTranslateX = parseFloat(tick.attr('transform').split(/\(|\)|\,/).slice(1, 2)),
                            startX = tickTranslateX + tickPos.x,
                            endX = startX + tickPos.width;

                        textLengthSum += textLength;

                        if ((i !== 0 && startX < previousTickEndX) || (i === ticks.size() - 1 && (textLengthSum > g_w))) {
                            TransformAxisToVertical(texts);
                        }

                        previousTickEndX = endX;
                    });
                }

                const lineGen = d3.line()
                    .x(d => scaleX(isAxisXTime ? (typeof d === 'number' ? new Date(d.key) : d.key) : d.key))
                    .y(d => scaleY(d.value))
                    .defined(d => d !== null && d !== undefined);

                if (curve !== null && d3[curve] !== undefined) {
                    lineGen
                        .curve(d3[curve]);
                }

                g.selectAll('path')
                    .data(groups)
                    .enter()
                    .append('path')
                    .attr('class', d => `d3-multi-line-${d}`)
                    .attr('d', d => lineGen(data[d]))
                    .attr('stroke-dasharray', d => dashedGroups.some(el => el === d) ? strokeDashArray : 0)
                    .attr('fill', 'transparent')
                    .attr('stroke', d => schemeCategory20(d))
                    .attr('stroke-width', strokeWidth);

                g.selectAll('circle')
                    .data(_data)
                    .enter()
                    .append('circle')
                    .attr('class', d => `d3-multi-line-${d.group}`)
                    .attr('clip-path', 'url(#clip-multi-line-g)')
                    .attr('cx', d => scaleX(isAxisXTime ? (typeof d === 'number' ? new Date(d.key) : d.key) : d.key))
                    .attr('cy', d => scaleY(d.value))
                    .attr('r', circleRadius)
                    .attr('fill', d => schemeCategory20(d.group))
                    .on('mouseover', function (d) {
                        g.call(tip);
                        tip.html(circleTitle(d));
                        tip.show();

                        const tipSelection = d3.select('.d3-tip');
                        tipSelection.style('top', `${offset(this).top - tipSelection.node().getBoundingClientRect().height - 10}px`);
                        tipSelection.style('left', `${offset(this).left + this.getBBox().width / 2 - tipSelection.node().getBoundingClientRect().width / 2}px`);
                    })
                    .on('mouseout', (d) => {
                        d3.selectAll('.d3-tip').remove();
                    });
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawMultiLine();
            },
            onResize() {
                this.safeDraw();
            }
        }
    }
</script>

<style>
    @import url(../../css/index.css);

    .d3-multi-line circle:hover, .d3-multi-line rect:hover, .d3-multi-line text:hover {
        cursor: pointer;
    }

    .d3-multi-line .label {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
</style>
