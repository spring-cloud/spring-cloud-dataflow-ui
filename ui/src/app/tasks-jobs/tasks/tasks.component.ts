import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Task } from '../../shared/model/task.model';
import { ClrDatagrid, ClrDatagridStateInterface } from '@clr/angular';
import { TaskPage } from '../../shared/model/task.model';
import { TaskService } from '../../shared/api/task.service';
import { DestroyComponent } from './destroy/destroy.component';
import { Router } from '@angular/router';
import { GroupService } from '../../shared/service/group.service';
import { DatagridComponent } from '../../shared/component/datagrid/datagrid.component';
import { ContextService } from '../../shared/service/context.service';
import { SettingsService } from '../../settings/settings.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
})
export class TasksComponent extends DatagridComponent {
  page: TaskPage;
  @ViewChild('destroyModal', { static: true }) destroyModal: DestroyComponent;
  @ViewChild('datagrid') datagrid: ClrDatagrid;

  constructor(private taskService: TaskService,
              private router: Router,
              private groupService: GroupService,
              protected settingsService: SettingsService,
              protected changeDetectorRef: ChangeDetectorRef,
              protected contextService: ContextService) {
    super(contextService, settingsService, changeDetectorRef, 'tasks-jobs/tasks');
  }

  refresh(state: ClrDatagridStateInterface) {
    if (this.isReady()) {
      super.refresh(state);
      const params = this.getParams(state, { name: '', type: '' });
      this.unsubscribe$ = this.taskService.getTasks(params.current - 1, params.size, params?.taskName || '',
        `${params.by || ''}`, `${params.reverse ? 'DESC' : 'ASC'}`)
        .subscribe((page: TaskPage) => {
          this.page = page;
          this.updateGroupContext(params);
          this.selected = [];
          this.loading = false;
        });
    }
  }

  setMode(grouped: boolean) {
    this.grouped = grouped;
    this.selected = [];
    // Hack (clarity/refresh lockItem)
    setTimeout(() => {
      this.datagrid.rows.map(row => {
        this.datagrid.selection.lockItem(row.item, row.item.composedTaskElement);
      });
    });
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
