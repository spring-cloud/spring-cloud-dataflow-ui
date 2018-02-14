import {
  AfterContentInit, Component, DoCheck, Input
} from '@angular/core';

/**
 * Component that will format the Job Execution Status.
 *
 * @author Gunnar Hillert
 */
@Component({
  selector: 'app-job-execution-status',
  template: `
    <span [class]="cssClass">{{ status }}</span>
  `
})
export class JobExecutionStatusComponent implements AfterContentInit, DoCheck {

  /**
   * The status that needs to be formatted.
   */
  @Input() status: string;

  cssClass: string;

  ngAfterContentInit() {
    this.setStyle();
  }

  ngDoCheck() {
    this.setStyle();
  }

  private setStyle() {
    if (this.status === 'COMPLETED') {
      this.cssClass = 'text-success';
    } else if (this.status === 'FAILED') {
      this.cssClass = 'text-danger';
    } else {
      this.cssClass = '';
    }
  }
}
