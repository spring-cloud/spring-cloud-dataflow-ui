import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { StreamsService } from '../../streams.service';
import { takeUntil } from 'rxjs/operators';
import { RenderService } from '../../components/flo/render.service';
import { MetamodelService } from '../../components/flo/metamodel.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { AppError } from '../../../shared/model/error.model';

/**
 * Component that shows the details of a Stream Definition
 *
 * @author Janne Valkealahti
 * @author Gunnar Hillert
 * @author Glenn Renfro
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-stream-graph',
  templateUrl: 'stream-graph.component.html'
})
export class StreamGraphComponent implements OnInit, OnDestroy {

  /**
   * Unsubscribe
   */
  private ngUnsubscribe$: Subject<any> = new Subject();

  /**
   * Stream name
   */
  id: string;

  /**
   * DSL
   */
  dsl = '';

  /**
   * Constructor
   *
   * @param {ActivatedRoute} route
   * @param {StreamsService} streamsService
   * @param {NotificationService} notificationService
   * @param {MetamodelService} metamodelService
   * @param {RenderService} renderService
   */
  constructor(private route: ActivatedRoute,
              private streamsService: StreamsService,
              private notificationService: NotificationService,
              public metamodelService: MetamodelService,
              public renderService: RenderService) {
  }

  /**
   * Initialize
   */
  ngOnInit() {
    this.route.parent.params.subscribe(params => {
      this.id = params['id'];
      this.streamsService.getRelatedDefinitions(this.id, true)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(streams => {
          console.log(streams);
          this.dsl = streams.map(s => `${s.name}=${s.dslText}`).join('\n');
        }, (error) => {
          this.notificationService.error(AppError.is(error) ? error.getMessage() : error);
        });
    });
  }

  /**
   * Will cleanup any {@link Subscription}s to prevent
   * memory leaks.
   */
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.metamodelService.clearCachedData();
  }

}
