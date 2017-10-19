/* tslint:disable:no-access-missing-member */

import { Component, ViewEncapsulation } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Properties } from 'spring-flo';
import { Validators } from '@angular/forms';
import { dia } from 'jointjs';
import { StreamsService } from '../../streams.service';
import { Utils } from '../support/utils';
import { ApplicationType } from '../../../shared/model/application-type';
import { PropertiesDialogComponent } from '../../../shared/flo/properties/properties-dialog.component';
import { PropertiesGroupModel } from '../../../shared/flo/support/properties-group-model';


/**
 * Utility class for working with Properties.
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
class StreamPropertiesGroupModel extends PropertiesGroupModel {

  constructor(cell: dia.Cell,
              private streamHeads: Array<dia.Cell>,
              private isStreamHead: boolean,
              private streamService: StreamsService
  ) {
    super(cell);
  }

  protected createControlModel(property: Properties.Property): Properties.ControlModel<any> {
    const inputType = Properties.InputType.TEXT;
    let validation: Properties.Validation;
    if (property.metadata) {
      return super.createControlModel(property);
    } else {
      // Notational properties
      if (property.id === 'label') {
        validation = {
          validator: Validators.pattern(/^[\w_]+[\w_-]*$/),
          errorData: [
            {id: 'pattern', message: 'Invalid app label!'}
          ]
        };
      } else if (property.id === 'stream-name') {
        validation = {
          validator: [
            Validators.pattern(/^[\w_]+[\w_-]*$/),
            Properties.Validators.noneOf(this.streamHeads
              .filter(e => e.attr('stream-name') && e !== this.cell)
              .map(e => e.attr('stream-name')))
          ],
          asyncValidator: Properties.Validators.uniqueResource((value) => this.streamService.getDefinition(value), 500),
          errorData: [
            {id: 'pattern', message: 'Invalid stream name!'},
            {id: 'uniqueResource', message: 'Stream name already exists!'},
            {id: 'noneOf', message: 'Stream name already exists on the canvas'}
          ]
        };
      }
    }
    return new Properties.GenericControlModel(property, inputType, validation);
  }

  protected createNotationalProperties(): Array<Properties.Property> {
    const notationalProperties = [];
    if (typeof ApplicationType[this.cell.attr('metadata/group')] === 'number') {
      notationalProperties.push({
        id: 'label',
        name: 'label',
        defaultValue: this.cell.attr('metadata/name'),
        attr: 'node-name',
        value: this.cell.attr('node-name'),
        description: 'Label of the app',
        metadata: null
      });
    }
    if (this.isStreamHead) {
      notationalProperties.push({
        id: 'stream-name',
        name: 'stream name',
        value: this.cell.attr('stream-name'),
        defaultValue: '',
        description: 'The name of the stream started by this app',
        attr: 'stream-name',
        metadata: null
      });
    }
    return notationalProperties;
  }
}

/**
 * Component for displaying application properties and capturing their values.
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
@Component({
  selector: 'app-stream-properties-dialog-content',
  templateUrl: '../../../shared/flo/properties/properties-dialog.component.html',
  styleUrls: [ '../../../shared/flo/properties/properties-dialog.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class StreamPropertiesDialogComponent extends PropertiesDialogComponent {

  public title: string;

  constructor(bsModalRef: BsModalRef,
      private streamService: StreamsService
  ) {
    super(bsModalRef);
  }

  setData(c: dia.Cell, graph: dia.Graph) {
    const streamHeads = graph.getElements().filter(e => Utils.canBeHeadOfStream(graph, e));
    this.propertiesGroupModel = new StreamPropertiesGroupModel(c, streamHeads,
      (<Array<dia.Cell>>streamHeads).indexOf(c) >= 0, this.streamService);
    this.propertiesGroupModel.load();
  }

}
