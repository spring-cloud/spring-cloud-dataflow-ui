import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import { JobsService } from '../jobs.service';
import { StepExecutionResource } from '../model/step-execution-resource.model';

@Component({
  selector: 'app-step-execution-details',
  templateUrl: './step-execution-details.component.html'
})
export class StepExecutionDetailsComponent implements OnInit {

  jobid: string;
  stepid: string;
  private sub: any;
  stepExecutionResource: StepExecutionResource;
  percentageComplete = 0;

  constructor(
    private jobsService: JobsService,
    private toastyService: ToastyService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.jobid = params['jobid'];
      this.stepid = params['stepid'];
      this.loadData();
    });
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
    this.jobsService.getStepExecution(this.jobid, this.stepid).subscribe(
      data => {
        this.stepExecutionResource = data;
      },
      error => {
        console.log('error while loading Step Execution Details', error);
        this.toastyService.error(error);
      });
    this.jobsService.getStepExecutionProgress(this.jobid, this.stepid).subscribe(
      data => {
        this.percentageComplete = data.percentageComplete * 100;
      },
      error => {
        console.log('error while loading Step Execution Progress', error);
        this.toastyService.error(error);
      });
  }
 }
