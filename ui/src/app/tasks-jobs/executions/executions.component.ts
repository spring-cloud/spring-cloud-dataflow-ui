import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { TaskService } from '../../shared/api/task.service';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Router } from '@angular/router';
import { TaskExecution, TaskExecutionPage } from '../../shared/model/task-execution.model';
import { StopComponent } from './stop/stop.component';
import { CleanupComponent } from './cleanup/cleanup.component';
import { DatagridComponent } from '../../shared/component/datagrid/datagrid.component';
import { ContextService } from '../../shared/service/context.service';
import { SettingsService } from '../../settings/settings.service';

@Component({
  selector: 'app-executions',
  templateUrl: './executions.component.html',
})
export class ExecutionsComponent extends DatagridComponent {

  page: TaskExecutionPage;
  state: ClrDatagridStateInterface;
  @ViewChild('stopModal', { static: true }) stopModal: StopComponent;
  @ViewChild('cleanModal', { static: true }) cleanModal: CleanupComponent;

  constructor(private taskService: TaskService,
              protected contextService: ContextService,
              protected settingsService: SettingsService,
              protected changeDetectorRef: ChangeDetectorRef,
              private router: Router) {
    super(contextService, settingsService, changeDetectorRef, 'tasks-jobs/executions');
  }

  refresh(state: ClrDatagridStateInterface) {
    if (this.isReady()) {
      super.refresh(state);
      const params = this.getParams(state, { name: '', type: '' });
      this.unsubscribe$ = this.taskService.getExecutions(params.current - 1, params.size, params?.taskName || '',
        `${params?.by || ''}`, `${params?.reverse ? 'DESC' : 'ASC'}`)
        .subscribe((page: TaskExecutionPage) => {
          this.page = page;
          this.updateGroupContext(params);
          this.selected = [];
          this.loading = false;
        });
    }
  }

  details(execution: TaskExecution) {
    this.router.navigateByUrl(`tasks-jobs/task-executions/${execution.executionId}`);
  }

  taskDetails(execution: TaskExecution) {
    this.router.navigateByUrl(`tasks-jobs/tasks/${execution.taskName}`);
  }

  relaunch(execution: TaskExecution) {
    this.router.navigateByUrl(`tasks-jobs/tasks/${execution.taskName}/launch`);
  }

  stop(execution: TaskExecution) {
    this.stopModal.open(execution);
  }

  cleanup(executions: TaskExecution[]) {
    this.cleanModal.open(executions);
  }

}
