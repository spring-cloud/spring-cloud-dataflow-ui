import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { PropertiesGroupModel, SearchTextFilter } from '../support/properties-group-model';
import { Properties } from 'spring-flo';
import PropertiesSource = Properties.PropertiesSource;
import { debounceTime } from 'rxjs/operators';

/**
 * Component for displaying application properties and capturing their values.
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
@Component({
  selector: 'app-properties-dialog-content',
  templateUrl: 'properties-dialog.component.html',
  styleUrls: ['properties-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PropertiesDialogComponent implements OnInit {

  public name: string;

  public version: string;

  public type: string;

  propertiesGroupModel: PropertiesGroupModel;

  propertiesFormGroup: FormGroup;

  showProperties = false;

  private _searchFilterText = '';

  private _searchFilterTextSubject;

  propertiesFilter = new SearchTextFilter();

  constructor(private bsModalRef: BsModalRef
  ) {
    this.propertiesFormGroup = new FormGroup({});
    this._searchFilterTextSubject = new Subject<string>();
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
    this._searchFilterTextSubject.pipe(debounceTime(500)).subscribe(text => this.propertiesFilter.textFilter = text);
  }

  setData(propertiesSource: PropertiesSource) {
    this.propertiesGroupModel = new PropertiesGroupModel(propertiesSource);
    this.propertiesGroupModel.load();
    this.propertiesGroupModel.loadedSubject.subscribe();
  }

  /**
   * Define label and css class
   */
  getTypeClass() {
    switch (this.type) {
      case 'APP':
        return 'app';
      case 'TASK':
        return 'danger';
      case 'SINK':
        return 'warning';
      case 'PROCESSOR':
        return 'success';
      default:
      case 'SOURCE':
        return 'info';
    }
  }

  get searchFilterText() {
    return this._searchFilterText;
  }

  set searchFilterText(text: string) {
    this._searchFilterText = text;
    this._searchFilterTextSubject.next(text);
  }

}
