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
      this.jobsService.getStepExecution(this.jobid, this.stepid).subscribe(
        data => {
        this.stepExecutionResource = data;
        },
        error => {
          console.log('error while loading Step Execution Details', error);
          this.toastyService.error(error);
        });
    });
  }

  back() {
    this.router.navigate(['jobs/executions/' + this.jobid]);
  }
}
