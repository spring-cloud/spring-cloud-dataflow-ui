import { FormControl, ValidationErrors } from '@angular/forms';
import { KeyValueValidators } from './key-value.interface';

export class KeyValueValidator {

  public static validateSyntax(value: string) {
    value = (value || '').trim();
    if (value === '') {
      return null;
    }
    const tmp = value.split(/=(.*)/);
    if (tmp.length !== 3) {
      return 'Invalid key/value property';
    }
    return null;
  }

  public static splitValue(value: string): any {
    value = (value || '').trim();
    if (value === '') {
      return null;
    }
    const tmp = value.split(/=(.*)/);
    if (tmp.length !== 3) {
      return null;
    }
    return {
      key: tmp[0],
      value: tmp[1]
    };
  }

  static validateKeyValue(validators: KeyValueValidators) {
    return (c: FormControl) => {
      const errors: Array<any> = KeyValueValidator.getErrors(c.value, validators)
        .map((line, index) => {
          if (!line.valid) {
            return `Line ${index + 1}: ${line.message}`;
          }
          return null;
        }).filter((ob) => !!ob);
      const err = {
        syntaxError: {
          given: c.value,
          errors
        }
      };
      return errors.length > 0 ? err : null;
    };
  }

  static getErrors(value: string, validators: KeyValueValidators): Array<any> {
    if (value.trim().toString() === '') {
      return [];
    }
    return (value.toString() || ' ')
      .split('\n')
      .map((line: string, index: number) => {
        const lineClean = line.replace(' ', '');
        if (!lineClean) {
          return {
            label: (index + 1),
            valid: true,
            message: ''
          };
        }
        let obj = KeyValueValidator.splitValue(lineClean);
        if (!obj) {
          obj = {
            key: '',
            value: ''
          };
        }
        const messages = [
          KeyValueValidator.validateSyntax(lineClean),
          ...validators.key
            .map((validator: Function): string => {
              const formControl = new FormControl(obj.key || null);
              const errors: ValidationErrors = validator.apply(null, [formControl]);
              if (errors) {
                return Object.keys(errors).map((key: string): string => {
                  return errors[key] as string;
                }).join(', ');
              }
              return null;
            }),
          ...validators.value
            .map((validator: Function): string => {
              const formControl = new FormControl(obj.value || null);
              const errors: ValidationErrors = validator.apply(null, [formControl]);
              if (errors) {
                return Object.keys(errors).map((key: string): string => {
                  return errors[key] as string;
                }).join(', ');
              }
              return null;
            })
        ];
        const message = messages
          .filter((mess) => mess !== null)
          .join('\n');

        return {
          label: (index + 1),
          valid: (message === ''),
          message
        };
      });
  }

}
