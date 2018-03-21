import { Component, ViewEncapsulation } from '@angular/core';
import { dia } from 'jointjs';
import { Flo, Constants } from 'spring-flo';
import { ElementComponent } from '../../../../shared/flo/support/shape-component';
import { Utils } from '../../../../shared/flo/support/utils';

/**
* Component for displaying application properties and capturing their values.
*
* @author Alex Boyko
* @author Andy Clement
*/
@Component({
  selector: 'app-flo-node',
  templateUrl: 'node.component.html',
  styleUrls: [ './node.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class NodeComponent extends ElementComponent {

  _description: string;

  constructor() {
    super();
  }

  getPropertyValue(property: string): any {
    if (this.view) {
      const value = this.view.model.attr(`props/${property}`);
      if (this.isCode(property)) {
        return Utils.decodeTextFromDSL(value);
      }
      return value;
    }
    return '';
  }

  isCanvas(): boolean {
    return this.paper.model.get('type') === Constants.CANVAS_CONTEXT;
  }

  get paper(): dia.Paper {
    return this.view ? (<any>this.view).paper : undefined;
  }

  get metadata(): Flo.ElementMetadata {
    return this.view ? this.view.model.attr('metadata') : undefined;
  }

  get metaName(): string {
    return this.metadata ? this.metadata.name : 'Unknown';
  }

  get metaGroup(): string {
    return this.metadata ? this.metadata.group : 'Unknown';
  }

  get allProperties(): any {
    return this.view ? this.view.model.attr('props') : {};
  }

  get isPropertiesShown(): boolean {
    return this.view ? !this.view.model.attr('metadata/metadata/hide-tooltip-options') : false;
  }

  get description(): string {
    if (this._description === undefined) {
      if (this.metadata && this.metadata.description) {
        this.metadata.description().then(d => this._description = d);
      }
    }
    return this._description;
  }

  get isDisabled(): boolean {
    return !this.metadata || this.metadata.unresolved || this.cannotShowToolTip;
  }

  isCode(property: string): boolean {
    return Utils.isCodeTypeProperty(this.metadata, property);
  }

  keys(o: any): Array<string> {
    return Object.keys(o);
  }

}

