import { FormControl, ValidationErrors } from '@angular/forms';
import { KvRichTextValidators } from './kv-rich-text.interface';

/**
 * Validator Kv Rich Text
 * @param keyValidators
 * @param valueValidators
 */
export class KvRichTextValidator {

  /**
   * Validate Line syntax
   * @param value
   */
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

  /**
   * Split into key/value or return null
   *
   * @param value
   */
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

  /**
   * Validate KvRichText
   * @param validators
   */
  static validateKvRichText(validators: KvRichTextValidators) {
    return (c: FormControl) => {
      const errors: Array<any> = KvRichTextValidator.getErrors(c.value, validators)
        .map((line, index) => {
          if (!line.valid) {
            return `Line ${index + 1}: ${line.message}`;
          }
          return null;
        }).filter((ob) => !!ob);
      const err = {
        syntaxError: {
          given: c.value,
          errors: errors
        }
      };
      return errors.length > 0 ? err : null;
    };
  }

  /**
   * Validate a content
   *
   * @param value
   * @param validators
   */
  static getErrors(value: string, validators: KvRichTextValidators): Array<any> {
    if (value.toString() === '') {
      return [];
    }
    return (value.toString() || ' ')
      .split('\n')
      .map((line: string, index: number) => {
        const lineClean = line.replace(' ', '');
        let messages = [KvRichTextValidator.validateSyntax(lineClean)];
        const obj = KvRichTextValidator.splitValue(lineClean);
        if (obj) {
          messages = messages.concat(validators.key
            .map((validator: Function): string => {
              const formControl = new FormControl(obj.key);
              const errors: ValidationErrors = validator.apply(null, [formControl]);
              if (errors) {
                return Object.keys(errors).map((key: string): string => {
                  return errors[key] as string;
                }).join(', ');
              }
              return null;
            }));
          messages = messages.concat(validators.value
            .map((validator: Function): string => {
              const formControl = new FormControl(obj.value);
              const errors: ValidationErrors = validator.apply(null, [formControl]);
              if (errors) {
                return Object.keys(errors).map((key: string): string => {
                  return errors[key] as string;
                }).join(', ');
              }
              return null;
            }));
        }
        const message = messages
          .filter((mess) => !!mess)
          .join('\n');

        return {
          label: (index + 1),
          valid: (message === ''),
          message: message
        };
      });
  }

}
