import { Component, forwardRef, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { TimepickerValidator } from './timepicker.validator';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TimepickerComponent),
  multi: true
};

@Component({
  selector: 'app-dataflow-timepicker',
  styleUrls: ['./styles.scss'],
  template: `
    <div class="form-control-timepicker">
      <input placeholder="HH:MM:SS" [(ngModel)]="value" [popover]="popTemplate" [outsideClick]="true" placement="bottom"
             containerClass="popover-timepicker" class="form-control input-sm input-time" #pop="bs-popover"
             (onShown)="onShown()">
      <span (click)="show()" class="timepicker-icon fa fa-clock-o"></span>
      <ng-template #popTemplate>
        <timepicker [(ngModel)]="currentValue" showSeconds="true" [showMeridian]="false" [hourStep]="1" [minuteStep]="1"
                    [secondsStep]="1" (ngModelChange)="changedCurrentValue()"></timepicker>
      </ng-template>
    </div>
  `,
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class TimepickerComponent {

  @ViewChild('pop') popover;

  private valueProp: any = '';

  private currentValue;

  private isNull = true;

  get value(): any {
    return this.valueProp;
  }

  set value(val: any) {
    if (val !== this.valueProp) {
      this.valueProp = val;
    }
  }

  show() {
    this.popover.show();
  }

  onShown() {
    let setDefault = false;
    this.isNull = !(this.value && this.value.toString() !== '');
    if (!this.isNull) {
      if (TimepickerValidator.time(new FormControl(this.value))) {
        setDefault = true;
        this.isNull = true;
      } else {
        this.currentValue = moment(this.value, 'HH:mm:ss')
          .toDate();
      }
    } else {
      setDefault = true;
    }

    if (setDefault) {
      this.currentValue = moment(new Date())
        .hours(12)
        .minutes(0)
        .seconds(0)
        .toDate();
    }
  }

  writeValue(value: any) {
    this.valueProp = value;
  }

  changedCurrentValue() {
    if (this.currentValue) {
      const date = moment(this.currentValue);
      const val = `${date.format('HH')}:${date.format('mm')}:${date.format('ss')}`;
      if (this.isNull && val === '12:00:00') {
        this.writeValue(null);
      } else {
        this.writeValue(val);
      }
    } else {
      this.writeValue(null);
    }
  }

}
