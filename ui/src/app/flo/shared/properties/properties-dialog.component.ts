import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {PropertiesGroupModel, SearchTextFilter} from '../support/properties-group-model';
import {debounceTime} from 'rxjs/operators';
import {App, ApplicationType} from '../../../shared/model/app.model';
import {ModalDialog} from '../../../shared/service/modal.service';
import {Properties} from 'spring-flo';
import PropertiesSource = Properties.PropertiesSource;
import {
  GroupPropertiesGroupModel,
  GroupPropertiesSource,
  GroupPropertiesSources
} from '../properties-groups/properties-groups-dialog.component';

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

  propertiesGroupModels: Array<GroupPropertiesGroupModel> = [];

  private groupPropertiesSources: GroupPropertiesSources;

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
    const properties: Properties.Property[] = [];
    this.propertiesGroupModels.forEach(p => {
      p.getControlsModels().forEach(cm => {
        properties.push(cm.property);
      });
    });

    properties.forEach(prop => {
      const item = this.propertiesGroupModel.getControlsModels().find(it => it.id === prop.id);
      item.value = prop.value;
    });
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
    this.propertiesGroupModels = [];
    const options = this.propertiesGroupModel.getControlsModels().map(item => {
      return item.property;
    });
    const deduceKey = key => key.substring(0, key.lastIndexOf('.'));
    const groupBy = (items, key) =>
      items.reduce((result, item) => {
        const groupKey = deduceKey(item[key]);
        return {
          ...result,
          [groupKey]: [...(result[groupKey] || []), item]
        };
      }, {});
    let groupedPropertiesSources: Array<GroupPropertiesSource> = [];
    const groupedEntries: {[s: string]: Array<any>} = groupBy(options, 'id');
    Object.entries(groupedEntries).forEach(v => {
      const groupedPropertiesSource = new GroupPropertiesSource(
        Object.assign(
          [],
          v[1].map(property => Object.assign({}, property))
        ),
        v[0]
      );
      groupedPropertiesSources.push(groupedPropertiesSource);
    });
    groupedPropertiesSources = groupedPropertiesSources.sort((a, b) =>
      a.title === b.title ? 0 : a.title < b.title ? -1 : 1
    );
    const groupPropertiesSources = new GroupPropertiesSources(groupedPropertiesSources);
    groupPropertiesSources.confirm.subscribe((properties: Array<any>) => {});
    let first = true;
    groupPropertiesSources.propertiesSources.forEach(ps => {
      this.state[ps.title] = first;
      first = false;
      const model: GroupPropertiesGroupModel = new GroupPropertiesGroupModel(ps, ps.title);
      model.load();
      model.loadedSubject.subscribe();
      this.propertiesGroupModels.push(model);
    });
    this.groupPropertiesSources = groupPropertiesSources;
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

  collapse(id: string): void {
    Object.entries(this.state).forEach(e => {
      if (e[0] === id && e[1]) {
        this.state[e[0]] = false;
      } else {
        this.state[e[0]] = e[0] === id;
      }
    });
  }
}
