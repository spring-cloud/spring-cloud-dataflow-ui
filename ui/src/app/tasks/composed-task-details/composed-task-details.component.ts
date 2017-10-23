import {Component, OnInit, OnDestroy, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TasksService} from '../tasks.service';
import {ToastyService} from 'ng2-toasty';
import {Subscription} from 'rxjs/Subscription';
import {MetamodelService} from '../flo/metamodel.service';
import {RenderService} from '../flo/render.service';

@Component({
  selector: 'app-composed-task-details',
  templateUrl: 'composed-task-details.component.html',
  styleUrls: [ 'composed-task-details.component.scss' ],
  encapsulation: ViewEncapsulation.None
})

export class ComposedTaskDetailsComponent implements OnInit, OnDestroy {

  id: string;
  dsl = '';
  private sub: any;
  busy: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private tasksService: TasksService,
              private toastyService: ToastyService,
              public metamodelService: MetamodelService,
              public renderService: RenderService) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.busy = this.tasksService.getDefinition(this.id).subscribe(taskDef => {
        this.dsl = taskDef.dslText;
      }, error => {
        this.toastyService.error(error);
      });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.busy.unsubscribe();
    // Invalidate cached metamodel, thus it's reloaded next time page is opened
    this.metamodelService.clearCachedData();
  }

  goBack() {
    this.router.navigate(['tasks/definitions']);
  }

}
