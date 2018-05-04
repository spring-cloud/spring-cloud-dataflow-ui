import {
  OnChanges, Component,
  OnInit, HostListener, ViewChild,
  ElementRef, Input, ViewEncapsulation } from '@angular/core';

import * as d3 from 'd3';
import { FieldValueCounterValue } from '../../model/field-value-counter-value.model';
import { LoggerService } from '../../../shared/services/logger.service';

/**
 * Pie Chart Component use to display rates of counters.
 *
 * @author Gunnar Hillert
 */
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PieChartComponent implements OnInit, OnChanges {
  @ViewChild('chart') private chartContainer: ElementRef;

  @Input()
  private chartData: FieldValueCounterValue[];
  private chartDataCopy: FieldValueCounterValue[];

  @Input()
  private height = 300;
  private heightCopy: number;

  @Input()
  private maxNumberOfSlices = 20;
  private maxNumberOfSlicesCopy: number;

  @Input()
  private useAllData = false;
  private useAllDataCopy: boolean;

  private chartDataToUse: FieldValueCounterValue[];

  private chart: any;

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
    this.heightCopy = this.height;
    this.maxNumberOfSlicesCopy = this.maxNumberOfSlices;
    this.useAllDataCopy = this.useAllDataCopy;

    this.loggerService.log(`# of chart data items: ${this.chartDataCopy.length} - ${this.chartData.length}`);
    this.loggerService.log(`Height: ${this.heightCopy} - ${this.height}`);
    this.loggerService.log(`Max # if Slices: ${this.maxNumberOfSlices}`);
    this.loggerService.log(`Use All Data: ${this.useAllData}`);
  }

  private updateData() {
    const localThis = this;

    this.chartDataToUse = this.chartData.slice();
    this.chartDataToUse.sort((a, b) => b.value - a.value);

    if (!this.useAllData) {
      this.chartDataToUse = this.chartDataToUse.slice(0, localThis.maxNumberOfSlices);
    }

    let originalTotal = d3.sum(this.chartDataToUse, function (d) {
      return d.value;
    });

    let otherTotal = 0;

    const total = d3.sum(this.chartDataToUse, function (d) {
      return d.value;
    });

    this.chartDataToUse = this.chartDataToUse.filter(function (d) {
      const bigEnough = d.value / total >= 0.007;
      if (!bigEnough) {
          otherTotal += d.value;
      }
      return bigEnough;
    });

    originalTotal = d3.sum(this.chartDataToUse, function (d) {
      return d.value;
    });

    if (this.chartDataToUse.length > localThis.maxNumberOfSlices - 2) {
      this.chartDataToUse = this.chartDataToUse.filter(function (d, index) {
        if (index > localThis.maxNumberOfSlices - 1) {
          otherTotal += d.value;
          return false;
        }
        return true;
      });
    }
    originalTotal = d3.sum(this.chartDataToUse, function (d) {
      return d.value;
    });

    if (otherTotal > 0) {
      this.chartDataToUse.push(new FieldValueCounterValue('Other', otherTotal));
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
        || this.heightCopy !== this.height
        || this.maxNumberOfSlices !== this.maxNumberOfSlicesCopy
        || this.useAllData !== this.useAllDataCopy) {

      let update = false;

      if (this.heightCopy === this.height
        && this.maxNumberOfSlices === this.maxNumberOfSlicesCopy
        && this.useAllData === this.useAllDataCopy) {
          update = true;
      }

      this.loggerService.log('update', update);
      this.copyInputParameterData();
      this.updateData();
      if (update) {
        // this.updateChart();
      } else {
        this.createChart();
      }
    }
  }

  private isArraySame(array1: FieldValueCounterValue[], array2: FieldValueCounterValue[]): boolean {
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
    const localThis = this;

    const chartElement = this.chartContainer.nativeElement;
    d3.select(chartElement).selectAll('svg').remove();

    const parentElement = chartElement.parentElement.parentElement;
    const computedStyle = getComputedStyle(parentElement);
    const elementWidth = parentElement.clientWidth;

    const widthToUse = elementWidth - parseFloat(computedStyle.paddingLeft) - parseFloat(computedStyle.paddingRight);
    const heightToUse = this.height;

    const radius = Math.min(widthToUse - 45, heightToUse - 45) / 2;

    if (!localThis.chartDataToUse) {
      return;
    } else {
      this.loggerService.log(`Render Chart - width=${widthToUse}, height=${heightToUse}, data: ${localThis.chartDataToUse}`);
    }

    this.loggerService.log('this.chartData', localThis.chartDataToUse);
    localThis.chartDataToUse.sort((a, b) => {
      return b.value - a.value;
    });

    /**
     * 'schemeCategory20c' does not exist in the type definition file but does
     * in D3 itself.
     */
    const colors = (<any> d3).schemeCategory20c;

    const pie = d3.pie()
      .sort(null)
      .value(function(d) {
        return Number(d); });

    const path = d3.arc()
      .outerRadius(radius)
      .innerRadius(30);

    const label = d3.arc()
      .outerRadius(radius + 18)
      .innerRadius(radius + 18);

    localThis.chart = d3.select(chartElement).append('svg')
      .attr('width', widthToUse)
      .attr('height',  heightToUse)
      .append('g').attr('transform', 'translate(' + widthToUse / 2 + ',' + heightToUse / 2 + ')');

    const slice = localThis.chart.selectAll('.arc')
      .data(pie(localThis.chartDataToUse.map(d => d.value)))
      .enter().append('g')
      .attr('class', 'arc');

    slice.append('path')
      .attr('d', path)
      .attr('fill', function(d, i) { return colors[i]; });

    slice.on('mousemove', function(d) {
        // div.style('left', d3.event.pageX+10+'px');
        // div.style('top', d3.event.pageY-25+'px');
        // div.style('display', 'inline-block');
        // div.html((d.data.label)+'<br>'+(d.data.value)+'%');
    });

    slice.append('text')
      .attr('transform', function(d) { return 'translate(' + label.centroid(d) + ')'; })
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .text(function(d, i) {
        return localThis.chartDataToUse[i].key;
      });
  }
}
