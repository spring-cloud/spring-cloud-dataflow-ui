import { AfterContentInit, Component, DoCheck, Input } from '@angular/core';
import { AppRegistration } from '../../../shared/model';

/**
 * Component used to format the type of Application.
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-type',
  template: `<span class="label label-apptype label-{{ labelClass }}">{{ label }}</span>`
})
export class AppTypeComponent implements AfterContentInit, DoCheck {

  /**
   * Application
   */
  @Input() application: AppRegistration;

  /**
   * Label type
   */
  label: string;

  /**
   * Label css class
   */
  labelClass: string;

  /**
   * Implement AfterContentInit
   * Setup local variables
   */
  ngAfterContentInit() {
    this.setStyle();
  }

  /**
   * Implement DoCheck
   * Update local variables
   */
  ngDoCheck() {
    this.setStyle();
  }

  /**
   * Define label and css class
   */
  private setStyle() {
    if (this.application) {

      this.label = this.application.type.toString().toUpperCase();

      switch (this.label) {
        case 'APP':
          this.labelClass = 'app';
          break;
        case 'TASK':
          this.labelClass = 'danger';
          break;
        case 'SINK':
          this.labelClass = 'warning';
          break;
        case 'PROCESSOR':
          this.labelClass = 'success';
          break;
        default:
        case 'SOURCE':
          this.labelClass = 'info';
          break;
      }
    }
  }
}
