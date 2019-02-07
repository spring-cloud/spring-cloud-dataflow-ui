import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { StreamsService } from '../../streams.service';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { RenderService } from '../../components/flo/render.service';
import { MetamodelService } from '../../components/flo/metamodel.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { AppError } from '../../../shared/model/error.model';
import { StreamDefinition } from '../../model/stream-definition';
import { Observable } from 'rxjs';

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
   * Stream name
   */
  id: string;

  /**
   * DSL
   */
  dsl$: Observable<string>;

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
    this.dsl$ = this.route.parent.params
      .pipe(
        mergeMap((param: Params) => this.streamsService.getRelatedDefinitions(param.id, true)),
        map((streams: StreamDefinition[]): string => streams.map(s => `${s.name}=${s.dslText}`).join('\n'))
      );
  }

  /**
   * Will cleanup any {@link Subscription}s to prevent
   * memory leaks.
   */
  ngOnDestroy() {
    this.metamodelService.clearCachedData();
  }

}
