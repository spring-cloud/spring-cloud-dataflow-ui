import { Properties } from 'spring-flo';
import { Validators } from '@angular/forms';
import { Utils } from './utils';
import { AppUiProperty } from './app-ui-property';

/**
 * Utility class for working with Properties.
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
export class PropertiesGroupModel extends Properties.PropertiesGroupModel {

  protected createControlModel(property: AppUiProperty): Properties.ControlModel<any> {
    let inputType = Properties.InputType.TEXT;
    let validation: Properties.Validation;
    if (property.isSemantic) {

      // valueHints mean we have a set of possible values, see if we can use those
      if (property.hints && property.hints.valueHints) {

        // array and we have hints, assume we can now use selector
        if (Array.isArray(property.hints.valueHints) && property.hints.valueHints.length > 0) {
          return new Properties.SelectControlModel(property,
            Properties.InputType.SELECT, (<Array<any>> property.hints.valueHints)
              .filter(o => o.value.length > 0)
              .map(o => {
                return {
                  name: o.value,
                  value: o.value === property.defaultValue ? undefined : o.value
                };
              }));
        }
      }

      // then try to use type
      switch (property.type) {
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
          if (property.code) {
            if (property.code.langPropertyName) {
              return new Properties.CodeControlModelWithDynamicLanguageProperty(property,
                property.code.langPropertyName, this, Utils.encodeTextToDSL, Utils.decodeTextFromDSL);
            } else {
              return new Properties.GenericCodeControlModel(property, property.code.language,
                Utils.encodeTextToDSL, Utils.decodeTextFromDSL);
            }
          } else if (Array.isArray(property.valueOptions)) {
            return new Properties.SelectControlModel(property,
              Properties.InputType.SELECT, (<Array<string>> property.valueOptions).filter(o => o.length > 0).map(o => {
                return {
                  name: o.charAt(0).toUpperCase() + o.substr(1).toLowerCase(),
                  value: o === property.defaultValue ? undefined : o
                };
              }));
          } else if (property.name === 'password') {
            inputType = Properties.InputType.PASSWORD;
          } else if (property.name === 'e-mail' || property.name === 'email') {
            inputType = Properties.InputType.EMAIL;
            validation = {
              validator: Validators.email,
              errorData: [
                {id: 'email', message: 'Invalid E-Mail value!'}
              ]
            };
          } else if (property.type && property.type.lastIndexOf('[]') === property.type.length - 2) {
            return new Properties.GenericListControlModel(property);
          }
      }
    }

    // fall back to generic
    return new Properties.GenericControlModel(property, inputType, validation);
  }

}

export class SearchTextFilter implements Properties.PropertyFilter {
  textFilter = '';

  accept(property: Properties.Property) {
    return !this.textFilter || property.name.startsWith(this.textFilter);
  }
}

