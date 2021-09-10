import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {PropertiesGroupModel, SearchTextFilter} from '../support/properties-group-model';
import {App, ApplicationType} from '../../../shared/model/app.model';
import {ModalDialog} from '../../../shared/service/modal.service';
import {Properties} from 'spring-flo';
import PropertiesSource = Properties.PropertiesSource;

interface ControlModelCollapsableSection {
  title: string;
  controlsModel: ProxyControlGroupModel;
  expanded: boolean;
}

class ProxyControlGroupModel extends Properties.PropertiesGroupModel {

  constructor(controlModels: Properties.ControlModel<any>[]) {
    super(undefined);
    this.loading = false;
    this.controlModels = controlModels;
  }

  load() {
    this._loadedSubject.next(true);
    this._loadedSubject.complete();
  }
}

/**
 * Component for displaying application properties and capturing their values.
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
@Component({
  selector: 'app-properties-dialog-content',
  templateUrl: './properties-dialog.component.html',
  styleUrls: ['properties-dialog.component.scss', '../properties-groups/properties-groups-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PropertiesDialogComponent extends ModalDialog implements OnInit {
  app: App;

  propertiesGroupModel: PropertiesGroupModel;

  controlGroups: ControlModelCollapsableSection[] = [];

  propertiesFormGroup: FormGroup;

  showProperties = false;

  private _searchFilterText = '';

  private _searchFilterTextSubject;

  propertiesFilter = new SearchTextFilter();

  state: any = {};

  constructor() {
    super();
    this.propertiesFormGroup = new FormGroup({});
    this._searchFilterTextSubject = new Subject<string>();
  }

  handleOk(): void {
    this.propertiesGroupModel.applyChanges();
    this.handleCancel();
  }

  handleCancel(): void {
    this.isOpen = false;
    this.app = null;
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
    this.propertiesGroupModel.loadedSubject.subscribe(() => {
      this.setGroupedProperties();
    });
  }

  setGroupedProperties(): void {
    this.controlGroups = [];
    const options = this.propertiesGroupModel.getControlsModels().map(item => {
      return item.property;
    });
    const deduceKey = key => key.substring(0, key.lastIndexOf('.'));
    const groupBy = (items, key) =>
      items.reduce((result, item) => {
        const groupKey = deduceKey(item.property[key]);
        return {
          ...result,
          [groupKey]: [...(result[groupKey] || []), item]
        };
      }, {});
    const groupedEntries: {[s: string]: Array<any>} = groupBy(this.propertiesGroupModel.getControlsModels(), 'id');
    this.controlGroups = Object.keys(groupedEntries).map(title => ({
      title,
      controlsModel: new ProxyControlGroupModel(groupedEntries[title]),
      expanded: false
    }));
    if (this.controlGroups.length > 0) {
      this.controlGroups[0].expanded = true;
    }
  }

  controlModelsToDisplay(propertiesGroupModel: ControlModelCollapsableSection): Properties.ControlModel<any>[] {
    return propertiesGroupModel.controlsModel.getControlsModels()
      .filter(c => !this.propertiesFilter || this.propertiesFilter.accept(c.property));
  }

  get searchFilterText(): string {
    return this._searchFilterText;
  }

  set searchFilterText(text: string) {
    this._searchFilterText = text;
    this._searchFilterTextSubject.next(text);
    this.setDisplayGroup();
  }

  setDisplayGroup(): void {
    if (this.controlGroups) {
      for (let i = 0; i < this.controlGroups.length; i++) {
        const group = this.controlGroups[i];
        if (this.controlModelsToDisplay(group).length > 0) {
          group.expanded = true;
          return;
        }
      }
    }
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

  openGroup(id: string): void {
    this.controlGroups.filter(g => g.title === id).forEach(g => g.expanded = true);
  }

  toggleExpand(g: ControlModelCollapsableSection): void {
    g.expanded = !g.expanded;
  }
}
