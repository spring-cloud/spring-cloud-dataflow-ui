import { Component, ViewChild } from '@angular/core';
import { Task } from '../../shared/model/task.model';
import { ClrDatagridStateInterface } from '@clr/angular';
import { TaskPage } from '../../shared/model/task.model';
import { TaskService } from '../../shared/api/task.service';
import { DestroyComponent } from './destroy/destroy.component';
import { Router } from '@angular/router';
import { DatagridComponent } from '../../shared/component/datagrid/datagrid.component';
import { ContextService } from '../../shared/service/context.service';
import { GroupService } from '../../shared/service/group.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
})
export class TasksComponent extends DatagridComponent {
  page: TaskPage;
  @ViewChild('destroyModal', { static: true }) destroyModal: DestroyComponent;

  constructor(private taskService: TaskService,
              private router: Router,
              private groupService: GroupService,
              protected contextService: ContextService) {
    super(contextService, 'tasks');
  }

  refresh(state: ClrDatagridStateInterface) {
    if (this.isReady()) {
      super.refresh(state);
      const params = this.getParams(state, { name: '', type: '' });
      this.taskService.getTasks(params.current - 1, params.size, params?.taskName || '',
        `${params.by || ''}`, `${params.reverse ? 'DESC' : 'ASC'}`)
        .subscribe((page: TaskPage) => {
          this.attachColumns();
          this.page = page;
          this.updateGroupContext(params);
          this.selected = [];
          this.loading = false;
        });
    }
  }

  details(task: Task) {
    this.router.navigateByUrl(`tasks-jobs/tasks/${task.name}`);
  }

  createTask() {
    this.router.navigateByUrl(`tasks-jobs/tasks/create`);
  }

  launch(task: Task) {
    this.router.navigateByUrl(`tasks-jobs/tasks/${task.name}/launch`);
  }

  scheduleTasks(tasks: Task[]) {
    const group = this.groupService.create(tasks.map(task => task.name));
    this.router.navigateByUrl(`tasks-jobs/schedules/${group}/create`);
  }

  schedule(task: Task) {
    this.router.navigateByUrl(`tasks-jobs/schedules/${task.name}/create`);
  }

  destroyTasks(tasks: Task[]) {
    this.destroyModal.open(tasks);
  }
}
