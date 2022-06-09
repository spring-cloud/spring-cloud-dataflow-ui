import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormGroup, UntypedFormControl} from '@angular/forms';
import {Properties} from 'spring-flo';
import PropertyFilter = Properties.PropertyFilter;

@Component({
  selector: 'clr-properties-group',
  templateUrl: './properties.group.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ClrPropertiesGroupComponent implements OnInit {
  @Input()
  propertiesGroupModel: Properties.PropertiesGroupModel;

  @Input()
  form: UntypedFormGroup;

  @Input()
  filter: PropertyFilter;

  ngOnInit(): void {
    if (this.propertiesGroupModel.isLoading) {
      const subscription = this.propertiesGroupModel.loadedSubject.subscribe(loaded => {
        if (loaded) {
          subscription.unsubscribe();
          this.createGroupControls();
        }
      });
    } else {
      this.createGroupControls();
    }
  }

  createGroupControls(): void {
    this.propertiesGroupModel.getControlsModels().forEach(c => {
      if (c.validation) {
        this.form.addControl(
          c.id,
          new UntypedFormControl(c.value || '', c.validation.validator, c.validation.asyncValidator)
        );
      } else {
        this.form.addControl(c.id, new UntypedFormControl(c.value || ''));
      }
    });
  }

  get controlModelsToDisplay(): any {
    return this.propertiesGroupModel.getControlsModels().filter(c => !this.filter || this.filter.accept(c.property));
  }
}
