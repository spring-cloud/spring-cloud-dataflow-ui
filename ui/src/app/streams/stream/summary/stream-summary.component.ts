import { Component, OnInit } from '@angular/core';
import { StreamsService } from '../../streams.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { StreamDefinition } from '../../model/stream-definition';
import { Observable } from 'rxjs/Observable';
import { Parser } from '../../../shared/services/parser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { NotificationService } from '../../../shared/services/notification.service';
import { LoggerService } from '../../../shared/services/logger.service';
import { map } from 'rxjs/internal/operators';

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
      .pipe(mergeMap(
        (val: StreamDefinition) => Observable.of(Parser.parse(val.dslText as string, 'stream'))
          .pipe(map((val2) => {
            return {
              streamDefinition: val,
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
