import { Component, ViewEncapsulation } from '@angular/core';
import { BaseShapeComponent } from '../../../../shared/flo/support/shape-component';
import { TYPE_INCOMING_MESSAGE_RATE, TYPE_OUTGOING_MESSAGE_RATE } from '../support/shapes';

const MAGNITUDE_NUMBERS = [ 1000000000, 1000000, 1000];
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
  styleUrls: [ 'message-rate.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class MessageRateComponent extends BaseShapeComponent {

  get rate(): number {
    return this.data ? <number> this.data.rate : 0;
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
      return [ this.data.type ];
    }
    return [];
  }

  get rateLabel(): string {
    let postFix, division, index = -1, fixed = 3;
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

