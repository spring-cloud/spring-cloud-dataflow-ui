import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import { JobsService } from '../jobs.service';
import { JobExecution } from '../model/job-execution.model';
import { StepExecution } from '../model/step-execution.model';

@Component({
  selector: 'app-job-execution-details',
  templateUrl: './job-execution-details.component.html'
})
export class JobExecutionDetailsComponent implements OnInit {

  id: string;
  jobExecution: JobExecution;
  private sub: any;

  constructor(
    private jobsService: JobsService,
    private toastyService: ToastyService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.jobsService.getJobExecution(this.id).subscribe(
        data => {
        this.jobExecution = data;
        },
        error => {
          console.log('error while loading Job Execution Details', error);
          this.toastyService.error(error);
        }
      );
    });
  }

  viewStepExecutionDetails(item: StepExecution) {
    console.log('Step Execution Details for', item);
    this.router.navigate(['jobs/executions/' + this.id + '/' + item.id]);
  }

  back() {
    this.router.navigate(['jobs/executions']);
  }
}
