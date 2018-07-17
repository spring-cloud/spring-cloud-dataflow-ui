import {
  OnChanges, Component,
  OnInit, HostListener, ViewChild,
  ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { LoggerService } from '../../../shared/services/logger.service';

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
export class BarChartComponent implements OnInit, OnChanges {
  @ViewChild('chart') private chartContainer: ElementRef;

  @Input()
  private chartData: Array<number>;
  private chartDataCopy: Array<number>;

  @Input()
  private width: number;
  private widthCopy: number;

  @Input()
  private reverse = false;

  @Input()
  private numberOfBars = 5;
  private numberOfBarsCopy: number;

  @Input()
  private height = 300;
  private heightCopy: number;

  private chartDataToUse: Array<number>;
  private chart: any;
  private xScale: any;
  private yScale: any;
  private xAxis: any;

  /**
   * Initialize the component and trigger the rendering of the chart.
   */
  ngOnInit() {
    if (this.chartData) {
      this.copyInputParameterData();
      this.updateData();
      this.createChart();
    }
  }

  constructor(private loggerService: LoggerService) {

  }
  private copyInputParameterData() {
    this.chartDataCopy = this.chartData.slice();
    this.widthCopy = this.width;
    this.heightCopy = this.height;
    this.numberOfBarsCopy = this.numberOfBars;
  }

  private updateData() {
    this.chartDataToUse = this.chartData.slice();
    if (this.reverse) {
      this.chartDataToUse.reverse();
    }
    this.chartDataToUse = this.chartDataToUse.slice(0, this.numberOfBars);
    if (this.chartDataToUse.length < this.numberOfBars) {
      const numberOfZeroItemsNeeded = this.numberOfBars - this.chartDataToUse.length;
      for (let i = 1; i <= numberOfZeroItemsNeeded; i++) {
        this.chartDataToUse.push(0);
      }
      this.chartDataToUse.push();
    }
  }

  /**
   * Check if array data has changed. If it did change, update the chart.
   */
  ngOnChanges() {

    if (!this.chartData) {
      return;
    }

    if (!this.isArraySame(this.chartDataCopy, this.chartData)
        || this.widthCopy !== this.width
        || this.heightCopy !== this.height
        || this.numberOfBarsCopy !== this.numberOfBars) {

      let update = false;

      if (this.widthCopy === this.width && this.heightCopy === this.height
        && this.numberOfBarsCopy === this.numberOfBars) {
          update = true;
      }

      this.copyInputParameterData();
      this.updateData();
      if (update) {
        this.updateChart();
      } else {
        this.createChart();
      }
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
    d3.select(chartElement).selectAll('svg').remove();

    const parentElement = chartElement.parentElement.parentElement;
    const computedStyle = getComputedStyle(parentElement);
    const elementWidth = parentElement.clientWidth;

    const widthToUse = this.width || elementWidth - parseFloat(computedStyle.paddingLeft) -
      parseFloat(computedStyle.paddingRight);
    const heightToUse = this.height;

    const localThis = this;

    if (!this.chartData) {
      return;
    } else {
      this.loggerService.log(`Render Chart - width=${widthToUse}, height=${heightToUse}, data: ${this.chartData} - ` +
        Array.isArray(this.chartData));
    }

    const xValuesRange = [0, d3.max(localThis.chartDataToUse)];
    localThis.xScale = d3.scaleLinear().rangeRound([0, widthToUse]).domain(xValuesRange);

    localThis.yScale = d3.scaleBand()
      .domain(d3.range(localThis.chartDataToUse.length).map(d => d.toString()))
      .range([heightToUse, 0 + 20])
      .round(true)
      .paddingInner(0.05);

    localThis.chart = d3.select(chartElement).append('svg')
        .attr('width', widthToUse)
        .attr('height',  heightToUse);

    /**
     * Define x-axis
     */
    localThis.xAxis = d3.axisTop(localThis.xScale)
      .ticks(10);

    /**
     * Add x-axis
     */
    localThis.chart.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + 18 + ')')
      .call(localThis.xAxis);

    /**
     * In order to create a cleaner SVG, we will wrap each bar with a
     * group element, so we can easily see which bar-rectangle and text label
     * belong together.
     */
    const barGroups = localThis.chart
      .append('g').attr('class', 'bars-group')
      .selectAll('g')
      .data(localThis.chartDataToUse)
      .enter()
      .append('g')
      .attr('class', (d, i) => `bar-group-${i}`);

    /**
     * Add the actual bar (the reactangle)
     */
    barGroups
      .append('rect')
      .attr('class', 'bar')
      .attr('x', function(d, i) {
        return localThis.xScale(0);
      })
      .attr('y', function(d, i) {
        return localThis.yScale(i.toString());
      })
      .attr('width', function(d) {
        if (d > 0) {
          return localThis.xScale(d);
        } else {
          return 1;
        }
      })
      .attr('height', localThis.yScale.bandwidth());

    /**
     * Add common properties to all bars
     */
    barGroups.append('text')
    .attr('y', function(d, i) {
      return localThis.yScale(i.toString()) + (localThis.yScale.bandwidth() / 2);
    })
    .attr('text-anchor', 'end')
    .attr('alignment-baseline', 'central')
    .style('font-size', localThis.yScale.bandwidth() - 2)
    .style('fill', '#eeeeee')
    .text(function(d) {
      return d;
    });

    /**
     * Add the text label for bars that have a value > 2
     */
    barGroups
      .select(function(d) { // like .filter() but preserving index
        if (localThis.xScale(d) > localThis.yScale.bandwidth()) {
          return this;
        } else {
          return null;
        }
      })
      .attr('class', 'text-inside-bar')
      .attr('x', function(d) { return localThis.xScale(d) - (localThis.yScale.bandwidth() - 2); });

    /**
     * Add the text label for bars that have a value <= 2
     */
    barGroups
      .select(function(d) { // like .filter() but preserving index
        if (localThis.xScale(d) <= localThis.yScale.bandwidth()) {
          return this;
        } else {
          return null;
        }
      })
      .attr('class', 'text-outside-bar')
      .attr('x', function(d) { return localThis.xScale(d) + (localThis.yScale.bandwidth() + 2); });
  }

  private updateChart() {

    const localThis = this;
    const duration = localThis.chartDataToUse.length ? (500 / localThis.chartDataToUse.length) : 0;

    const xValuesRange = [0, d3.max(localThis.chartDataToUse)];
    localThis.xScale.domain(xValuesRange);

    localThis.chart.selectAll('.bars-group g rect')
      .data(localThis.chartDataToUse)
      .transition()
    .delay(function(d, i) {
      return (localThis.chartDataToUse.length - (i - 1)) * 100;
    })
    .duration(duration)
    .attr('width', function(d) {
      if (d > 0) {
        return localThis.xScale(d);
      } else {
        return 1;
      }
    });

    const textItemsToUpdate = localThis.chart.selectAll('.bars-group g text')
    .data(localThis.chartDataToUse)
    .transition()
    .delay(function(d, i) {
      return (localThis.chartDataToUse.length - (i - 1)) * 100;
    })
    .duration(500)
    .text(d => d);

    textItemsToUpdate.select(function(d, i) {
      return localThis.xScale(d) <= localThis.yScale.bandwidth() ? this : null;
    })
    .attr('x', function(d) {
      return localThis.xScale(d) + (localThis.yScale.bandwidth() + 2);
    })
    .attr('y', function(d, i) {
      return localThis.yScale(i.toString()) + (localThis.yScale.bandwidth() / 2);
    })
    .style('fill', '#aaa');

    textItemsToUpdate.select(function(d, i) {
      return localThis.xScale(d) > localThis.yScale.bandwidth() ? this : null;
    })
    .attr('x', function(d) {
      return localThis.xScale(d) - (localThis.yScale.bandwidth() - 2);
    })
    .attr('y', function(d, i) {
      return localThis.yScale(i.toString()) + (localThis.yScale.bandwidth() / 2);
    })
    .style('fill', '#eeeeee');

    localThis.chart.select('.x.axis')
      .transition()
      .duration(1000)
      .call(localThis.xAxis);
  }
}
