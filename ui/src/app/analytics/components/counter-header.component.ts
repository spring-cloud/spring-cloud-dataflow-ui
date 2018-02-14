import { Component, Input } from '@angular/core';

import { Counter } from '../model/counter.model';
/**
 * Class which is used in property table component as table item.
 *
 * @author Gunnar Hillert
 */
@Component({
  selector: 'app-counter-header',
  template: `
  <h2>Value: {{ counter.value }} | Latest Rate:
    {{ counter.rates && counter.rates.length ? counter.rates[counter.rates.length - 1] + " counts/second" : "--N/A--" }}</h2>
  `
})
export class CounterHeaderComponent {

  /**
   * The counter data.
   */
  @Input()
  counter: Counter;

}
