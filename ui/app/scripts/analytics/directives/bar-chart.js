define(['d3'], function (d3) {
    'use strict';

    var margin = {top: 20, right: 10, bottom: 20, left: 10},
        //height = 500,
        xScale = d3.scale.linear(),
        //yScale = d3.scale.linear(),
        xValue = function(d) { return d.key; },
        yValue = function(d) { return +d.value; };

    function renderChart(element, scope) {
        var width = scope.width ? parseInt(scope.width) : $(element.parentElement).width();
        var barSize = scope.barSize ? parseInt(scope.barSize) : 10;
        if (!scope.data) {
            return;
        }
        var selection = d3.entries(scope.data);
        while (selection.length > 0 && selection[0].value === 0) {
            selection.shift();
        }
        d3.select(element).datum(selection.reverse()).each(function(data) {
            data = data.map(function(d, i) {
                return [xValue.call(data, d, i), yValue.call(data, d, i)];
            });
            // Update the x-scale (the y value is used since the chart is on its side).
            xScale
                .domain([0, d3.max(data, function(d) { return d[1]; })])
                .range([0, width - margin.left - margin.right]);

            var h = barSize * Math.max(10, data.length);

            var svg = d3.select(element).selectAll('svg').data([data]);

            svg.enter()
                .append('svg')
                .attr('class', 'aggbar')
                .append('g');
            svg.attr('width', width);
            svg.attr('height', h + margin.bottom + margin.top);

            var g = svg.select('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
            g.selectAll('line').remove();


            var lines = g.selectAll('line')
                .data(xScale.ticks(10));
            lines.enter().append('line')
                .attr('y1', 0)
                .style('stroke', '#ccc');
            lines.attr('y2', h)
                .attr('x1', xScale)
                .attr('x2', xScale);
            lines.exit().remove();

            g.selectAll('rect').remove();
            var rects = g.selectAll('rect')
                .data(data);

            rects.enter().append('rect')
                .attr('height', barSize);
            rects.attr('y', function(d, i) { return i*barSize; })
                .attr('width', function(d) { return xScale(d[1]); });
            rects.exit().remove();

            g.selectAll('.rule').remove();
            var rules = g.selectAll('.rule')
                .data(xScale.ticks(10));
            rules.enter().append('text')
                .attr('class', 'rule')
                .attr('y', 0)
                .attr('dy', -3)
                .attr('text-anchor', 'middle');
            rules.attr('x', xScale)
                .text(String);
            rules.exit().remove();

            g.selectAll('.bar').remove();
            var bars = g.selectAll('.bar')
                .data(data);

            bars.enter().append('text')
                .attr('class', 'bar')
                .attr('dx', -3)
                .attr('dy', '.35em')
                .attr('text-anchor', 'end');

            if (barSize >= 10) {
                bars.attr('y', function(d, i) { return i*barSize + barSize/2; })
                    .attr('x', function(d) { return xScale(d[1]); })
                    .text(function(d) {return d[1];});
            }

            bars.exit().remove();

            g.append('line')
                .attr('y1', 0)
                .attr('y2', h)
                .style('stroke', '#000');
        });
    }

    return [function () {

        return {
            restrict: 'E',
            replace: false,
            scope: {
                data: '=chartData',
                width: '=width',
                barSize: '=barSize'
            },
            link: function (scope, element) {
                scope.$watch(function (scope) {
                    return scope.data;
                }, function () {
                    renderChart(element[0], scope);
                });
                scope.$watchCollection(function (scope) {
                    return scope.data;
                }, function () {
                    renderChart(element[0], scope);
                });
                scope.$watch('width', function() {
                    renderChart(element[0], scope);
                });
                scope.$watch('barSize', function() {
                    renderChart(element[0], scope);
                });
                renderChart(element[0], scope);
            }
        };
    }];
});
