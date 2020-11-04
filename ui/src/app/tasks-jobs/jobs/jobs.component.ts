import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { JobService } from '../../shared/api/job.service';
import { ClrDatagridStateInterface } from '@clr/angular';
import { JobExecution, JobExecutionPage } from '../../shared/model/job.model';
import { Router } from '@angular/router';
import { ConfirmComponent } from '../../shared/component/confirm/confirm.component';
import { NotificationService } from '../../shared/service/notification.service';
import { DatagridComponent } from '../../shared/component/datagrid/datagrid.component';
import { ContextService } from '../../shared/service/context.service';
import { SettingsService } from '../../settings/settings.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
})
export class JobsComponent extends DatagridComponent {

  page: JobExecutionPage;
  selection: JobExecution;
  @ViewChild('restartModal', { static: true }) restartModal: ConfirmComponent;
  @ViewChild('stopModal', { static: true }) stopModal: ConfirmComponent;

  constructor(private jobService: JobService,
              private router: Router,
              protected contextService: ContextService,
              protected settingsService: SettingsService,
              protected changeDetectorRef: ChangeDetectorRef,
              private notificationService: NotificationService) {
    super(contextService, settingsService, changeDetectorRef, 'tasks-jobs/jobs');
  }

  refresh(state: ClrDatagridStateInterface) {
    if (this.isReady()) {
      super.refresh(state);
      const params = this.getParams(state, { name: '', type: '', dates: [null, null] });
      this.unsubscribe$ = this.jobService.getExecutions(params.current - 1, params.size, params.dates[0], params.dates[1])
        .subscribe((page: JobExecutionPage) => {
          this.page = page;
          this.updateGroupContext(params);
          this.loading = false;
        });
    }
  }

  details(execution: JobExecution) {
    this.router.navigateByUrl(`tasks-jobs/job-executions/${execution.jobExecutionId}`);
  }

  restart(execution: JobExecution) {
    this.selection = execution;
    this.restartModal.open();
  }

  restartJob() {
    this.jobService.restart(this.selection)
      .subscribe(() => {
        this.notificationService.success('Restart job', `Successfully restarted job "${this.selection.name}"`);
      }, error => {
        this.notificationService.error('An error occurred', error);
      });
  }

  stop(execution: JobExecution) {
    this.selection = execution;
    this.stopModal.open();
  }

  stopJob() {
    this.jobService.stop(this.selection)
      .subscribe(() => {
        this.notificationService.success('Stop job', `Successfully stopped job "${this.selection.name}"`);
      }, error => {
        this.notificationService.error('An error occurred', error);
      });
  }
}
