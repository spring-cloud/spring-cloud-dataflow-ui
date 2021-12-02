import {Component} from '@angular/core';

@Component({
  template: `
    <h1><ng-container i18n>Authentication required</ng-container></h1>
    <p><ng-container i18n>Please sign in.</ng-container></p>
  `
})
export class AuthenticationRequiredComponent {}
