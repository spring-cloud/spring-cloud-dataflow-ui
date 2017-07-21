import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-task-launch',
  templateUrl: './task-launch.component.html',
})
export class TaskLaunchComponent implements OnInit, OnDestroy {

  id: string;
  private sub: any;

  constructor(
    private tasksService: TasksService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
    });
   }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  back() {
    this.router.navigate(['tasks/definitions']);
  }

  launch(name: string) {
    console.log('launch', name)
    this.tasksService.launchDefinition(name).subscribe();
    this.router.navigate(['tasks/definitions']);
  }

}
