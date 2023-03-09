import {Component, ViewEncapsulation, OnInit, EventEmitter} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';
import {of} from 'rxjs';
import {Properties} from 'spring-flo';
import {PropertiesGroupModel, SearchTextFilter} from '../support/properties-group-model';
import PropertiesSource = Properties.PropertiesSource;
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

/**
 * Class to add group titleModal to a model.
 */
export class GroupPropertiesGroupModel extends PropertiesGroupModel {
  constructor(propertiesSource: PropertiesSource, public title: string = '') {
    super(propertiesSource);
  }
}

/**
 * Class to implement PropertiesSource and to have needed features
 * to support multiple sources.
 */
export class GroupPropertiesSource implements PropertiesSource {
  private options: Array<any>;

  constructor(options: Array<any>, public title: string = '') {
    this.options = options;
  }

  getProperties(): Promise<Properties.Property[]> {
    return of(this.options).toPromise();
  }

  applyChanges(properties: Properties.Property[]): void {
    // nothing to do as we don't rely calling applyChanges() for model
    // classes because we have multiple groups so controls and its
    // properties are accesses manually.
  }
}

/**
 * Class to keep GroupPropertiesSource in one place and to have
 * emitter to notify user of a new property changes.
 */
export class GroupPropertiesSources {
  public confirm = new EventEmitter();

  constructor(public propertiesSources: Array<GroupPropertiesSource>) {}

  applyChanges(properties: Properties.Property[]): void {
    this.confirm.emit(properties);
  }
}

/**
 * Component for displaying generic properties and capturing their values.
 *
 * @author Janne Valkealahti
 */
@Component({
  selector: 'app-properties-groups-dialog-content',
  templateUrl: 'properties-groups-dialog.component.html',
  styleUrls: ['./properties-groups-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PropertiesGroupsDialogComponent implements OnInit {
  isOpen = false;

  /**
   * Dialog titleModal.
   */
  title: string;

  /**
   * Groups are eventually added here and accessed from a template.
   */
  propertiesGroupModels: Array<GroupPropertiesGroupModel> = [];

  /**
   * Template will eventually add controls to this group.
   */
  propertiesFormGroup: UntypedFormGroup;

  private groupPropertiesSources: GroupPropertiesSources;

  private _searchFilterText = '';

  private _searchFilterTextSubject;

  propertiesFilter = new SearchTextFilter();

  /**
   * Collapse states for groups are kept here.
   * i.e. {my.group1: true, my.group2: false}
   */
  state: any = {};

  constructor() {
    this.propertiesFormGroup = new UntypedFormGroup({});
    this._searchFilterTextSubject = new Subject<string>();
  }

  handleOk(): void {
    const properties: Properties.Property[] = [];
    this.propertiesGroupModels.forEach(p => {
      p.getControlsModels().forEach(cm => {
        properties.push(cm.property);
      });
    });
    this.groupPropertiesSources.applyChanges(properties);
    this.handleCancel();
  }

  handleCancel(): void {
    this.propertiesGroupModels = [];
    this.isOpen = false;
  }

  openGroup(id: string): void {
    Object.entries(this.state).forEach(e => (this.state[e[0]] = e[0] === id));
  }

  collapse(id: string): void {
    // Collapse already open group, otherwise keep selected
    // group open and close others.
    Object.entries(this.state).forEach(e => {
      if (e[0] === id && e[1]) {
        this.state[e[0]] = false;
      } else {
        this.state[e[0]] = e[0] === id;
      }
    });
  }

  controlModelsToDisplay(propertiesGroupModel: GroupPropertiesGroupModel): Properties.ControlModel<any>[] {
    return propertiesGroupModel
      .getControlsModels()
      .filter(c => !this.propertiesFilter || this.propertiesFilter.accept(c.property));
  }

  setDisplayGroup(): void {
    if (this.propertiesGroupModels) {
      for (let i = 0; i < this.propertiesGroupModels.length; i++) {
        const group = this.propertiesGroupModels[i];
        if (this.controlModelsToDisplay(group).length > 0) {
          this.openGroup(group.title);
          return;
        }
      }
    }
  }

  get okDisabled(): boolean {
    return (
      !(this.propertiesGroupModels.length > 0) ||
      !this.propertiesFormGroup ||
      this.propertiesFormGroup.invalid ||
      !this.propertiesFormGroup.dirty
    );
  }

  ngOnInit(): void {
    this._searchFilterTextSubject.subscribe((text: string) => {
      this.propertiesFilter.textFilter = text;
    });
  }

  setData(groupPropertiesSources: GroupPropertiesSources): void {
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
    this.setDisplayGroup();
  }
}
