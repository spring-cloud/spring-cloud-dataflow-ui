import {Component} from '@angular/core';

@Component({
  template: `
    <h1>{{ 'security.authenticationRequired.title' | translate }}</h1>
    <p>{{ 'security.authenticationRequired.description' | translate }}</p>
  `
})
export class AuthenticationRequiredComponent {}
