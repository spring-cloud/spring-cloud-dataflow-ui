import {
  AfterContentInit, Component, DoCheck, Input
} from '@angular/core';

import { JobExecution } from '../model/job-execution.model';

/**
 * Component used to format the deployment status of Job Executions.
 *
 * @author Gunnar Hillert
 */
@Component({
  selector: 'app-definition-status',
  template: `
    <span class="label label-{{ labelClass }}">{{ label }}</span>
  `
})
export class DefinitionStatusComponent implements AfterContentInit, DoCheck {

  /**
   * The Job Execution from which the status will be retrieved.
   */
  @Input()
  jobExecution: JobExecution;

  label: string;
  labelClass: string;

  ngAfterContentInit() {
    this.setStyle();
  }

  ngDoCheck() {
    this.setStyle();
  }

  private setStyle() {
    if (this.jobExecution) {

      if (!this.jobExecution.defined) {
        this.labelClass = 'info';
        this.label = 'No Task Definition';
      }
    }
  }
}
