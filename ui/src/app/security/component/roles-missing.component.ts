import {Component} from '@angular/core';

@Component({
  template: `
    <h1><ng-container i18n>Roles Missing</ng-container></h1>
    <p><ng-container i18n>It appears that you are missing the proper roles. Please contact your administrator to rectify the situation.</ng-container></p>
  `
})
export class RolesMissingComponent {}
