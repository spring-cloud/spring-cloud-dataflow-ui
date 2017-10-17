import { Component, ViewEncapsulation } from '@angular/core';
import { Constants } from 'spring-flo';
import { ElementComponent } from '../support/shape-component';

/**
 * Component for displaying application properties and capturing their values.
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
@Component({
  selector: 'app-flo-handle',
  templateUrl: 'handle.component.html',
  encapsulation: ViewEncapsulation.None
})
export class HandleComponent extends ElementComponent {

  get tooltipText(): string {
    if (this.view) {
      switch (this.view.model.attr('./kind')) {
        case Constants.REMOVE_HANDLE_TYPE:
          return 'Remove Element';
        case Constants.PROPERTIES_HANDLE_TYPE:
          return 'Edit Properties';
      }
    }
  }

  get placement(): string {
    if (this.view) {
      switch (this.view.model.attr('./kind')) {
        case Constants.REMOVE_HANDLE_TYPE:
          return 'bottom';
        case Constants.PROPERTIES_HANDLE_TYPE:
          return 'bottom';
      }
    }
    return 'top';
  }

}

