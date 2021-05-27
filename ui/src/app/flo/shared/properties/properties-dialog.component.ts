import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {PropertiesGroupModel, SearchTextFilter} from '../support/properties-group-model';
import {debounceTime} from 'rxjs/operators';
import {App, ApplicationType} from '../../../shared/model/app.model';
import {ModalDialog} from '../../../shared/service/modal.service';
import {Properties} from 'spring-flo';
import PropertiesSource = Properties.PropertiesSource;

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
export class PropertiesDialogComponent extends ModalDialog implements OnInit {
  app: App;

  propertiesGroupModel: PropertiesGroupModel;

  propertiesFormGroup: FormGroup;

  showProperties = false;

  private _searchFilterText = '';

  private _searchFilterTextSubject;

  propertiesFilter = new SearchTextFilter();

  constructor() {
    super();
    this.propertiesFormGroup = new FormGroup({});
    this._searchFilterTextSubject = new Subject<string>();
  }

  handleOk(): void {
    this.propertiesGroupModel.applyChanges();
    this.isOpen = false;
    this.app = null;
    this.propertiesGroupModel = null;
  }

  handleCancel(): void {
    this.isOpen = false;
  }

  get okDisabled(): boolean {
    return (
      !this.propertiesGroupModel ||
      !this.propertiesFormGroup ||
      this.propertiesFormGroup.invalid ||
      !this.propertiesFormGroup.dirty
    );
  }

  ngOnInit(): void {
    this._searchFilterTextSubject.subscribe(text => (this.propertiesFilter.textFilter = text));
  }

  setData(propertiesSource: PropertiesSource): void {
    this.propertiesGroupModel = new PropertiesGroupModel(propertiesSource);
    this.propertiesGroupModel.load();
    this.propertiesGroupModel.loadedSubject.subscribe();
  }

  get searchFilterText(): string {
    return this._searchFilterText;
  }

  set searchFilterText(text: string) {
    this._searchFilterText = text;
    this._searchFilterTextSubject.next(text);
  }

  get typeString(): string {
    if (this.app) {
      if (this.app.type) {
        if (typeof this.app.type === 'string') {
          return <string>this.app.type;
        } else if (ApplicationType[this.app.type]) {
          return ApplicationType[this.app.type].toString();
        }
      }
    }
    return 'UNKNOWN';
  }
}
