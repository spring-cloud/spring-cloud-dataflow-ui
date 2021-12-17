import {Component} from '@angular/core';

@Component({
  template: `
    <h1>{{ 'security.rolesMissing.title' | translate }}</h1>
    <p>{{ 'security.rolesMissing.description' | translate }}</p>
  `
})
export class RolesMissingComponent {}
