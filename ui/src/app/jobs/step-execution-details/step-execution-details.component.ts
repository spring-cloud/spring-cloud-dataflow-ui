import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { JobsService } from '../jobs.service';
import { StepExecutionResource } from '../model/step-execution-resource.model';
import { Observable } from 'rxjs/Observable';
import { mergeMap, map } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';

/**
 * Step Execution Details
 *
 * @author Glenn Renfro
 * @author Gunnar Hillert
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-step-execution-details',
  styleUrls: ['styles.scss'],
  templateUrl: './step-execution-details.component.html'
})
export class StepExecutionDetailsComponent implements OnInit {

  /**
   * Observable Step Execution Informations
   */
  stepExecutionDetails$: Observable<any>;

  /**
   * Constructor
   *
   * @param {JobsService} jobsService
   * @param {ActivatedRoute} route
   * @param {Router} router
   */
  constructor(private jobsService: JobsService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  /**
   * Init component
   */
  ngOnInit() {
    this.refresh();
  }

  /**
   * Refresh
   */
  refresh() {
    this.stepExecutionDetails$ = this.route.params
      .pipe(mergeMap(
        val => forkJoin([
          this.jobsService.getJobExecution(val.jobid),
          this.jobsService.getStepExecution(val.jobid, val.stepid),
          this.jobsService.getStepExecutionProgress(val.jobid, val.stepid)
        ]),
        (val1: Params, val2: any) => val2
      ))
      .pipe(map(
        val => ({ jobExecution: val[0], stepExecution: val[1], stepExecutionProgress: val[2] })
      ));
  }

  /**
   * Navigates to the step execution progress page.
   *
   * @param {StepExecutionResource} item the id of the StepExecution is used to construct the URI parameters along
   * with the JobExecutionId.
   */
  viewStepExecutionProgress(item: StepExecutionResource) {
    this.router.navigate([`jobs/executions/${item.jobExecutionId}/${item.stepExecution.id}/progress`]);
  }

  /**
   * Navigate to the previous page
   */
  back(jobid) {
    this.router.navigate([`jobs/executions/${jobid}`]);
  }
}
