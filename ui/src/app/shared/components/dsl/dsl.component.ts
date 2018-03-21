import {Component} from '@angular/core';

/**
 * Sort
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-stream-dsl',
  styleUrls: ['./styles.scss'],
  template: `<code class="dsl">
    <ng-content></ng-content>
  </code>`
})
export class StreamDslComponent {
}
