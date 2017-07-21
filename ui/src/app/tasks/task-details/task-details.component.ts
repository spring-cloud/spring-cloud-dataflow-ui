import { Component, OnInit, OnDestroy } from '@angular/core';
import { TaskExecution } from '../model/task-execution';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
})

export class TaskExecutionsDetailsComponent implements OnInit, OnDestroy {

  id: string;
  private sub: any;
  busy: Subscription;
  taskExecution: TaskExecution;

  constructor(
    private tasksService: TasksService,
    private route: ActivatedRoute,
    private router: Router,
    private toastyService: ToastyService,
  ) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       this.id = params['id'];

       this.busy = this.tasksService.getExecution(this.id).subscribe(
         data => {
           this.taskExecution = data;
           this.toastyService.success('Task Execution loaded.');
         }
       );
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  back() {
    this.router.navigate(['tasks/executions']);
  }
}
