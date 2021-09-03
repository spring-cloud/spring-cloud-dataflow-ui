/* eslint-disable */
import {Component, HostListener, OnInit, ViewEncapsulation} from '@angular/core';
import {Properties} from 'spring-flo';
import {Validators} from '@angular/forms';
import PropertiesSource = Properties.PropertiesSource;
import {AppUiProperty} from '../../shared/support/app-ui-property';
import {PropertiesDialogComponent} from '../../shared/properties/properties-dialog.component';
import {PropertiesGroupModel, SearchTextFilter} from '../../shared/support/properties-group-model';
import {APP_PROPERTIES_KIND} from './task-properties-source';

/**
 * Utility class for working with Properties.
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
class TaskPropertiesGroupModel extends PropertiesGroupModel {
  protected createControlModel(property: AppUiProperty): Properties.ControlModel<any> {
    const inputType = Properties.InputType.TEXT;
    let validation: Properties.Validation;
    if (property.isSemantic) {
      return super.createControlModel(property);
    } else {
      // Notational properties
      if (property.id === 'label') {
        validation = {
          validator: Validators.pattern(/^[\w_]+[\w_-]*$/),
          errorData: [{id: 'pattern', message: 'Invalid app label!'}]
        };
      }
    }
    return new Properties.GenericControlModel(property, inputType, validation);
  }
}

export class FunctionTextFilter extends SearchTextFilter {
  filterFunc: (property: Properties.Property) => boolean;

  accept(property: Properties.Property): boolean {
    let result = true;

    if (this.filterFunc) {
      result = this.filterFunc(property);
    }

    if (result && this.textFilter) {
      const str: string = property.name.toLowerCase();
      const q: string = this.textFilter.toLowerCase();
      result = str.indexOf(q) > -1;
    }

    return result;
  }
}

/**
 * Component for displaying application properties and capturing their values.
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
@Component({
  selector: 'app-task-properties-dialog-content',
  templateUrl: './task-properties-dialog.component.html',
  styleUrls: ['../../shared/properties/properties-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskPropertiesDialogComponent extends PropertiesDialogComponent implements OnInit {
  paneSelected = APP_PROPERTIES_KIND;
  public title: string;
  heightModal;

  statusError = {
    writers: false,
    readers: false
  };

  constructor() {
    super();
    this.propertiesFilter = new FunctionTextFilter();
    (this.propertiesFilter as FunctionTextFilter).filterFunc = this.propertyFilter(this.paneSelected);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.heightModal = `${document.documentElement.clientHeight - 350}px`;

    this.propertiesFormGroup.valueChanges.subscribe(() => {
      this.statusError.writers = this.isPaneError('writers');
      this.statusError.readers = this.isPaneError('readers');
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.heightModal = `${document.documentElement.clientHeight - 350}px`;
  }

  setData(propertiesSource: PropertiesSource) {
    this.propertiesGroupModel = new TaskPropertiesGroupModel(propertiesSource);
    this.propertiesGroupModel.load();
  }

  changePane(pane: string): void {
    this.searchFilterText = '';
    this.paneSelected = pane;
    (this.propertiesFilter as FunctionTextFilter).filterFunc = this.propertyFilter(pane);
  }

  isPaneError(pane: string): boolean {
    if (!this.propertiesGroupModel) {
      return false;
    }
    const props = this.propertiesGroupModel.getControlsModels()?.filter(model => {
      return model.property.kind === pane;
    });
    if (!props || props.length === 0) {
      return false;
    }
    return (
      props?.filter(prop => {
        return this.propertiesFormGroup.controls[prop.property.id]?.errors !== null;
      }).length > 0
    );
  }

  propertyFilter(kind?: string): (property: Properties.Property) => boolean {
    return property => kind === property.kind;
  }
}
