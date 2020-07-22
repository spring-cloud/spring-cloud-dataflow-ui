/* tslint:disable:no-access-missing-member */

import { Component, ViewEncapsulation } from '@angular/core';
import { Properties } from 'spring-flo';
import { Validators } from '@angular/forms';
import PropertiesSource = Properties.PropertiesSource;
import { AppUiProperty } from '../../shared/support/app-ui-property';
import { PropertiesDialogComponent } from '../../shared/properties/properties-dialog.component';
import { PropertiesGroupModel } from '../../shared/support/properties-group-model';


/**
 * Utility class for working with Properties.
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
class TaskPropertiesGroupModel extends PropertiesGroupModel {

  protected createControlModel(property: AppUiProperty): Properties.ControlModel<any> {
    const inputType = Properties.InputType.TEXT;
    let validation: Properties.Validation;
    if (property.isSemantic) {
      return super.createControlModel(property);
    } else {
      // Notational properties
      if (property.id === 'label') {
        validation = {
          validator: Validators.pattern(/^[\w_]+[\w_-]*$/),
          errorData: [
            { id: 'pattern', message: 'Invalid app label!' }
          ]
        };
      }
    }
    return new Properties.GenericControlModel(property, inputType, validation);
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
  templateUrl: '../../shared/properties/properties-dialog.component.html',
  styleUrls: ['../../shared/properties/properties-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskPropertiesDialogComponent extends PropertiesDialogComponent {

  public title: string;

  constructor() {
    super();
  }

  setData(propertiesSource: PropertiesSource) {
    this.propertiesGroupModel = new TaskPropertiesGroupModel(propertiesSource);
    this.propertiesGroupModel.load();
  }

}
