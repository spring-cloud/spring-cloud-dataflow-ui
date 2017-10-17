import { Component, ViewEncapsulation } from '@angular/core';
import { dia } from 'jointjs';
import { ElementComponent } from '../support/shape-component';

/**
 * Component for displaying application properties and capturing their values.
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
@Component({
  selector: 'app-flo-decoration',
  templateUrl: 'decoration.component.html',
  styleUrls: [ 'decoration.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class DecorationComponent extends ElementComponent {

  getMessages(): Array<string> {
    return this.view && Array.isArray(this.view.model.attr('messages')) ? this.view.model.attr('messages') : [];
  }

  get kind(): string {
    return this.view ? this.view.model.attr('./kind') : '';
  }

}

