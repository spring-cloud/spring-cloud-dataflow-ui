import {
  Component, OnInit, DoCheck, HostListener, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

/**
 * Bar Chart Component use to display rates of counters.
 *
 * @author Gunnar Hillert
 */
@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BarChartComponent implements OnInit, DoCheck {
  @ViewChild('chart') private chartContainer: ElementRef;

  @Input()
  private chartData: Array<number>;
  private chartDataCopy: Array<number>;

  @Input()
  private width: number;
  private widthCopy: number;

  @Input()
  private barSize: number;
  private barSizeCopy: number;

  /**
   * Initialize the component and trigger the rendering of the chart.
   */
  ngOnInit() {
    if (this.chartData) {
      this.chartDataCopy = this.chartData.slice();
      this.widthCopy = this.width;
      this.barSizeCopy = this.barSize;
      this.createChart();
    }
  }

  /**
   * Check if array data has changed. If it did change, render the chart.
   */
  ngDoCheck() {
    if (!this.isArraySame(this.chartDataCopy, this.chartData)
          || this.widthCopy !== this.width
          || this.barSizeCopy !== this.barSize) {
      this.chartDataCopy = this.chartData.slice();
      this.widthCopy = this.width;
      this.barSizeCopy = this.barSize;
      this.createChart();
    }
  }

  private isArraySame(array1: number[], array2: number[]): boolean {
    if ((!array1 && array2) || (array1 && !array2)) {
      return false;
    }

    if (array1.length !== array2.length) {
      return false;
    }

    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
          return false;
      }
    }
    return true;
  }

  /**
   * Re-render the chart, in case the window is resized in
   * order to maintain dimensions.
   *
   * @param event Window resize event
   */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.createChart();
  }

  private createChart() {
    const chartElement = this.chartContainer.nativeElement;
    const parentElement = chartElement.parentElement.parentElement;
    const computedStyle = getComputedStyle(parentElement);
    const elementWidth = parentElement.clientWidth;

    const barSizeToUse = this.barSize ? this.barSize : 10;
    const heightWithoutPadding = barSizeToUse * Math.max(5, this.chartData.length);
    const widthToUse = this.width || elementWidth - parseFloat(computedStyle.paddingLeft) - parseFloat(computedStyle.paddingRight);
    const heightToUse =
      heightWithoutPadding - parseFloat(computedStyle.paddingTop) - parseFloat(computedStyle.paddingBottom) + 20;

    if (!this.chartData) {
      return;
    } else {
      console.log(`Render Chart - width=${widthToUse}, height=${heightToUse}, data: ${this.chartData} - ` + Array.isArray(this.chartData));
    }

    const reversedChartData = this.chartData.slice();
    reversedChartData.reverse();

    const xValuesRange = [0, d3.max(reversedChartData)];
    const xScale = d3.scaleLinear().range([0, widthToUse]).domain(xValuesRange);

    d3.select(chartElement).selectAll('svg').remove();
    const chart = d3.select(chartElement).append('svg')
        .attr('width', widthToUse)
        .attr('height',  heightToUse);

    const lines = chart.append('g').attr('class', 'axis-lines-group')
      .selectAll('line')
      .data(xScale.ticks(10))
      .enter()
      .append('line')
      .style('stroke', '#ccc')
      .attr('y1', function(d) {
        if (d === 0) {
          return 0;
        } else {
          return 18;
        }
      })
      .attr('y2', heightToUse)
      .attr('x1', xScale)
      .attr('x2', xScale);

    const barGroups = chart
      .append('g').attr('class', 'bars-group')
      .selectAll('g')
      .data(reversedChartData)
      .enter()
      .append('g')
      .attr('transform', function(d, i) { return 'translate(0,' + (20 + i * barSizeToUse) + ')'; });

    barGroups.append('rect')
      .attr('class', 'bar')
      .attr('width', function(d) {
        if (d > 0) {
          return xScale(d);
        } else {
          return 1;
        }
      })
      .attr('height', barSizeToUse - 2);

    barGroups.append('text')
      .filter(function(d){ return d > 2; })
      .attr('x', function(d) { return xScale(d) - 30; })
      .attr('y', (barSizeToUse - 2) / 2)
      .attr('text-anchor', 'right')
      .attr('alignment-baseline', 'central')
      .style('font-size', barSizeToUse - 4)
      .style('fill', '#eeeeee')
      .text(function(d) { return d; });

    barGroups.append('text')
      .filter(function(d){ return d === 0; })
      .attr('x', function(d) { return xScale(d) + 10; })
      .attr('y', (barSizeToUse - 2) / 2)
      .attr('text-anchor', 'right')
      .attr('alignment-baseline', 'central')
      .style('font-size', barSizeToUse - 4)
      .style('fill', '#aaa')
      .text(function(d) { return d; });

    const lineLabels = chart.append('g').attr('class', 'axis-line-labels-group')
      .selectAll('text')
      .data(xScale.ticks(10))
      .enter().append('text')
      .filter(function(d, i, list) {
        if (i !== list.length - 1 && d > 0) {
          return true;
        }
        return false;
      })
      .style('fill', '#000000')
      .attr('class', 'line-label')
      .attr('y', 0)
      .attr('dy', -3)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'hanging')
      .attr('x', xScale)
      .text(d => d);
  }
}
