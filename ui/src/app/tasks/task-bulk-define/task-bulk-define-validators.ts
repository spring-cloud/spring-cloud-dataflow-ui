import { FormControl } from '@angular/forms';

export function validateBulkTaskDefinitions(formControl: FormControl) {
  let validCount = 0;
  let invalidCount = 0;
  for (const def of formControl.value.split('\n')) {
    if (def.length > 0 && !def.startsWith('#')) {
      if (def.length > 2) {
        const keyValue = def.split('=');
        if (keyValue.length === 2) {
          validCount++;
        }
        else {
          invalidCount++;
        }
      }
      else {
        invalidCount++;
      }
    }
  }
  if (validCount > 0 && invalidCount === 0) {
    return null;
  }
  else if (invalidCount === 0) {
    return {validateBulkTaskDefinitions: {reason: 'no definitions detected'}};
  }
  else {
    return {validateBulkTaskDefinitions: {reason: invalidCount + ' invalid definitions detected'}};
  }
}
