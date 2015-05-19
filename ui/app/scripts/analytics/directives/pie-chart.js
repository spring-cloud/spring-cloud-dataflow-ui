define(['d3'], function (d3) {
    'use strict';

    var minSlice = 0.007,
        xValue = function (d) {
            return d.key;
        },
        yValue = function (d) {
            return +d.value;
        };

    function renderChart(element, scope) {
        var width = scope.width || $(element.parentElement).width();
        var height = scope.height ||  $(element.parentElement).height();
        var paddingX = scope.paddingX || 50;
        var paddingY = scope.paddingY || 25;

        if (!scope.data) {
            return;
        }
        var counts = d3.entries(scope.data);
        counts.sort(function (a, b) {
            return b.value - a.value;
        });
        counts.splice(500);
        d3.select(element).datum(counts).each(function (data) {
            // Convert data to standard representation greedily;
            // this is needed for nondeterministic accessors.
            data = data.map(function (d, i) {
                return [xValue.call(data, d, i), yValue.call(data, d, i)];
            });

            var total = d3.sum(data, function (d) {
                return d[1];
            });
            var otherTotal = 0;

            // Add anything less than minSlice to 'other'
            data = data.filter(function (d) {
                var bigEnough = d[1] / total >= minSlice;
                if (!bigEnough) {
                    otherTotal += d[1];
                }
                return bigEnough;
            });

            data.push(['other', otherTotal]);

            var svg = d3.select(element).selectAll('svg').data([data]);

            var color = d3.scale.category20c();

            svg.enter()
                .append('svg')
                .append('g');
            svg.attr('width', width);
            svg.attr('height', height);

            var r = Math.min(width / 2 - paddingX, height / 2 - paddingY );
            var g = svg.select('g')
                .attr('transform', 'translate(' + (paddingX + r) + ',' + (paddingY + r) + ')');

            var arc = d3.svg.arc()
                .outerRadius(r - 10)
                .innerRadius(0);

            var pie = d3.layout.pie()
                .sort(null)
                .value(function (d) {
                    return d[1];
                });

            var pieData = pie(data);

            g.selectAll('.arc').remove();
            var arcs = g.selectAll('.arc')
                .data(pieData);

            arcs.enter().append('g')
                .attr('class', 'arc');

            arcs.append('path')
                .attr('d', arc)
                .style('fill', function (d) {
                    return color(d.data[0]);
                });

            g.selectAll('line').remove();

            var lines = g.selectAll('line').data(pieData);
            lines.enter().append('line')
                .attr('x1', 0)
                .attr('x2', 0)
                .attr('y1', -r + 5)
                .attr('y2', -r - 3)
                .attr('stroke', 'gray')
                .attr('transform', function (d) {
                    return 'rotate(' + (d.startAngle + d.endAngle) / 2 * (180 / Math.PI) + ')';
                });

            var textOffset = 25;
            arcs.append('text')
                .attr('transform', function (d) {
                    var centroid = arc.centroid(d),
                        x = centroid[0],
                        y = centroid[1];
                    return 'translate(' + ((2.0 + 2 * textOffset / r) * x) + ',' + ((2.0 + 2 * textOffset / r) * y) + ')';
                })
                .attr('dy', '.35em')
                .style('text-anchor', 'middle')
                .text(function (d) {
                    return d.data[0];
                });

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
                paddingX: '=paddingX',
                paddingY: '=paddingY'
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
