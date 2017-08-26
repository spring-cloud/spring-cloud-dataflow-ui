import { Component } from '@angular/core';

/**
 * Component to be used in case that the authenticated user
 * does not have the necessary security roles.
 *
 * @author Gunnar Hillert
 */
@Component({
  template: `
    <h1>Roles Missing</h1>
    <p>
      It appears that you are missing the proper roles to use the Dashboard. Please contact your administrator to rectify the
      situation.
    </p>
  `,
})
export class RolesMissingComponent {
}
