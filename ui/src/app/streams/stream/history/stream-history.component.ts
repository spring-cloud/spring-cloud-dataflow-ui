import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StreamDefinition } from '../../model/stream-definition';
import { map, mergeMap } from 'rxjs/operators';
import { StreamsService } from '../../streams.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StreamHistory } from '../../model/stream-history';
import { ConfirmService } from '../../../shared/components/confirm/confirm.service';
import { LoggerService } from '../../../shared/services/logger.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { AppError } from '../../../shared/model/error.model';

/**
 * Component that shows the history (versions) of a Stream Definition deployment. You can also perform a
 * rollback to a version of the stream (`stream rollback ...`).
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-stream-history',
  templateUrl: 'stream-history.component.html',
  styleUrls: ['../styles.scss'],
})
export class StreamHistoryComponent implements OnInit {

  /**
   * Observable of stream information
   * Contains the stream definition, a list of the streams"s apps
   */
  stream$: Observable<any>;

  /**
   * Constructor
   *
   * @param route
   * @param router
   * @param confirmService
   * @param loggerService
   * @param notificationService
   * @param streamsService
   */
  constructor(private route: ActivatedRoute,
              private router: Router,
              private confirmService: ConfirmService,
              private loggerService: LoggerService,
              private notificationService: NotificationService,
              private streamsService: StreamsService) {
  }

  /**
   * On Init
   */
  ngOnInit() {
    this.refresh();
  }

  /**
   * Load the stream history
   */
  refresh() {
    this.stream$ = this.route.parent.params
      .pipe(
        mergeMap(val => this.streamsService.getDefinition(val.id)),
        mergeMap(
          (streamDefinition: StreamDefinition) => this.streamsService.getHistory(streamDefinition.name)
            .pipe(map((streamHistory: StreamHistory[]) => {
              return {
                stream: streamDefinition,
                history: streamHistory
              };
            }))
        )
      );
  }

  /**
   * Rollback Action
   * Ask a validation to the user (confirm) before performing a rollback.
   * @param streamHistory
   */
  rollback(streamHistory: StreamHistory) {
    const title = `Confirm stream rollback`;
    const description = `This action will rollback the  ` +
      `<strong>stream ${streamHistory.stream} to the version ${streamHistory.version}</strong>. Are you sure?`;
    this.confirmService.open(title, description, { confirm: 'Rollback' }).subscribe(() => {
      this.loggerService.log('Rollback to ' + streamHistory);
      this.streamsService.historyRollback(streamHistory)
        .subscribe(data => {
            this.notificationService.success('Successful stream rollback to version "' + streamHistory.version + '"');
            this.refresh();
          }, error => {
            this.notificationService.error(AppError.is(error) ? error.getMessage() : error);
          }
        );
    });
  }

  /**
   * Determine if the rollback action is allowed
   * @param stream
   * @param history
   */
  canRollback(stream: StreamDefinition, history: StreamHistory): boolean {
    return stream.status.toLocaleLowerCase() === 'deployed' && history.statusCode.toLocaleLowerCase() !== 'deployed';
  }

}
