import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {ActivatedRoute} from '@angular/router';
import {StreamsService} from '../../streams.service';
import {ToastyService} from 'ng2-toasty';
import {BusyService} from '../../../shared/services/busy.service';
import {takeUntil} from 'rxjs/operators';
import {RenderService} from '../../components/flo/render.service';
import {MetamodelService} from '../../components/flo/metamodel.service';

/**
 * Component that show the details of a Stream Definition
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
   * Busy Subject
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
   * @param {ToastyService} toastyService
   * @param {BusyService} busyService
   * @param {MetamodelService} metamodelService
   * @param {RenderService} renderService
   */
  constructor(private route: ActivatedRoute,
              private streamsService: StreamsService,
              private toastyService: ToastyService,
              private busyService: BusyService,
              public metamodelService: MetamodelService,
              public renderService: RenderService) {
  }

  /**
   * Initialize
   */
  ngOnInit() {
    this.route.parent.params.subscribe(params => {
      this.id = params['id'];
      const busy = this.streamsService.getRelatedDefinitions(this.id, true)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(streams => {
          this.dsl = streams.map(s => `${s.name}=${s.dslText}`).join('\n');
        }, (error) => {
          this.toastyService.error(error);
        });

      this.busyService.addSubscription(busy);
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
