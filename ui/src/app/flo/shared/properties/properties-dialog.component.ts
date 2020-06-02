import { Component, ViewEncapsulation, OnInit, Input, AfterViewInit, ViewContainerRef, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { PropertiesGroupModel, SearchTextFilter } from '../support/properties-group-model';
import { debounceTime } from 'rxjs/operators';
import { App, ApplicationType } from '../../../shared/model/app.model';
import { GraphNodePropertiesSource } from '../support/graph-node-properties-source';
import { Properties } from 'spring-flo';
import PropertiesSource = Properties.PropertiesSource;
import { DOCUMENT } from '@angular/common';

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

  @Input() body = false;

  _open = false;

  app: App;

  propertiesGroupModel: PropertiesGroupModel;

  propertiesFormGroup: FormGroup;

  showProperties = false;

  private _searchFilterText = '';

  private _searchFilterTextSubject;

  propertiesFilter = new SearchTextFilter();

  constructor(@Inject(DOCUMENT) private document: Document, private viewContainerRef: ViewContainerRef) {
    this.propertiesFormGroup = new FormGroup({});
    this._searchFilterTextSubject = new Subject<string>();
  }

  handleOk() {
    this.propertiesGroupModel.applyChanges();
    this.isOpen = false;
    this.app = null;
    this.propertiesGroupModel = null;
  }

  handleCancel() {
    // this.bsModalRef.hide();
    this.isOpen = false;
  }

  get okDisabled() {
    return !this.propertiesGroupModel
      || !this.propertiesFormGroup
      || this.propertiesFormGroup.invalid
      || !this.propertiesFormGroup.dirty;
  }

  ngOnInit() {
    this._searchFilterTextSubject
      .pipe(debounceTime(500))
      .subscribe(text => this.propertiesFilter.textFilter = text);
  }

  open(name: string, type: string, version: string, propertiesSource: GraphNodePropertiesSource) {
    this.app = new App();
    this.app.name = name;
    this.app.type = (type as any) as ApplicationType;
    this.app.version = version;
    this.setData(propertiesSource);
    this.isOpen = true;
  }

  setData(propertiesSource: PropertiesSource) {
    this.propertiesGroupModel = new PropertiesGroupModel(propertiesSource);
    this.propertiesGroupModel.load();
    this.propertiesGroupModel.loadedSubject.subscribe();
  }

  get searchFilterText() {
    return this._searchFilterText;
  }

  set searchFilterText(text: string) {
    this._searchFilterText = text;
    this._searchFilterTextSubject.next(text);
  }

  set isOpen(open: boolean) {
    if (this._open !== open) {
      this._open = open;
      if (open) {
        if (this.body) {
          this.document.body.appendChild(this.viewContainerRef.element.nativeElement);
        }
      } else {
        if (this.body) {
          this.document.body.removeChild(this.viewContainerRef.element.nativeElement);
        }
      }
    }
  }

  get isOpen() {
    return this._open;
  }

}
