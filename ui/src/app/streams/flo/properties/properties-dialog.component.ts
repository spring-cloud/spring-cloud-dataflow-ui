import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Flo, Properties } from 'spring-flo';
import { FormGroup, Validators } from '@angular/forms';
import { dia } from 'jointjs';
import { StreamsService } from '../../streams.service';
import { Utils } from '../support/utils';
import { Subscription } from 'rxjs/Subscription';
import { ApplicationType } from '../../../shared/model/application-type';


/**
 * Utility class for working with Properties.
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
class PropertiesGroupModel extends Properties.PropertiesGroupModel {

  constructor(cell: dia.Cell,
              private streamHeads: Array<dia.Cell>,
              private isStreamHead: boolean,
              private streamService: StreamsService
  ) {
    super(cell);
  }

  protected createControlModel(property: Properties.Property): Properties.ControlModel<any> {
    let inputType = Properties.InputType.TEXT;
    let validation: Properties.Validation;
    if (property.metadata) {
      switch (property.metadata.type) {
        case 'java.lang.Long':
        case 'java.lang.Integer':
          inputType = Properties.InputType.NUMBER;
          break;
        case 'java.net.URL':
        case 'java.net.URI':
          inputType = Properties.InputType.URL;
          break;
        case 'java.lang.Boolean':
          inputType = Properties.InputType.CHECKBOX;
          break;
        default:
          if (Array.isArray(property.metadata.options)) {
            return new Properties.SelectControlModel(property,
              Properties.InputType.SELECT, (<Array<string>> property.metadata.options).map(o => {
                return {
                  name: o.charAt(0).toUpperCase() + o.substr(1).toLowerCase(),
                  value: o === property.defaultValue ? undefined : o
                };
              }));
          } else if (property.metadata.name === 'password') {
            inputType = Properties.InputType.PASSWORD;
          } else if (property.metadata.name === 'e-mail' || property.metadata.name === 'email') {
            inputType = Properties.InputType.EMAIL;
            validation = {
              validator: Validators.email,
              errorData: [
                {id: 'email', message: 'Invalid E-Mail value!'}
              ]
            };
          } else if (property.metadata.type && property.metadata.type.lastIndexOf('[]') === property.metadata.type.length - 2) {
            return new Properties.GenericListControlModel(property);
          }
      }
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

  protected createProperties(): Promise<Array<Properties.Property>> {
    return super.createProperties().then(semanticProperties => {
      const notationalProperties = this.createNotationalProperties();
      return semanticProperties ? notationalProperties.concat(semanticProperties) : notationalProperties;
    });
  }

  private determineAttributeName(metadata: Flo.PropertyMetadata): string {
    const nameAttr = `props/${metadata.name}`;
    const idAttr = `props/${metadata.id}`;
    if (this.cell.attr('metadata/group') === 'other') {
      // For something in the other group (like tap) use the id not the name of the property
      return idAttr;
    }
    const valueFromName = this.cell.attr(nameAttr);
    const valueFromId = this.cell.attr(idAttr);
    if (valueFromName === undefined || valueFromName === null && !(valueFromId === undefined || valueFromId === null)) {
      return idAttr;
    } else {
      return nameAttr;
    }
  }

  protected createProperty(metadata: Flo.PropertyMetadata): Properties.Property {
    return {
      id: metadata.id,
      name: metadata.name,
      defaultValue: metadata.defaultValue,
      attr: this.determineAttributeName(metadata),
      value: this.cell.attr(this.determineAttributeName(metadata)),
      description: metadata.description,
      metadata: metadata
    };
  }

  private createNotationalProperties(): Array<Properties.Property> {
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
  selector: 'app-properties-dialog-content',
  templateUrl: 'properties-dialog.component.html',
  styleUrls: [ 'properties-dialog.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class PropertiesDialogComponent implements OnInit {

  public title: string;

  propertiesGroupModel: Properties.PropertiesGroupModel;

  propertiesFormGroup: FormGroup;

  busy: Subscription;

  constructor(private bsModalRef: BsModalRef,
      private streamService: StreamsService
  ) {
    this.propertiesFormGroup = new FormGroup({});
  }

  handleOk() {
    this.propertiesGroupModel.applyChanges();
    this.bsModalRef.hide();
  }

  handleCancel() {
    this.bsModalRef.hide();
  }

  get okDisabled() {
    return !this.propertiesGroupModel
      || !this.propertiesFormGroup
      || this.propertiesFormGroup.invalid
      || !this.propertiesFormGroup.dirty;
  }

  ngOnInit() {
  }

  setData(c: dia.Cell, graph: dia.Graph) {
    const streamHeads = graph.getElements().filter(e => Utils.canBeHeadOfStream(graph, e));
    this.propertiesGroupModel = new PropertiesGroupModel(c, streamHeads,
      (<Array<dia.Cell>>streamHeads).indexOf(c) >= 0, this.streamService);
    this.propertiesGroupModel.load();
  }

}
