import {Component} from '@angular/core';

@Component({
  template: `
    <h1>{{ 'security.featureDisabled.title' | translate }}</h1>
    <p>{{ 'security.featureDisabled.description' | translate }}</p>
  `
})
export class FeatureDisabledComponent {}
