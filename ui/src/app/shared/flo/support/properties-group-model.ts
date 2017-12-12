import { Flo, Properties } from 'spring-flo';
import { Validators } from '@angular/forms';
import { dia } from 'jointjs';
import { Utils } from './utils';

/**
 * Utility class for working with Properties.
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
export class PropertiesGroupModel extends Properties.PropertiesGroupModel {

  constructor(cell: dia.Cell) {
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
          return new Properties.CheckBoxControlModel(property);
        default:
          if (property.metadata.code) {
            if (property.metadata.code.langPropertyName) {
              return new Properties.CodeControlModelWithDynamicLanguageProperty(property,
                property.metadata.code.langPropertyName, this, Utils.encodeTextToDSL, Utils.decodeTextFromDSL);
            } else {
              return new Properties.GenericCodeControlModel(property, property.metadata.code.language,
                Utils.encodeTextToDSL, Utils.decodeTextFromDSL);
            }
          } else if (Array.isArray(property.metadata.options)) {
            return new Properties.SelectControlModel(property,
              Properties.InputType.SELECT, (<Array<string>> property.metadata.options).filter(o => o.length > 0).map(o => {
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
    }
    return new Properties.GenericControlModel(property, inputType, validation);
  }

  protected createProperties(): Promise<Array<Properties.Property>> {
    return super.createProperties().then(semanticProperties => {
      const notationalProperties = this.createNotationalProperties();
      return semanticProperties ? notationalProperties.concat(semanticProperties) : notationalProperties;
    });
  }

  protected determineAttributeName(metadata: Flo.PropertyMetadata): string {
    const nameAttr = `props/${metadata.name}`;
    const idAttr = `props/${metadata.id}`;
    const valueFromName = this.cell.attr(nameAttr);
    const valueFromId = this.cell.attr(idAttr);
    if ((valueFromName === undefined || valueFromName === null) && !(valueFromId === undefined || valueFromId === null)) {
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

  protected createNotationalProperties(): Array<Properties.Property> {
    return [];
  }
}
