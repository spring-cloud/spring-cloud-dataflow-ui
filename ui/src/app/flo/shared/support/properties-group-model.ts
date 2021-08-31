import {Properties} from 'spring-flo';
import {AbstractControl, ValidationErrors, Validators} from '@angular/forms';
import {Utils} from './utils';
import {AppUiProperty} from './app-ui-property';

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
          const options = (property.hints.valueHints as Array<any>)
            .filter(o => o.value.length > 0)
            .map(o => ({
              name: o.value,
              value: o.value === property.defaultValue ? undefined : o.value
            }));
          const optValues = options.map(o => o.value);
          return new Properties.SelectControlModel(
            property,
            Properties.InputType.SELECT,
            options,
            {
              validator: (control: AbstractControl): ValidationErrors | null => {
                if (optValues.includes(control.value ? control.value : property.defaultValue)) {
                  return null;
                } else {
                  return {
                    error: 'No valid value set'
                  };
                }
              },
              errorData: [{id: 'select', message: 'Value must be set!'}]
            }
          );
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
              return new Properties.CodeControlModelWithDynamicLanguageProperty(
                property,
                property.code.langPropertyName,
                this,
                Utils.encodeTextToDSL,
                Utils.decodeTextFromDSL
              );
            } else {
              return new Properties.GenericCodeControlModel(
                property,
                property.code.language,
                Utils.encodeTextToDSL,
                Utils.decodeTextFromDSL
              );
            }
          } else if (Array.isArray(property.valueOptions)) {
            return new Properties.SelectControlModel(
              property,
              Properties.InputType.SELECT,
              (property.valueOptions as Array<string>)
                .filter(o => o.length > 0)
                .map(o => ({
                  name: o.charAt(0).toUpperCase() + o.substr(1).toLowerCase(),
                  value: o === property.defaultValue ? undefined : o
                })),
              {
                validator: (control: AbstractControl): ValidationErrors | null => {
                  if (property.valueOptions.includes(control.value ? control.value : property.defaultValue)) {
                    return null;
                  } else {
                    return {
                      error: 'No valid value set'
                    };
                  }
                },
                // validator: Validators.email,
                errorData: [{id: 'select', message: 'Value must be set!'}]
              }
            );
          } else if (property.name === 'password') {
            inputType = Properties.InputType.PASSWORD;
          } else if (property.name === 'e-mail' || property.name === 'email') {
            inputType = Properties.InputType.EMAIL;
            validation = {
              validator: Validators.email,
              errorData: [{id: 'email', message: 'Invalid E-Mail value!'}]
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

  accept(property: Properties.Property): boolean {
    if (!this.textFilter) {
      return true;
    }
    const str: string = property.name.toLowerCase();
    const q: string = this.textFilter.toLowerCase();
    return str.indexOf(q) > -1;
  }
}
