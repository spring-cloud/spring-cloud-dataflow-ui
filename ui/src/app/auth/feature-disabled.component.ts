import { Component } from '@angular/core';

/**
 * Component to be used in case that a requested
 * feature is disabled.
 *
 * @author Gunnar Hillert
 */
@Component({
  template: `
    <h1>Feature Disabled</h1>
    <p>
      The requested feature is disabled on the server.
    </p>
  `
})
export class FeatureDisabledComponent {
}
