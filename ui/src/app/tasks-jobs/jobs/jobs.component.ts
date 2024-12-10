import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {JobService} from '../../shared/api/job.service';
import {ClrDatagridStateInterface} from '@clr/angular';
import {JobExecution, JobExecutionPage} from '../../shared/model/job.model';
import {Router} from '@angular/router';
import {ConfirmComponent} from '../../shared/component/confirm/confirm.component';
import {NotificationService} from '../../shared/service/notification.service';
import {DatagridComponent} from '../../shared/component/datagrid/datagrid.component';
import {ContextService} from '../../shared/service/context.service';
import {SettingsService} from '../../settings/settings.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html'
})
export class JobsComponent extends DatagridComponent {
  page: JobExecutionPage;
  selection: JobExecution;
  @ViewChild('restartModal', {static: true}) restartModal: ConfirmComponent;
  @ViewChild('stopModal', {static: true}) stopModal: ConfirmComponent;

  constructor(
    private jobService: JobService,
    private router: Router,
    protected contextService: ContextService,
    protected settingsService: SettingsService,
    protected changeDetectorRef: ChangeDetectorRef,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {
    super(contextService, settingsService, changeDetectorRef, 'tasks-jobs/jobs');
  }

  refresh(state: ClrDatagridStateInterface): void {
    if (this.isReady()) {
      super.refresh(state);
      const params = this.getParams(state, {name: '', type: '', dates: [null, null]});
      this.unsubscribe$ = this.jobService
        .getExecutions(params.current - 1, params.size, params.dates[0], params.dates[1])
        .subscribe(
          (page: JobExecutionPage) => {
            this.page = page;
            this.updateGroupContext(params);
            this.loading = false;
          },
          error => {
            this.loading = false;
            this.notificationService.error(this.translate.instant('commons.message.error'), error);
          }
        );
    }
  }

  details(execution: JobExecution): void {
    this.router.navigateByUrl(`tasks-jobs/job-executions/${execution.jobExecutionId}`);
  }

  restart(execution: JobExecution): void {
    this.selection = execution;
    this.restartModal.open();
  }

  restartJob(): void {
    this.jobService.restart(this.selection).subscribe(
      () => {
        this.notificationService.success(
          this.translate.instant('jobs.main.message.successStopTitle'),
          this.translate.instant('jobs.main.message.successRestartMessage', {name: this.selection.name})
        );
      },
      error => {
        this.notificationService.error(this.translate.instant('commons.message.error'), error);
      }
    );
  }

  stop(execution: JobExecution): void {
    this.selection = execution;
    this.stopModal.open();
  }

  stopJob(): void {
    this.jobService.stop(this.selection).subscribe(
      () => {
        this.notificationService.success(
          this.translate.instant('jobs.main.message.successStopTitle'),
          this.translate.instant('jobs.main.message.successStopMessage', {name: this.selection.name})
        );
      },
      error => {
        this.notificationService.error(this.translate.instant('commons.message.error'), error);
      }
    );
  }
}
