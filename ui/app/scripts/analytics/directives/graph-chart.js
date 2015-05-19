define(['d3'], function (d3) {
    'use strict';

    var margin = {top: 20, right: 10, bottom: 20, left: 70},
        xValue = function(d) { return d.key; },
        yValue = function(d) { return +d.value; };

    function renderChart(element, scope) {
        var width = scope.width || $(element.parentElement).width();
        var height = scope.height || $(element.parentElement).height();
        var selection;
        if (!scope.data) {
            return;
        }
        if (Array.isArray(scope.data)) {
            selection = d3.entries(scope.reverse ? Array.prototype.slice.call(scope.data).reverse() : scope.data);
        } else {
            selection = d3.entries(scope.data);
        }
        while (selection.length > 0 && selection[0].value === 0) {
            selection.shift();
        }
        d3.select(element).datum(selection).each(function(data) {
            data = data.map(function(d, i) {
                return [xValue.call(data, d, i), yValue.call(data, d, i)];
            });
            // Update the x-scale (the y value is used since the chart is on its side).
            var xValuesRange = [0, scope.total ? scope.total - 1 : data.length - 1];
            if (scope.reverse) {
                xValuesRange = xValuesRange.reverse();
            }
            var yTicksNumber = Math.floor(height / 25);
            var xTicksNumber = Math.floor(width / 25);
            var minY = d3.min(data, function(d) { return d[1]; });
            var maxY = d3.max(data, function(d) { return d[1]; });
            var padding =Math.max((maxY - minY) / 10.0, maxY / 4.0);
            var xScale = d3.scale.linear().range([margin.left, width - margin.right]).domain(xValuesRange);
            var yScale = d3.scale.linear().range([height - margin.top, margin.bottom]).domain([minY - padding, maxY + padding]);
            var xAxis = d3.svg.axis().scale(xScale).innerTickSize(-height + margin.top + margin.bottom)
                .tickPadding(10)
                .ticks(xTicksNumber);
            var yAxis = d3.svg.axis().scale(yScale).orient('left').innerTickSize(-width + margin.left + margin.right)
                .tickPadding(10)
                .ticks(yTicksNumber);

            xAxis.tickFormat(function(d) {
                return scope.unitsPerTickX ? d * scope.unitsPerTickX : d;
            });

            yAxis.tickFormat(function(d) {
                return scope.unitsPerTickY ? d * scope.unitsPerTickY : d;
            });

            d3.select(element).selectAll('svg').remove();

            var svg = d3.select(element).selectAll('svg').data([data]);

            svg.enter()
                .append('svg')
                .attr('class', 'aggbar')
                .append('g');
            svg.attr('width', width);
            svg.attr('height', height);

            svg.append('svg:g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
                .attr('fill', 'none')
                .attr('stroke', '#777')
                .attr('opacity', 1.0)
                .attr('shape-rendering', 'crispEdges')
                .call(xAxis);
            svg.append('svg:g')
                .attr('class', 'y axis')
                .attr('transform', 'translate(' + (margin.left) + ',0)')
                .attr('fill', 'none')
                .attr('stroke', '#777')
                .attr('opacity', 1.0)
                .attr('shape-rendering', 'crispEdges')
                .call(yAxis);

            if (scope.axisUnitsX) {
                svg.append('text')
                    .attr('class', 'axis label')
                    .attr('text-anchor', 'end')
                    .attr('x', width - margin.right)
                    .attr('y', height - margin.bottom)
                    .attr('dy', '-.25em')
                    .text(scope.axisUnitsX);
            }

            if (scope.axisUnitsY) {
                svg.append('text')
                    .attr('class', 'axis label')
                    .attr('text-anchor', 'start')
                    .attr('dy', '-.25em')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ') rotate(90)')
                    .text(scope.axisUnitsY);
            }

            var lineGen = d3.svg.line()
                .x(function(d) {
                    return xScale(d[0]);
                })
                .y(function(d) {
                    return yScale(d[1]);
                })
                .interpolate('basis');

            svg.append('svg:path')
                .attr('d', lineGen(data))
                .attr('stroke', 'green')
                .attr('shape-rendering', 'crispEdges')
                .attr('stroke-width', 2)
                .attr('fill', 'none');

        });
    }

    return [function () {

        return {
            restrict: 'E',
            replace: false,
            scope: {
                data: '=chartData',
                width: '=width',
                height: '=height',
                reverse: '=reverse',
                total: '=total',
                axisUnitsX: '=axisUnitsX',
                unitsPerTickX: '=unitsPerTickX',
                axisUnitsY: '=axisUnitsY',
                unitsPerTickY: '=unitsPerTickY'
            },
            link: function (scope, element) {
                scope.$watch(function (scope) {
                    return scope.data;
                }, function () {
                    renderChart(element[0], scope);
                });
                scope.$watch('width', function() {
                    renderChart(element[0], scope);
                });
                scope.$watch('height', function() {
                    renderChart(element[0], scope);
                });
                renderChart(element[0], scope);
            }
        };
    }];
});
