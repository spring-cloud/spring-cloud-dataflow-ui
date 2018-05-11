import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { JobsService } from '../jobs.service';
import { map, mergeMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Observable } from 'rxjs/Observable';

/**
 * Step Execution Progress
 *
 * @author Glenn Renfro
 * @author Gunnar Hillert
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-step-execution-progress',
  styleUrls: ['../step-execution-details/styles.scss'],
  templateUrl: './step-execution-progress.component.html'
})
export class StepExecutionProgressComponent implements OnInit {

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
   * Navigate to the previous page
   */
  back(jobid, stepid) {
    this.router.navigate([`jobs/executions/${jobid}/${stepid}`]);
  }
}
