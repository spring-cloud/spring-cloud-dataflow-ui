/* tslint:disable:no-access-missing-member */

import { Component, ViewEncapsulation } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Properties } from 'spring-flo';
import { Validators } from '@angular/forms';
import { dia } from 'jointjs';
import { ApplicationType } from '../../../shared/model/application-type';
import { PropertiesDialogComponent } from '../../../shared/flo/properties/properties-dialog.component';
import { PropertiesGroupModel } from '../../../shared/flo/support/properties-group-model';


/**
 * Utility class for working with Properties.
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
class TaskPropertiesGroupModel extends PropertiesGroupModel {

  constructor(cell: dia.Cell) {
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
        attr: 'node-label',
        value: this.cell.attr('node-label'),
        description: 'Label of the task',
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
  selector: 'app-task-properties-dialog-content',
  templateUrl: '../../../shared/flo/properties/properties-dialog.component.html',
  styleUrls: [ '../../../shared/flo/properties/properties-dialog.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class TaskPropertiesDialogComponent extends PropertiesDialogComponent {

  public title: string;

  constructor(bsModalRef: BsModalRef) {
    super(bsModalRef);
  }

  setData(c: dia.Cell, graph: dia.Graph) {
    this.propertiesGroupModel = new TaskPropertiesGroupModel(c);
    this.propertiesGroupModel.load();
  }

}
