import {
  Component, OnInit, DoCheck, HostListener, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { LoggerService } from '../../../shared/services/logger.service';

/**
 * Line Chart Component use to display rates of counters.
 *
 * @author Gunnar Hillert
 */
@Component({
  selector: 'app-graph-chart',
  templateUrl: './graph-chart.component.html',
  styleUrls: ['./graph-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GraphChartComponent implements OnInit, DoCheck {
  @ViewChild('chart') private chartContainer: ElementRef;

  @Input()
  private chartData: Array<number>;

  private chartDataCopy: Array<number>;

  @Input()
  private width: number;

  @Input()
  private height: number;
  private heightCopy: number;

  @Input()
  private reverse: boolean;

  @Input()
  private total: number;

  @Input()
  private axisUnitsX: string;

  @Input()
  private unitsPerTickX: number;
  private unitsPerTickXCopy: number;

  @Input()
  private axisUnitsY: string;

  @Input()
  private unitsPerTickY: number;

  /**
   * Constructor
   *
   * @param {LoggerService} loggerService
   */
  constructor(private loggerService: LoggerService) { }

  /**
   * Initialize the component and trigger the rendering of the chart.
   */
  ngOnInit() {
    if (this.chartData) {
      this.chartDataCopy = this.chartData.slice();
      this.unitsPerTickXCopy = this.unitsPerTickX;
      this.renderChart();
    }
  }

  /**
   * Check if array data has changed. If it did change, render the chart.
   */
  ngDoCheck() {
    if (this.unitsPerTickXCopy !== this.unitsPerTickX
        || !this.isArraySame(this.chartDataCopy, this.chartData)
        || this.heightCopy !== this.height) {
      this.chartDataCopy = this.chartData.slice();
      this.unitsPerTickXCopy = this.unitsPerTickX;
      this.heightCopy = this.height;
      this.renderChart();
    }
  }

  private isArraySame(array1: number[], array2: number[]): boolean {
    if ((!array1 && array2) || (array2 && !array2)) {
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
   * order to maintain dimentsions.
   *
   * @param event Window resize event
   */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.renderChart();
  }

  private renderChart() {
    const chartElement = this.chartContainer.nativeElement;
    const parentElement = chartElement.parentElement.parentElement;
    const computedStyle = getComputedStyle(parentElement);
    const elementHeight = parentElement.clientHeight;
    const elementWidth = parentElement.clientWidth;

    const width = this.width || elementWidth - parseFloat(computedStyle.paddingLeft) - parseFloat(computedStyle.paddingRight);
    const height = this.height || elementHeight - parseFloat(computedStyle.paddingTop) - parseFloat(computedStyle.paddingBottom);

    if (!this.chartData) {
      return;
    } else {
      this.loggerService.log(`Render Chart - width=${width}, height=${height}, data: ${this.chartData} - ` + Array.isArray(this.chartData));
    }

    const dataToUse = d3.entries(this.reverse ? this.chartData.slice().reverse() : this.chartData.slice());

    const instance = this;
    d3.select(chartElement).datum(dataToUse).each(function(dataItems) {
      const dataItemsToUse = dataItems.map(function(d, i) {
        return [d.key, d.value];
      });

      const xValuesRange = [0, instance.total ? instance.total - 1 : dataItemsToUse.length - 1];

      if (instance.reverse) {
          xValuesRange.reverse();
      }

      const yTicksNumber = Math.floor(height / 25);
      const xTicksNumber = Math.floor(width / 25);

      const minY: number = Number(d3.min(dataItemsToUse, function(d) { return d[1] as number; }));
      const maxY: number = Number(d3.max(dataItemsToUse, function(d) { return d[1] as number; }));
      const padding = Math.max((maxY - minY) / 10.0, maxY / 4.0);

      const margin = {top: 10, right: 10, bottom: 10, left: 10};

      const xScale = d3.scaleLinear().rangeRound([margin.left, width - margin.right]).domain(xValuesRange);
      const yScale = d3.scaleLinear().rangeRound([height - margin.top, 0]).domain([minY - padding, maxY + padding]);

      const xAxis = d3.axisBottom(xScale).tickSizeInner(-height + margin.top + margin.bottom)
          .tickPadding(10)
          .ticks(xTicksNumber);
      const yAxis = d3.axisLeft(yScale).tickSizeInner(-width + margin.left + margin.right)
          .tickPadding(10)
          .ticks(yTicksNumber);

      xAxis.tickFormat(function(d) {
        if (instance.unitsPerTickX) {
          return (Number(d) * instance.unitsPerTickX).toString();
        } else {
          return d.toString();
        }
      });

      yAxis.tickFormat(function(d) {
        if (instance.unitsPerTickY) {
          return instance.unitsPerTickY.toString();
        } else {
          return d.toString();
        }
      });

      d3.select(chartElement).selectAll('svg').remove();

      const svg = d3.select(chartElement).selectAll('svg')

      .data([dataItemsToUse])
      .enter()
      .append('svg')
      .attr('class', 'aggbar')
      .attr('width', width - margin.left - margin.right)
      .attr('height', height + margin.top + margin.bottom);

      const lineGen = d3.line()
        .x(function(d) {
            return xScale(d[0]);
        })
        .y(function(d) {
          if (d[1]) {
            return yScale(d[1]);
          } else {
            return yScale(0);
          }
        })
      .curve(d3.curveBasis);

      svg.append('path')
        .datum(dataItemsToUse)
        .attr('d', lineGen)
        .attr('class', 'line');

      if (instance.axisUnitsX) {
        svg.append('text')
          .attr('class', 'axis label')
          .attr('text-anchor', 'end')
          .attr('x', width - margin.right - margin.left)
          .attr('y', height - margin.bottom)
          .attr('dy', '-.25em')
          .text(instance.axisUnitsX);
      }
      if (instance.axisUnitsY) {
        svg.append('text')
          .attr('class', 'axis label')
          .attr('text-anchor', 'start')
          .attr('dy', '-.25em')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ') rotate(90)')
          .text(instance.axisUnitsY);
      }
    });
  }
}
