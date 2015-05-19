define(['d3'], function (d3) {
    'use strict';

    var format = d3.format(',d'),
        color = d3.scale.category20c();

    function renderChart(element, scope, animate) {
        var diameter = scope.diameter || Math.min($(element.parentElement).width(), $(element.parentElement).height());
        if (!scope.data) {
            return;
        }
        var counts = d3.entries(scope.data);
        counts.sort(function(a,b) { return b.value - a.value; });
        counts.splice(500);
        d3.select(element).datum(counts).each(function(data) {
            var svg = d3.select(element).selectAll('svg').data([data]);

            var bubble = d3.layout.pack()
                .sort(null)
                .size([diameter, diameter])
                .padding(1.5);

            svg.enter().append('svg')
                .attr('class', 'bubble-chart');

            svg.attr('width', diameter)
                .attr('height', diameter);
            var bdata = bubble.nodes({children: data})
                .filter(function(d) { return !d.children; });
            var nodes = svg.selectAll('g.node')
                .data(bdata, function(d) { return d.key; });

            var gEnter = nodes.enter().append('g')
                .attr('class', 'node');
            //.attr('transform', function(d) { console.log(d); return 'translate(' + d.x + ',' + d.y + ')'; });
            gEnter.append('title');
            gEnter.append('circle')
                .style('fill', function(d) { return color(d.key); });
            gEnter.append('text')
                .attr('dy', '.3em')
                .style('text-anchor', 'middle');

            nodes.exit().select('circle').transition().duration(animate ? 250 : -1).attr('r', function() { return 0; }).remove();
            nodes.exit().remove();
            nodes.transition()
                .duration(animate ? 500 : -1)
                .attr('transform', function(d) { return 'translate(' + (d.x) + ',' + d.y + ')'; })
                .select('circle')
                .transition()
                .duration(animate ? 250 : -1).attr('r', function(d) { return d.r; });
            nodes.select('title').text(function(d) { return d.key + ': ' + format(d.value); });
            //nodes.select('circle').attr('r', function(d) { return d.r; });
            nodes.select('text').text(function(d) {return d.key.substring(0, d.r / 3); });
        });
    }

    return [function () {

        return {
            restrict: 'E',
            replace: false,
            scope: {data: '=chartData', diameter: '=diameter'},
            link: function (scope, element) {
                scope.$watch(function (scope) {
                    return scope.data;
                }, function () {
                    renderChart(element[0], scope, true);
                });
                scope.$watch('diameter', function() {
                    renderChart(element[0], scope);
                });
                renderChart(element[0], scope, true);
            }
        };
    }];
});
