import {Component, OnInit, OnDestroy, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TasksService} from '../tasks.service';
import {ToastyService} from 'ng2-toasty';
import {Subscription} from 'rxjs/Subscription';
import {MetamodelService} from '../flo/metamodel.service';
import {RenderService} from '../flo/render.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

/**
 * @author Glenn Renfro
 * @author Gunnar Hillert
 */
@Component({
  selector: 'app-composed-task-details',
  templateUrl: 'composed-task-details.component.html',
  styleUrls: [ 'composed-task-details.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class ComposedTaskDetailsComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<any> = new Subject();
  id: string;
  dsl = '';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private tasksService: TasksService,
              private toastyService: ToastyService,
              public metamodelService: MetamodelService,
              public renderService: RenderService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.tasksService.getDefinition(this.id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(taskDef => {
        this.dsl = taskDef.dslText;
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
    this.router.navigate(['tasks/definitions']);
  }

}
