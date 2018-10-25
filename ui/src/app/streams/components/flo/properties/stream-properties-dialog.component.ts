/* tslint:disable:no-access-missing-member */

import { Component, ViewEncapsulation } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Properties } from 'spring-flo';
import { Validators } from '@angular/forms';
import { StreamsService } from '../../../streams.service';
import { PropertiesDialogComponent } from '../../../../shared/flo/properties/properties-dialog.component';
import { PropertiesGroupModel } from '../../../../shared/flo/support/properties-group-model';
import { AppUiProperty } from '../../../../shared/flo/support/app-ui-property';
import { StreamAppPropertiesSource } from './stream-properties-source';
// Workaround to load jshint to have linting working for JS snippet inside the props dialog
import { JSHINT } from 'jshint';

if (!(<any>window).JSHINT) {
  (<any>window).JSHINT = JSHINT;
}

/**
 * Utility class for working with Properties.
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
export class StreamPropertiesGroupModel extends PropertiesGroupModel {

  constructor(propertiesSource: StreamAppPropertiesSource,
              private streamService: StreamsService
  ) {
    super(propertiesSource);
  }

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
            {id: 'pattern', message: 'Invalid app label!'}
          ]
        };
      } else if (property.id === 'stream-name') {
        validation = {
          validator: [
            Validators.pattern(/^[\w_]+[\w_-]*$/),
            Properties.Validators.noneOf((<StreamAppPropertiesSource>this.propertiesSource).getStreamHead().presentStreamNames)
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

}

/**
 * Component for displaying application properties and capturing their values.
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
@Component({
  selector: 'app-stream-properties-dialog-content',
  templateUrl: '../../../../shared/flo/properties/properties-dialog.component.html',
  styleUrls: [ '../../../../shared/flo/properties/properties-dialog.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class StreamPropertiesDialogComponent extends PropertiesDialogComponent {

  public title: string;

  constructor(bsModalRef: BsModalRef,
      private streamService: StreamsService
  ) {
    super(bsModalRef);
  }

  setData(propertiesSource: StreamAppPropertiesSource) {
    this.propertiesGroupModel = new StreamPropertiesGroupModel(
      propertiesSource,
      this.streamService);
    this.propertiesGroupModel.load();
  }

}
