import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractControl, UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {TaskLaunchValidator} from '../task-launch.validator';
import {Task} from '../../../../shared/model/task.model';

/**
 * Free Text Component
 * Provides a rich textareas with a semantic validation of the properties and the arguments.
 *
 * @author Damien Vitrac
 * @author Janne Valkealahti
 */
@Component({
  selector: 'app-task-launch-free-text',
  templateUrl: 'free-text.component.html',
  styleUrls: ['free-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FreeTextComponent implements OnInit, OnDestroy {
  @Input() task: Task;
  @Input() properties: Array<string> = [];
  @Input() arguments: Array<string> = [];
  @Output() updateProperties = new EventEmitter();
  @Output() updateArguments = new EventEmitter();
  @Output() exportProperties = new EventEmitter();
  @Output() copyProperties = new EventEmitter();
  @Output() exportArguments = new EventEmitter();
  @Output() copyArguments = new EventEmitter();
  @Output() launch = new EventEmitter<{props: string[]; args: string[]}>();

  formGroup: UntypedFormGroup;

  alines: Array<any> = [
    {
      label: 1,
      valid: true,
      message: ''
    }
  ];

  plines: Array<any> = [
    {
      label: 1,
      valid: true,
      message: ''
    }
  ];

  /**
   * State of the form
   */
  isPropertiesExportable = false;
  isArgumentsExportable = false;

  /**
   * Constructor
   * Initialize FormGroup
   */
  constructor() {
    this.formGroup = new UntypedFormGroup({
      ainput: new UntypedFormControl(),
      pinput: new UntypedFormControl(),
      afile: new UntypedFormControl(''),
      pfile: new UntypedFormControl('')
    });
  }

  ngOnInit(): void {
    this.formGroup.get('pinput').valueChanges.subscribe(value => {
      this.propertiesValueChanges(value);
    });

    this.formGroup.get('pinput').setValue(this.properties.join('\n'));
    this.formGroup.get('ainput').valueChanges.subscribe(value => {
      this.argumentsValueChanges(value);
    });

    this.formGroup.get('ainput').setValue(this.arguments.join('\n'));
  }

  /**
   * On destroy, emit the update event
   */
  ngOnDestroy(): void {
    this.updateProperties.emit(this.getCleanProperties());
    this.updateArguments.emit(this.getCleanArguments());
  }

  propertiesValueChanges(value: string): void {
    let countInvalidProperties = 0;
    let countValidProperties = 0;

    this.plines = (value.toString() || ' ').split('\n').map((line: string, index: number) => {
      const lineClean = line.replace(' ', '');
      const message = TaskLaunchValidator.property(lineClean);
      if (lineClean !== '') {
        if (message === true) {
          countValidProperties++;
        } else {
          countInvalidProperties++;
        }
      }
      return {
        label: index + 1,
        valid: message === true,
        message: message !== true ? message : ''
      };
    });
    this.isPropertiesExportable = countInvalidProperties + countValidProperties > 0;
  }

  argumentsValueChanges(value: string): void {
    let countInvalidArguments = 0;
    let countValidArguments = 0;

    this.alines = (value.toString() || ' ').split('\n').map((line: string, index: number) => {
      const lineClean = line.replace(' ', '');
      const message = TaskLaunchValidator.property(lineClean);
      if (lineClean !== '') {
        if (message === true) {
          countValidArguments++;
        } else {
          countInvalidArguments++;
        }
      }
      return {
        label: index + 1,
        valid: message === true,
        message: message !== true ? message : ''
      };
    });
    this.isArgumentsExportable = countInvalidArguments + countValidArguments > 0;
  }

  /**
   * Parse and load a file to the properties control
   * Produce an exception when the user cancel the file dialog
   */
  propertiesFileChange(event: Event): void {
    this.readFile(event, this.formGroup.get('pinput'), this.formGroup.get('pfile'));
  }

  /**
   * Parse and load a file to the arguments control
   * Produce an exception when the user cancel the file dialog
   */
  argumentsFileChange(event: Event): void {
    this.readFile(event, this.formGroup.get('ainput'), this.formGroup.get('afile'));
  }

  exportProps(): void {
    this.exportProperties.emit(this.getCleanProperties());
  }

  exportArgs(): void {
    this.exportArguments.emit(this.getCleanArguments());
  }

  copyPropsToClipboard(): void {
    this.copyProperties.emit(this.getCleanProperties());
  }

  copyArgsToClipboard(): void {
    this.copyArguments.emit(this.getCleanArguments());
  }

  launchTask(): void {
    this.launch.emit({props: this.getCleanProperties(), args: this.getCleanArguments()});
  }

  private getCleanProperties(): string[] {
    return (this.formGroup.get('pinput').value as string).split('\n').filter(line => line.replace(' ', '') !== '');
  }

  private getCleanArguments(): string[] {
    return (this.formGroup.get('ainput').value as string).split('\n').filter(line => line.replace(' ', '') !== '');
  }

  private readFile(event: Event, inputControl: AbstractControl, fileControl: AbstractControl): void {
    if ((event.target as HTMLInputElement).files && (event.target as HTMLInputElement).files.length) {
      const file = (event.target as HTMLInputElement).files[0];
      try {
        const reader = new FileReader();
        reader.onloadend = e => {
          inputControl.setValue(reader.result);
          fileControl.setValue('');
        };
        reader.readAsText(file);
      } catch (e) {}
    }
  }
}
