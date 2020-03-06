import { Component, OnInit } from '@angular/core';
import { StreamsService } from '../../streams.service';
import { ActivatedRoute } from '@angular/router';
import { mergeMap, map } from 'rxjs/operators';
import { StreamDefinition } from '../../model/stream-definition';
import { Observable, of } from 'rxjs';
import { Parser } from '../../../shared/services/parser';
import { BsModalRef } from 'ngx-bootstrap';
import { StreamStatuses } from '../../model/stream-metrics';

/**
 * Component that shows the summary details of a Stream Definition
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-stream-summary',
  templateUrl: 'stream-summary.component.html',
  styleUrls: ['../styles.scss'],
})
export class StreamSummaryComponent implements OnInit {

  /**
   * Observable of stream information
   * Contains the stream definition, a list of the streams"s apps
   */
  stream$: Observable<any>;

  /**
   * Modal reference
   */
  modal: BsModalRef;

  /**
   * Log Selected
   */
  logSelectedIndex = 0;

  /**
   * Constructor
   *
   * @param {ActivatedRoute} route
   * @param {StreamsService} streamsService
   */
  constructor(private route: ActivatedRoute,
              private streamsService: StreamsService) {
  }

  /**
   * Init component, call refresh method
   */
  ngOnInit() {
    this.refresh();
  }

  /**
   * Refresh
   * Create an observable which provides the required data
   */
  refresh() {
    this.stream$ = this.route.parent.params
      .pipe(mergeMap(
        val => this.streamsService.getDefinition(val.id)
          .pipe(map((streamDefinition: StreamDefinition) => {
            return streamDefinition;
          }))
      ))
      .pipe(mergeMap((val: StreamDefinition) => {
          if (val.status === 'deployed') {
            return this.streamsService.getRuntimeStreamStatuses([val.name])
              .pipe(map((statuses: StreamStatuses[]) => {
                return {
                  streamDefinition: val,
                  runtimes: statuses.length === 1 ? statuses[0].applications : []
                };
              }));
          } else {
            return of({
              streamDefinition: val,
              runtimes: []
            });
          }
        }
      ))
      .pipe(mergeMap(
        (val: any) => {
          if (val.runtimes.length > 0) {
            return this.streamsService.getLogs(val.streamDefinition)
              .pipe(map((logs) => {
                return {
                  streamDefinition: val.streamDefinition,
                  runtimes: val.runtimes,
                  logs: val.runtimes.map(runtime => {
                    let log = '';
                    if (logs && logs.hasOwnProperty('logs')) {
                      log = logs.logs[runtime.deploymentId] ? logs.logs[runtime.deploymentId] : '';
                    }
                    return {
                      deploymentId: runtime.deploymentId,
                      log: log
                    };
                  })
                };
              }));
          } else {
            return of({
              streamDefinition: val.streamDefinition,
              runtimes: val.runtimes,
              logs: []
            });
          }

        }
      ))
      .pipe(mergeMap(
        (val: any) => of(Parser.parse(val.streamDefinition.dslText as string, 'stream'))
          .pipe(map((val2) => {
            return {
              streamDefinition: val.streamDefinition,
              runtimes: val.runtimes,
              logs: val.logs,
              apps: val2.lines[0].nodes
                .map((node) => ({
                  origin: node['name'],
                  name: node['label'] || node['name'],
                  type: node.type.toString()
                }))
            };
          }))
        )
      );
  }

  changeLog(index) {
    this.logSelectedIndex = index;
  }

  /**
   * Determine show deployment info
   *
   * @param {StreamDefinition} streamDefinition
   * @returns {boolean} more info is required
   */
  canShowDeploymentInfo(streamDefinition: StreamDefinition) {
    return streamDefinition.status === 'deployed'
      || streamDefinition.status === 'deploying'
      || streamDefinition.status === 'failed'
      || streamDefinition.status === 'incomplete';
  }

}
