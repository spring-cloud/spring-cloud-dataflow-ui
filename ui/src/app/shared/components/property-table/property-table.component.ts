import { Component, Input, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Selectable } from '../../model/selectable';

@Component({
  selector: 'app-property-table',
  templateUrl: './property-table.component.html'
})
export class PropertyTableComponent {

  @Input() id: string;
  @Input() titleText: string;
  @Input() emptyText: string;
  @Input() addText: string;

  @ViewChild('childModal')
  public childModal: ModalDirective;

  private properties: Array<PropertyTableItem>;
  singleForm: FormGroup;
  bulkForm: FormGroup;
  bulkProperties = new FormControl('', validateProperties);
  singlePropertyKey = new FormControl('', validateKeyOrValue);
  singlePropertyValue = new FormControl('', validateKeyOrValue);

  constructor(fb: FormBuilder) {
    this.properties = new Array();
    this.singleForm = fb.group({
      'singlePropertyKey': this.singlePropertyKey,
      'singlePropertyValue': this.singlePropertyValue
    });
    this.bulkForm = fb.group({
      'bulkProperties': this.bulkProperties
    });
  }

  getProperties(): Array<PropertyTableItem> {
    return this.properties;
  }

  getPropertiesAsObservable(): Observable<Array<PropertyTableItem>> {
    return Observable.of(this.properties);
  }

  removeSelectedItems() {
    this.properties = this.properties.filter(item => !item.isSelected);
  }

  addProperty() {
    this.showChildModal();
  }

  public showChildModal(): void {
    this.childModal.show();
  }

  public hideChildModal(): void {
    this.childModal.hide();
  }

  cancel(): void {
    this.hideChildModal();
    this.clear();
  }

  clear(): void {
    this.singlePropertyKey.setValue('');
    this.singlePropertyValue.setValue('');
    this.bulkProperties.setValue('');
  }

  submitBulkProperties(): void {
    if (this.bulkProperties.value) {
      for (const prop of this.bulkProperties.value.split('\n')) {
        if (prop && prop.length > 0 && !prop.startsWith('#')) {
          const keyValue = prop.split('=');
          if (keyValue.length === 2) {
            this.properties.push(new PropertyTableItem(keyValue[0], keyValue[1]));
          }
        }
      }
    }
    this.cancel();
  }

  submitSingleProperty(): void {
    this.properties.push(new PropertyTableItem(this.singlePropertyKey.value, this.singlePropertyValue.value));
    this.cancel();
  }

  displayFileContents(event: any) {
    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();
    const _form = this.bulkForm;
    reader.onloadend = function(e){
      _form.patchValue({bulkProperties: reader.result});
    }
    reader.readAsText(file);
  }
}

export class PropertyTableItem implements Selectable {

  key: string;
  value: string;
  isSelected = false;

  constructor(key: string, value: string) {
    this.key = key;
    this.value = value;
  }
}

function validateProperties(formControl: FormControl) {
  const properties = formControl.value.split('\n');

  if (properties) {
    for (const prop of properties) {
      if (prop && prop.length > 0 && !prop.startsWith('#')) {
        const keyValue = prop.split('=');
        if (keyValue.length !== 2) {
          return {validateProperties: {reason: '"' + prop + '" must contain a single "=".' }};
        }
      }
    }
  }
  return null;
}

function validateKeyOrValue(formControl: FormControl) {
  if (formControl.value.length > 0) {
    return null;
  }
  else {
    return {validateKeyOrValue: {reason: 'Cannot be empty'}};
  }
}
