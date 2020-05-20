import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, AbstractControl, FormControl } from '@angular/forms';
import { DynamicFormPropertyComponent, Properties } from 'spring-flo';
import PropertyFilter = Properties.PropertyFilter;

@Component({
  selector: 'clr-df-property',
  templateUrl: './df.property.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ClrDynamicFormPropertyComponent   {

  @Input()
  model: Properties.ControlModel<any>;

  @Input() form: FormGroup;

  constructor() {}

  get types() {
    return Properties.InputType;
  }

  get control(): AbstractControl {
    return this.form.controls[this.model.id];
  }

  get errorData() {
    return (this.model.validation && this.model.validation.errorData ? this.model.validation.errorData : [])
      .filter(e => this.control.errors && this.control.errors[e.id]);
  }

}
