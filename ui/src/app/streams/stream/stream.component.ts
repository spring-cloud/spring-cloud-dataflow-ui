import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RoutingStateService } from '../../shared/services/routing-state.service';
import { ActivatedRoute } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { StreamsService } from '../streams.service';
import { Observable } from 'rxjs/Observable';
import { StreamDefinition } from '../model/stream-definition';
import { AppError, HttpAppError } from '../../shared/model/error.model';
import { NotificationService } from '../../shared/services/notification.service';
import { EMPTY } from 'rxjs/index';

/**
 * Component that shows the details of a Stream Definition
 *
 * @author Janne Valkealahti
 * @author Gunnar Hillert
 * @author Glenn Renfro
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-stream',
  templateUrl: 'stream.component.html',
  styleUrls: ['styles.scss'],
  encapsulation: ViewEncapsulation.None
})

export class StreamComponent implements OnInit {

  /**
   * Observable of StreamDefinition
   */
  streamDefinitions$: Observable<StreamDefinition>;

  /**
   * Constructor
   * @param {ActivatedRoute} route
   * @param {StreamsService} streamsService
   * @param {NotificationService} notificationService
   * @param {RoutingStateService} routingStateService
   */
  constructor(private route: ActivatedRoute,
              private streamsService: StreamsService,
              private notificationService: NotificationService,
              private routingStateService: RoutingStateService) {
  }

  /**
   * Initialiaze component
   */
  ngOnInit() {
    this.streamDefinitions$ = this.route.params
      .pipe(mergeMap(
        (val) => this.streamsService.getDefinition(val.id)
      )).catch((error) => {
        if (HttpAppError.is404(error)) {
          this.cancel();
        }
        this.notificationService.error(AppError.is(error) ? error.getMessage() : error);
        return EMPTY;
      });
  }

  /**
   * Back action
   * Navigate to the previous URL or /streams/definitions
   */
  cancel() {
    this.routingStateService.back('/streams/definitions', /^(\/streams\/definitions\/)/);
  }

}
