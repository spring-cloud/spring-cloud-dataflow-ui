import { Component } from '@angular/core';

/**
 * Component to be used in case that an authentication is required.
 *
 * @author Damien Vitrac
 */
@Component({
  template: `
    <app-page>
      <app-page-head>
        <app-page-head-title><strong>Authentication required</strong></app-page-head-title>
      </app-page-head>
    </app-page>
    <p>Please sign in.</p>
  `
})
export class AuthenticationRequiredComponent {
}
