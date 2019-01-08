import { Component } from '@angular/core';

/**
 * Component to be used in case that the authenticated user
 * does not have the necessary security roles.
 *
 * @author Gunnar Hillert
 */
@Component({
  template: `
  <app-page>
    <app-page-head>
      <app-page-head-title><strong>Roles Missing</strong></app-page-head-title>
    </app-page-head>
    <div dataflowLayoutType type="full">
      <div class="dataflow-alert">
        It appears that you are missing the proper roles. Please contact your administrator to rectify the
        situation.
      </div>
    </div>
  </app-page>
  `
})
export class RolesMissingComponent {
}
