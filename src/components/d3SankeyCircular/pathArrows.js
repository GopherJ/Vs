/* eslint-disable */
import * as d3 from 'd3';

function pathArrows() {
    let arrowLength = 10;
    let gapLength = 50;
    let arrowHeadSize = 4;
    let path = null;

    function appendArrows(selection) {
        const totalDashArrayLength = arrowLength + gapLength;

        const arrows = selection
            .append('path')
            .attr('d', path)
            .style('stroke-width', 1)
            .style('stroke', 'black')
            .style('stroke-dasharray', `${arrowLength},${gapLength}`);

        arrows.each(function (arrow) {
            const thisPath = d3.select(this).node();
            const parentG = d3.select(this.parentNode);
            const pathLength = thisPath.getTotalLength();
            let numberOfArrows = Math.ceil(pathLength / totalDashArrayLength);

            // remove the last arrow head if it will overlap the target node
            if (
                (numberOfArrows - 1) * totalDashArrayLength +
                (arrowLength + (arrowHeadSize + 1)) >
                pathLength
            ) {
                numberOfArrows -= 1;
            }

            const arrowHeadData = d3.range(numberOfArrows).map((d, i) => {
                const length = i * totalDashArrayLength + arrowLength;

                const point = thisPath.getPointAtLength(length);
                const previousPoint = thisPath.getPointAtLength(length - 2);

                let rotation = 0;

                if (point.y === previousPoint.y) {
                    rotation = point.x < previousPoint.x ? 180 : 0;
                } else if (point.x === previousPoint.x) {
                    rotation = point.y < previousPoint.y ? -90 : 90;
                } else {
                    const adj = Math.abs(point.x - previousPoint.x);
                    const opp = Math.abs(point.y - previousPoint.y);
                    let angle = Math.atan(opp / adj) * (180 / Math.PI);
                    if (point.x < previousPoint.x) {
                        angle += (90 - angle) * 2;
                    }
                    if (point.y < previousPoint.y) {
                        rotation = -angle;
                    } else {
                        rotation = angle;
                    }
                }

                return {x: point.x, y: point.y, rotation};
            });

            const arrowHeads = parentG
                .selectAll('.arrow-heads')
                .data(arrowHeadData)
                .enter()
                .append('path')
                .attr('d', d => (
                    `M${
                        d.x
                        },${
                    d.y - arrowHeadSize / 2
                        } ` +
                    `L${
                    d.x + arrowHeadSize
                        },${
                        d.y
                        } ` +
                    `L${
                        d.x
                        },${
                    d.y + arrowHeadSize / 2}`
                ))
                .attr('class', 'arrow-head')
                .attr('transform', d => `rotate(${d.rotation},${d.x},${d.y})`)
                .style('fill', 'black');
        });
    }


    appendArrows.arrowLength = function (value) {
        if (!arguments.length) return arrowLength;
        arrowLength = value;
        return appendArrows;
    };

    appendArrows.gapLength = function (value) {
        if (!arguments.length) return gapLength;
        gapLength = value;
        return appendArrows;
    };

    appendArrows.arrowHeadSize = function (value) {
        if (!arguments.length) return arrowHeadSize;
        arrowHeadSize = value;
        return appendArrows;
    };


    appendArrows.path = function (pathFunction) {
        if (!arguments.length) {
            return path;
        }

        if (typeof pathFunction === 'function') {
            path = pathFunction;
            return appendArrows;
        }

        path = function () {
            return pathFunction;
        };
        return appendArrows;
    };

    return appendArrows;
}

export default pathArrows;
