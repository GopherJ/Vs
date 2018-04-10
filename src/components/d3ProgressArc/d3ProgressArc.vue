<template>
    <div :style="{'width' : width, 'height' : height}"></div>
</template>

<script>
    import * as d3 from 'd3';
    import mixins from '../../mixins';

    export default {
        name: 'd3-progress-arc',
        mixins: [mixins],
        methods: {
            calculateArc(innerRadius, outerRadius, cornerRadius, data) {
                const arcNum = data.length;

                if (cornerRadius * 2 * arcNum + innerRadius > outerRadius) {
                    return;
                }

                // calculate gap
                const gap = (outerRadius - innerRadius - arcNum * 2 * cornerRadius) / (arcNum - 1);

                // calculate arc
                const arcs = [];
                for (let i = 0; i < arcNum; i += 1) {
                    arcs.push({
                        innerRadius: innerRadius + i * (gap + 2 * cornerRadius),
                        outerRadius: innerRadius + i * (gap + 2 * cornerRadius) + 2 * cornerRadius,
                        startAngle: Math.PI,
                        endAngle: data[i].angle,
                        fill: data[i].fill
                    });
                }

                return arcs;
            },
            calculatePoint(arcs, circleRadius, cornerRadius) {
                const points = [];

                for (let i = 0; i < arcs.length; i += 1) {
                    const innerRadius = arcs[i].innerRadius;
                    const endAngle = arcs[i].endAngle - Math.asin(cornerRadius/(innerRadius+cornerRadius)) + Math.asin(circleRadius/(innerRadius+cornerRadius));

                    points.push({
                        innerRadius: innerRadius + cornerRadius - circleRadius,
                        outerRadius: innerRadius + cornerRadius + circleRadius,
                        startAngle: endAngle - Math.atan(circleRadius/(innerRadius + cornerRadius)) * 2,
                        endAngle: endAngle,
                    });
                }

                return points;
            },
            calculateTextsPos(innerRadius, outerRadius, cornerRadius, data, textLeft) {
                const arcNum = data.length;

                if (cornerRadius * 2 * arcNum + innerRadius> outerRadius) {
                    return;
                }

                const gap = (outerRadius - innerRadius - arcNum * 2 * cornerRadius) / (arcNum - 1);
                const textsPos = [];

                for (let i = 0; i < arcNum; i += 1) {
                    textsPos.push({
                        y: innerRadius + i * (gap + 2 * cornerRadius) + cornerRadius,
                        x: textLeft,
                        text: data[i].text
                    })
                }

                return textsPos;
            },
            drawProgressArc() {
                const [w, h] = this.getElWidthHeight();
                const data = this.data;

                // constants
                const { left = 0, top = 0, right = 0, bottom = 0 } = this.margin,
                      g_w = w - left - right,
                      g_h = h - top - bottom,
                      {
                          outerRadius = Math.min(g_w/2, g_h/2),
                          innerRadius = 40,
                          cornerRadius = 8,
                          circleRadius = 4,
                          arcNum = data.length,
                          textLeft = 2,
                          duration = 2000
                      } = this.options,
                      arcs = this.calculateArc(innerRadius, outerRadius, cornerRadius, data),
                      textsPos = this.calculateTextsPos(innerRadius, outerRadius, cornerRadius, data, textLeft),
                      points = this.calculatePoint(arcs, circleRadius, cornerRadius);

                // create svg
                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);

                // create g to contain the graph
                const g = svg.append('g')
                    .attr('transform', `translate(${left}, ${top})`)
                    .attr('width', g_w)
                    .attr('height', g_h)
                    .append('g')
                    .attr('transform', `translate(${g_w/2}, ${g_h/2})`);

                // create color set
                const color = d3.scaleSequential()
                    .domain(d3.extent(data, d => d.angle))
                    .interpolator(d3.interpolateRainbow);

                // d3 arc generate function
                const arcGen = d3.arc()
                    .cornerRadius(cornerRadius);

                // d3 arc to simulate a point
                const pointGen = d3.arc()
                    .cornerRadius(circleRadius);

                // start drawing
                g.selectAll('.arc')
                    .data(arcs)
                    .enter()
                    .append('path')
                    .attr('class', 'arc')
                    .attr('fill', (d, i) => d.fill || color(d.endAngle))
                    .transition()
                    .duration(duration)
                    .delay((d,i) => 50 * (arcNum - i - 1))
                    .attrTween('d', d => {
                        let interpolate = d3.interpolate({endAngle: Math.PI}, d);
                        return function(t) {
                            return arcGen(interpolate(t));
                        }
                    });

                // drawing points
                const point = g.selectAll('.point')
                    .data(points)
                    .enter()
                    .append('path')
                    .attr('class', 'point')
                    .attr('fill', '#fff')
                    .transition()
                    .duration(duration)
                    .delay((d,i) => 50 * (arcNum - i - 1))
                    .attrTween('d', d => {
                        const padAngle = d.endAngle - d.startAngle;
                        let interpolate = d3.interpolate({startAngle: Math.PI, endAngle: Math.PI + padAngle}, d);
                        return function(t) {
                            return pointGen(interpolate(t));
                        }
                    });


                // drawing text
                g.selectAll('text')
                    .data(textsPos)
                    .enter()
                    .append('text')
                    .attr('y', d => d.y)
                    .attr('opacity', 0)
                    .attr('x', 0)
                    .attr('dy', '0.35em')
                    .transition()
                    .duration(duration)
                    .attr('opacity', 1)
                    .attr('x', d => d.x)
                    .text(d => d.text);
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawProgressArc();
            },
            onResize() {
                this.safeDraw();
            }
        }
    }
</script>

<style scoped>

</style>
