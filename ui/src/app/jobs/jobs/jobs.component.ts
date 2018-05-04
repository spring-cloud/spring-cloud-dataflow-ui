import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Page } from '../../shared/model';
import { JobsService } from '../jobs.service';
import { JobExecution } from '../model/job-execution.model';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { BusyService } from '../../shared/services/busy.service';
import { ListParams, OrderParams } from '../../shared/components/shared.interface';
import { ConfirmService } from '../../shared/components/confirm/confirm.service';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';

/**
 * Main entry point to the Jobs Module. Provides
 * a paginated list of {@link JobExecution}s and
 * also provides operations to stop/restart {@link JobExecution}s
 *
 * @author Gunnar Hillert
 * @author Damien Vitrac
 */
@Component({
  templateUrl: './jobs.component.html',
})
export class JobsComponent implements OnInit, OnDestroy {

  /**
   * Busy subscription
   * @type {Subject<any>}
   */
  private ngUnsubscribe$: Subject<any> = new Subject();

  /**
   * Jobs
   */
  public jobExecutions: Page<JobExecution>;

  /**
   * State of Job List Params
   * @type {SortParams}
   */
  params: ListParams = {
    sort: 'id',
    order: OrderParams.ASC,
    page: 0,
    size: 30
  };

  /**
   * Storage context
   */
  context: any;

  /**
   * Constructor
   *
   * @param {BusyService} busyService
   * @param {JobsService} jobsService
   * @param {NotificationService} notificationService
   * @param {ConfirmService} confirmService
   * @param {LoggerService} loggerService
   * @param {Router} router
   */
  constructor(private busyService: BusyService,
              private jobsService: JobsService,
              private notificationService: NotificationService,
              private confirmService: ConfirmService,
              private loggerService: LoggerService,
              private router: Router) {
  }

  /**
   * As soon as the page loads we retrieve a list
   * of {@link JobExecution}s.
   */
  ngOnInit() {
    this.context = this.jobsService.jobsContext;
    this.params = { ...this.context };
    this.loadJobExecutions();
  }

  /**
   * Will cleanup any {@link Subscription}s to prevent
   * memory leaks.
   */
  ngOnDestroy() {
    this.updateContext();
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  /**
   * Job Actions
   * @param {JobExecution} item
   * @param {number} index
   */
  jobActions(item: JobExecution, index: number) {
    return [
      {
        id: 'job-view' + index,
        icon: 'info-circle',
        action: 'view',
        title: 'View the job',
        disabled: false,
        isDefault: true
      },
      {
        id: 'job-restart' + index,
        icon: 'repeat',
        action: 'restart',
        title: 'Restart the job',
        disabled: false
      },
      {
        id: 'job-stop' + index,
        icon: 'stop',
        action: 'stop',
        title: 'Stop the job',
        disabled: !item.stoppable
      }
    ];
  }

  /**
   * Fire Action (row)
   * @param action
   * @param item
   */
  fireAction(action: string, item: JobExecution) {
    switch (action) {
      case 'view':
        this.viewJob(item);
        break;
      case 'restart':
        this.restartJob(item);
        break;
      case 'stop':
        this.stopJob(item);
        break;
    }
  }

  /**
   * Load a paginated list of {@link JobExecution}s.
   */
  public loadJobExecutions() {
    const busy = this.jobsService.getJobExecutions(this.params)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(page => {
        if (page.items.length === 0 && this.params.page > 0) {
          this.params.page = 0;
          this.loadJobExecutions();
          return;
        }
        this.jobExecutions = page;
        // this.changeCheckboxes();
        this.updateContext();
      }, error => {
        this.notificationService.error(error);
      });
    this.busyService.addSubscription(busy);
  }

  /**
   * Update event from the Paginator Pager
   * @param params
   */
  changePaginationPager(params) {
    this.params.page = params.page;
    this.params.size = params.size;
    this.updateContext();
    this.loadJobExecutions();
  }

  /**
   * Write the context in the service.
   */
  updateContext() {
    this.context.sort = this.params.sort;
    this.context.order = this.params.order;
    this.context.page = this.params.page;
    this.context.size = this.params.size;
  }

  /**
   * Restart a job
   * @param {JobExecution} item
   */
  restartJob(item: JobExecution) {
    const title = `Confirm restart the job execution`;
    const description = `This action will restart the steps failed of the  ` +
      `<strong>job execution ${item.name} (${item.jobExecutionId})</strong>. Are you sure?`;
    this.confirmService.open(title, description, { confirm: 'Restart' }).subscribe(() => {
      this.loggerService.log('Restart Job ' + item.jobExecutionId);
      this.jobsService.restartJob(item)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(data => {
          this.notificationService.success('Successfully restarted job "' + item.name + '"');
        }, error => {
          this.notificationService.error(error);
        });
    });
  }

  /**
   * Stop a job
   * @param {JobExecution} item
   */
  stopJob(item: JobExecution) {
    const title = `Confirm stop job execution`;
    const description = `This action will stop the  ` +
      `<strong>job execution ${item.name} (${item.jobExecutionId})</strong>. Are you sure?`;
    this.confirmService.open(title, description, { confirm: 'Stop' }).subscribe(() => {
      this.loggerService.log('Stop Job' + item.jobExecutionId);
      this.jobsService.stopJob(item)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(data => {
            this.notificationService.success('Successfully stopped job "' + item.name + '"');
          }, error => {
            this.notificationService.error(error);
          }
        );
    });
  }

  /**
   * Navigate to the job execution page
   * @param {JobExecution} item
   */
  viewJob(item: JobExecution) {
    this.router.navigate(['jobs/executions/' + item.jobExecutionId]);
  }

  /**
   * Navigate to the task definition page
   * @param {JobExecution} item
   */
  viewTask(item: JobExecution) {
    this.router.navigate(['tasks/executions/' + item.taskExecutionId]);
  }

}
