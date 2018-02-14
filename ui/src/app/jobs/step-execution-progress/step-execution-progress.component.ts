import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import { JobsService } from '../jobs.service';
import { StepExecutionProgress } from '../model/step-execution-progress.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-step-execution-progress',
  templateUrl: './step-execution-progress.component.html'
})
export class StepExecutionProgressComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<any> = new Subject();

  jobid: string;
  stepid: string;
  stepExecutionProgress: StepExecutionProgress;
  percentageComplete = 0;

  constructor(
    private jobsService: JobsService,
    private toastyService: ToastyService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.jobid = params['jobid'];
      this.stepid = params['stepid'];
      this.loadProgressData();
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
    this.loadProgressData();
  }

  back() {
    this.router.navigate(['jobs/executions/' + this.jobid + '/' + this.stepid]);
  }

  private loadProgressData() {
    this.jobsService.getStepExecutionProgress(this.jobid, this.stepid)
    .pipe(takeUntil(this.ngUnsubscribe$))
    .subscribe(
      data => {
        this.stepExecutionProgress = data;
        this.percentageComplete = data.percentageComplete * 100;
      },
      error => {
        console.log('error while loading Step Execution Progress', error);
        this.toastyService.error(error);
      });
  }
}
