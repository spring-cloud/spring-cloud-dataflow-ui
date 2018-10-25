import { Component } from '@angular/core';

/**
 * Sort
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-stream-dsl',
  styleUrls: ['./styles.scss'],
  template: `<div class="dsl">
    <ng-content></ng-content>
  </div>`
})
export class StreamDslComponent {
}
