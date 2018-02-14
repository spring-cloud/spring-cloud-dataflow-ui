import {Component, OnInit, OnDestroy, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {StreamsService} from '../streams.service';
import {ToastyService} from 'ng2-toasty';
import {Subscription} from 'rxjs/Subscription';
import {MetamodelService} from '../flo/metamodel.service';
import {RenderService} from '../flo/render.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-stream-details',
  templateUrl: 'stream-details.component.html',
  styleUrls: [ 'stream-details.component.scss' ],
  encapsulation: ViewEncapsulation.None
})

export class StreamDetailsComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<any> = new Subject();
  id: string;
  dsl = '';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private streamsService: StreamsService,
              private toastyService: ToastyService,
              public metamodelService: MetamodelService,
              public renderService: RenderService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.streamsService.getRelatedDefinitions(this.id, true)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(streams => {
        this.dsl = streams.map(s => `${s.name}=${s.dslText}`).join('\n');
      }, error => {
        this.toastyService.error(error);
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
    // Invalidate cached metamodel, thus it's reloaded next time page is opened
    this.metamodelService.clearCachedData();
  }

  goBack() {
    this.router.navigate(['streams/definitions']);
  }

}
