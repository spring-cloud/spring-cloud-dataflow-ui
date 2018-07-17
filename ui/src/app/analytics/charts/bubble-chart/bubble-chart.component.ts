import {
  OnChanges, Component,
  OnInit, HostListener, ViewChild, ElementRef,
  Input, ViewEncapsulation } from '@angular/core';

import * as d3 from 'd3';
import { FieldValueCounterValue } from '../../model/field-value-counter-value.model';
import { LoggerService } from '../../../shared/services/logger.service';

/**
 * Buble Chart Component use to display rates of counters.
 *
 * @author Gunnar Hillert
 */
@Component({
  selector: 'app-bubble-chart',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BubbleChartComponent implements OnInit, OnChanges {
  @ViewChild('chart') private chartContainer: ElementRef;

    @Input()
    private chartData: FieldValueCounterValue[];
    private chartDataCopy: FieldValueCounterValue[];

    @Input()
    private height = 300;
    private heightCopy: number;

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
    }

    private updateData() {
      this.chartDataToUse = this.chartData.slice();
      this.chartDataToUse = this.chartDataToUse.slice(0, 500);
    }

    /**
     * Check if array data has changed. If it did change, update the chart.
     */
    ngOnChanges() {
      if (!this.chartData) {
        return;
      }

      if (!this.isArraySame(this.chartDataCopy, this.chartData)
          || this.heightCopy !== this.height) {

        let update = false;

        if (this.heightCopy === this.height) {
            update = true;
        }

        this.copyInputParameterData();
        this.updateData();
        if (update) {
          this.createChart(); // FIXME We need to support updates
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
      const chartElement = this.chartContainer.nativeElement;
      d3.select(chartElement).selectAll('svg').remove();

      const parentElement = chartElement.parentElement.parentElement;
      const computedStyle = getComputedStyle(parentElement);
      const elementWidth = parentElement.clientWidth;

      const widthToUse = elementWidth - parseFloat(computedStyle.paddingLeft) - parseFloat(computedStyle.paddingRight);
      const heightToUse = this.height;

      const localThis = this;

      if (!localThis.chartDataToUse) {
        return;
      } else {
        this.loggerService.log(`Render Chart - width=${widthToUse}, height=${heightToUse}, ` +
          `# of data items: ${localThis.chartDataToUse.length}`);
      }

      localThis.chartDataToUse.sort((a, b) => {
        return b.value - a.value;
      });

      /**
       * 'schemeCategory20c' does not exist in the type definition file but does
       * in D3 itself.
       */
      const colors = (<any> d3).schemeCategory20c;

      const bubble = d3.pack()
        .size([widthToUse, heightToUse])
        .padding(1.5);

      localThis.chart = d3.select(chartElement).append('svg')
        .attr('width', widthToUse)
        .attr('height',  heightToUse)
        .attr('class', 'bubble-chart');

      const root = d3.hierarchy({children: localThis.chartDataToUse})
      .sum(function(d: any) { return d.value; })
      .sort(function(a, b) { return b.value - a.value; });

      const node = localThis.chart.selectAll('.node')
        .data(bubble(root).leaves())
        .enter().append('g')
        .attr('class', 'node')
        .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

      node.append('circle')
          .attr('id', function(d) { return d.id; })
          .attr('r', function(d) { return d.r; })
          .style('fill', function(d, i) {
            return colors[i % 20];
          });

      node.append('text')
          .attr('dy', '.3em')
          .style('text-anchor', 'middle')
          .text(function(d) {
            return d.data.key.substring(0, d.r / 3);
          });
    }

}
