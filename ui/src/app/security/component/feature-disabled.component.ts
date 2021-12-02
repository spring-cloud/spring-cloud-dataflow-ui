import {Component} from '@angular/core';

@Component({
  template: `
    <h1><ng-container i18n>Feature Disabled</ng-container></h1>
    <p><ng-container i18n>The requested feature is disabled on the server.</ng-container></p>
  `
})
export class FeatureDisabledComponent {}
