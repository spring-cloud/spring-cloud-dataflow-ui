import { Component, Input, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Selectable } from '../../model/selectable';


/**
 * Class which is used in property table component as table item.
 *
 * @author Janne Valkealahti
 * @author Glenn Renfro
 */
export class PropertyTableItem implements Selectable {

  key: string;
  value: string;
  isSelected = false;

  constructor(key: string, value: string) {
    this.key = key;
    this.value = value;
  }
}

/**
 * Component representing key/values in a table
 * and have functionality to import those as
 * single or bulk modes.
 *
 * @author Janne Valkealahti
 */
@Component({
  selector: 'app-property-table',
  templateUrl: './property-table.component.html'
})
export class PropertyTableComponent {

  /**
   * The id for the component instance.
   */
  @Input() id: string;

  /**
   * The title that will be show for the component.
   */
  @Input() titleText: string;

  /**
   * The text that will be shown if properties list is empty instead of an empty table.
   */
  @Input() emptyText: string;

  /**
   * The text that will should be shown in the add button.
   */
  @Input() addText: string;

  @ViewChild('childModal')
  public childModal: ModalDirective;

  /**
   * An Array containing the PropertyTableItems.
   */
  private properties: Array<PropertyTableItem>;

  /**
   * The FormGroup used to capture single properties from the singlePropertyKey and singlePropertyValue FormControls.
   */
  singleForm: FormGroup;

  /**
   * The FormGroup used to capture bulk properties from a FormControl.
   */
  bulkForm: FormGroup;

  /**
   * The FormControl used to capture bulk properties entered into a text area.
   * @type {FormControl}
   */
  bulkProperties = new FormControl('', validateProperties);

  /**
   * The FormControl used to capture the file name containing the bulk properties.
   * @type {FormControl}
   */
  bulkFile  = new FormControl('');

  /**
   * The FormControl used to capture the singlePropertyKey.
   * @type {FormControl}
   */
  singlePropertyKey = new FormControl('', validateKeyOrValue);

  /**
   * The FormControl used to capture the singlePropertyValue.
   * @type {FormControl}
   */
  singlePropertyValue = new FormControl('', validateKeyOrValue);

  constructor(fb: FormBuilder) {
    this.properties = new Array();
    this.singleForm = fb.group({
      'singlePropertyKey': this.singlePropertyKey,
      'singlePropertyValue': this.singlePropertyValue
    });
    this.bulkForm = fb.group({
      'bulkProperties': this.bulkProperties,
      'bulkFile': this.bulkFile
    });
  }

  /**
   * Retrieves the array containing the properties entered into the property table.
   * @returns {Array<PropertyTableItem>} Array containing {@link PropertyTableItem}s.
   */
  getProperties(): Array<PropertyTableItem> {
    return this.properties;
  }

  getPropertiesAsObservable(): Observable<Array<PropertyTableItem>> {
    return Observable.of(this.properties);
  }

  /**
   * Removes items selected in properties table from properties list.
   */
  removeSelectedItems() {
    this.properties = this.properties.filter(item => !item.isSelected);
  }

  /**
   * Shows the properties child modal page.
   */
  addProperty() {
    this.showChildModal();
  }

  /**
   * Shows the properties child modal page.
   */
  showChildModal(): void {
    this.childModal.show();
  }

  /**
   * Hides the properties child modal page.
   */
  hideChildModal(): void {
    this.childModal.hide();
  }

  /**
   * Hides the properties modal page and clears the contents of the page.
   */
  cancel(): void {
    this.hideChildModal();
    this.clear();
  }

  /**
   * Resets the single key/value property value, bulk properties and bulk properties file name/path to empty strings.
   */
  clear(): void {
    this.singlePropertyKey.setValue('');
    this.singlePropertyValue.setValue('');
    this.bulkProperties.setValue('');
    this.bulkFile.setValue('');
  }

  /**
   * Parses the bulk properties and inserts them in to the properties array.  Then closes the modal page.
   */
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
  /**
   * Adds the single property and inserts it in to the properties array.  Then closes the modal page.
   */
  submitSingleProperty(): void {
    this.properties.push(new PropertyTableItem(this.singlePropertyKey.value, this.singlePropertyValue.value));
    this.cancel();
  }

  /**
   * Reads the text from the file selected by the user and places the result in the bulkProperties.
   * @param event the event that signifies that a file must be read.
   */
  displayFileContents(event: any) {
    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();
    const _form = this.bulkForm;
    reader.onloadend = function(e) {
      _form.patchValue({bulkProperties: reader.result});
    };
    reader.readAsText(file);
  }
}

/**
 * Validates the properties that are enumerated in in the bulk properties form.
 * @param formControl the form that contains the bulk properties text box.
 * @returns {any} null if successful or the validateProperties message if a failure.
 */
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

/**
 * Validates the single property form.
 * @param formControl the form that contains the single properties key/value text boxes.
 * @returns {any} null if successful or the validateProperties message if a failure.
 */
function validateKeyOrValue(formControl: FormControl) {
  if (formControl.value.length > 0) {
    return null;
  } else {
    return {validateKeyOrValue: {reason: 'Cannot be empty'}};
  }
}
