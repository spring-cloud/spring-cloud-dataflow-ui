import { Component, ViewEncapsulation } from '@angular/core';
import { TYPE_INCOMING_MESSAGE_RATE, TYPE_OUTGOING_MESSAGE_RATE } from '../support/shapes';
import { ShapeComponent } from '../../shared/support/shape-component';

const MAGNITUDE_NUMBERS = [1000000000, 1000000, 1000];
const MAGNITUDE_LITERALS = ['B', 'M', 'K'];

/**
 * Component for displaying "dot" for instance streamStatuses data under the module
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
@Component({
  selector: 'app-flo-message-rate',
  templateUrl: 'message-rate.component.html',
  styleUrls: ['message-rate.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MessageRateComponent extends ShapeComponent {

  get rate(): number {
    return this.data ? +this.data.rate : 0;
  }

  get rateTooltip(): string {
    return this.rate.toString();
  }

  get tooltipPlacement(): string {
    if (this.data && this.data.type) {
      const type = this.data.type;
      if (type === TYPE_INCOMING_MESSAGE_RATE) {
        return 'bottom';
      } else if (type === TYPE_OUTGOING_MESSAGE_RATE) {
        return 'top';
      }
    }
    return 'top';
  }

  get cssClasses(): string[] {
    if (this.data && this.data.type) {
      return [this.data.type];
    }
    return [];
  }

  get rateLabel(): string {
    let postFix;
    let division;
    let index = -1;
    let fixed = 3;
    do {
      division = this.rate / MAGNITUDE_NUMBERS[++index];
    } while (!Math.floor(division) && index < MAGNITUDE_NUMBERS.length);
    if (index === MAGNITUDE_NUMBERS.length) {
      postFix = '';
      division = this.rate;
    } else {
      postFix = MAGNITUDE_LITERALS[index];
    }
    for (let decimal = 1; decimal <= 100 && Math.floor(division / decimal); decimal *= 10) {
      fixed--;
    }
    return division.toFixed(fixed) + postFix;
  }
}

