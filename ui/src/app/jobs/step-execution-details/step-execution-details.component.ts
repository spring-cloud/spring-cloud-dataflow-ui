import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { JobsService } from '../jobs.service';
import { StepExecutionResource } from '../model/step-execution-resource.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { NotificationService } from '../../shared/services/notification.service';

/**
 * @author Glenn Renfro
 * @author Gunnar Hillert
 */
@Component({
  selector: 'app-step-execution-details',
  templateUrl: './step-execution-details.component.html'
})
export class StepExecutionDetailsComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<any> = new Subject();

  jobid: string;
  stepid: string;
  stepExecutionResource: StepExecutionResource;
  percentageComplete = 0;

  constructor(
    private jobsService: JobsService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.jobid = params['jobid'];
      this.stepid = params['stepid'];
      this.loadData();
    });
  }

  /**
   * Will cleanup any {@link Subscription}s to prevent
   * memory leaks.
   */
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  refresh() {
    this.loadData();
  }

  /**
   * Navigates to the step execution progress page.
   *
   * @param {StepExecutionResource} item the id of the StepExecution is used to construct the URI parameters along with the
   * JobExecutionId.
   */
  viewStepExecutionProgress(item: StepExecutionResource) {
    this.router.navigate(['jobs/executions/' + item.jobExecutionId + '/' + item.stepExecution.id + '/progress']);
  }

  back() {
    this.router.navigate(['jobs/executions/' + this.jobid]);
  }

  private loadData() {
    this.jobsService.getStepExecution(this.jobid, this.stepid)
    .pipe(takeUntil(this.ngUnsubscribe$))
    .subscribe(
      data => {
        this.stepExecutionResource = data;
      },
      error => {
        console.log('error while loading Step Execution Details', error);
        this.notificationService.error(error);
      });
    this.jobsService.getStepExecutionProgress(this.jobid, this.stepid)
    .pipe(takeUntil(this.ngUnsubscribe$))
    .subscribe(
      data => {
        this.percentageComplete = data.percentageComplete * 100;
      },
      error => {
        console.log('error while loading Step Execution Progress', error);
        this.notificationService.error(error);
      });
  }
 }
