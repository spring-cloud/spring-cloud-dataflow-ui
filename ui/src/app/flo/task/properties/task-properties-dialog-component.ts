/* eslint-disable */
import {Component, HostListener, OnInit, ViewEncapsulation, EventEmitter} from '@angular/core';
import {Properties} from 'spring-flo';
import {AbstractControl, ValidationErrors, Validators} from '@angular/forms';
import PropertiesSource = Properties.PropertiesSource;
import {AppUiProperty} from '../../shared/support/app-ui-property';
import {PropertiesDialogComponent} from '../../shared/properties/properties-dialog.component';
import {PropertiesGroupModel, SearchTextFilter} from '../../shared/support/properties-group-model';
import SelectControlModel = Properties.SelectControlModel;
import InputType = Properties.InputType;
import Property = Properties.Property;
import SelectOption = Properties.SelectOption;
import Validation = Properties.Validation;
import {Observable} from 'rxjs';
import {IO_COMMON_PROPERTIES_KIND, READER_PROPERTIES_KIND, WRITER_PROPERTIES_KIND} from './task-properties-source';

class ObservableSelectControlModel extends SelectControlModel {
  private _valueChanges = new EventEmitter<any>();

  constructor(_property: Property, type: InputType, options: SelectOption[], validation?: Validation) {
    super(_property, type, options, validation);
  }

  protected setValue(value: any) {
    super.setValue(value);
    this._valueChanges.next(value);
  }

  get valueChanges(): Observable<any> {
    return this._valueChanges;
  }
}

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
      } else if (property.id === READER_PROPERTIES_KIND || property.id === WRITER_PROPERTIES_KIND) {
        const optValues = property.hints.valueHints.map(o => o.value);
        return new ObservableSelectControlModel(property, Properties.InputType.SELECT, property.hints.valueHints, {
          validator: (control: AbstractControl): ValidationErrors | null => {
            if (optValues.includes(control.value ? control.value : property.defaultValue)) {
              return null;
            } else {
              return {
                error: 'No valid value set'
              };
            }
          },
          errorData: [{id: 'select', message: 'Value must be set!'}]
        });
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
  paneSelected: string | undefined;
  public title: string;
  heightModal;

  hasWriterReader = false;
  readerControlModel: ObservableSelectControlModel;
  writerControlModel: ObservableSelectControlModel;

  statusError = {
    writers: false,
    readers: false
  };

  constructor() {
    super();
    this.propertiesFilter = new FunctionTextFilter();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.heightModal = `${document.documentElement.clientHeight - 350}px`;

    this.propertiesFormGroup.valueChanges.subscribe(() => {
      this.statusError.writers = this.isPaneError(WRITER_PROPERTIES_KIND);
      this.statusError.readers = this.isPaneError(READER_PROPERTIES_KIND);
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.heightModal = `${document.documentElement.clientHeight - 350}px`;
  }

  setData(propertiesSource: PropertiesSource) {
    this.propertiesGroupModel = new TaskPropertiesGroupModel(propertiesSource);
    this.propertiesGroupModel.load();
    const subscription = this.propertiesGroupModel.loadedSubject.subscribe(() => {
      subscription.unsubscribe();
      for (
        let i = 0;
        i < this.propertiesGroupModel.getControlsModels().length &&
        !(this.readerControlModel && this.writerControlModel);
        i++
      ) {
        const cm = this.propertiesGroupModel.getControlsModels()[i];
        if (cm.property.id === READER_PROPERTIES_KIND) {
          this.readerControlModel = cm as ObservableSelectControlModel;
          this.readerControlModel.valueChanges.subscribe(() => this.updateFilter());
        }
        if (cm.property.id === WRITER_PROPERTIES_KIND) {
          this.writerControlModel = cm as ObservableSelectControlModel;
          this.writerControlModel.valueChanges.subscribe(() => this.updateFilter());
        }
      }
      this.updateFilter();
      this.hasWriterReader = !!this.readerControlModel || !!this.writerControlModel;
      this.setGroupedProperties();
    });
  }

  changePane(pane?: string): void {
    this.searchFilterText = '';
    this.paneSelected = pane;
    this.updateFilter();
  }

  isPaneError(pane: string): boolean {
    if (!this.propertiesGroupModel) {
      return false;
    }
    const props = this.propertiesGroupModel.getControlsModels()?.filter(model => {
      return model.property.group === pane;
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

  private updateFilter(): void {
    (this.propertiesFilter as FunctionTextFilter).filterFunc = this.computePropertyFilter();
  }

  private computePropertyFilter(): (property: Properties.Property) => boolean {
    const kind = this.paneSelected;
    if (kind) {
      return property => {
        if (property.group) {
          if (property.group === kind) {
            return true;
          }
          let ioControlModel: ObservableSelectControlModel | undefined;
          switch (kind) {
            case WRITER_PROPERTIES_KIND:
              ioControlModel = this.writerControlModel;
              break;
            case READER_PROPERTIES_KIND:
              ioControlModel = this.readerControlModel;
              break;
          }
          if (ioControlModel) {
            return property.group === kind + '.' + ioControlModel.value;
          }
        }
        return false;
      };
    } else {
      return property => {
        return !property.group || property.group === IO_COMMON_PROPERTIES_KIND;
      };
    }
  }
}
