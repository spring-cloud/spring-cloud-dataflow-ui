import { Component, Input, OnChanges, forwardRef, OnInit, ViewChild } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { KeyValueValidator } from './key-value.validator';
import { KeyValueValidators } from './key-value.interface';
import { ClipboardCopyService } from '../../service/clipboard-copy.service';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-key-value',
  template: `
    <div [formGroup]="form">
      <div class="clr-textarea" [class.invalid]="isInvalid" [class.focus]="isFocus">
        <div class="numbers">
          <ng-template ngFor let-item [ngForOf]="lines">
            <div class="number">
              <span [class.invalid]="!item.valid">{{item.label}}</span>
            </div>
          </ng-template>
        </div>
        <textarea dataflowAutoResize [formControl]="form.get('textarea')" rows="5" cols="20"
                  (blur)="onBlur()" (focus)="onFocus()" placeholder="{{placeholder}}"
                  [dataflowFocus]="kvFocus"></textarea>
      </div>
    </div>
    <div class="bar">
      <div class="btn-group">
        <a class="btn btn-copy btn-sm btn-secondary" (click)="propertiesFile.click()">
          <input [formControl]="form.get('file')" #propertiesFile id="propertiesFile" name="propertiesFile" type="file"
                 (change)="fileChange($event)"/>
          Import a file
        </a>
        <a class="btn btn-sm btn-secondary" (click)="copyClipboard()">Copy to the clipboard</a>
      </div>
    </div>
  `,
  styleUrls: ['./key-value.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => KeyValueComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => KeyValueComponent), multi: true }
  ]
})
export class KeyValueComponent implements ControlValueAccessor, OnChanges, OnInit {
  @Input() validators: KeyValueValidators = { key: [], value: [] };
  @Input() placeholder: string;
  @Input() kvFocus = false;
  isDisabled = false;
  isInvalid = false;
  isFocus = false;
  form: FormGroup;
  lines: Array<any> = [];
  @ViewChild('propertiesFile', { static: true }) propertiesFile;

  constructor(private clipboardCopyService: ClipboardCopyService,
              private notificationService: NotificationService) {
    this.form = new FormGroup({
      textarea: new FormControl(''),
      file: new FormControl('')
    });
  }

  propagateChange(val) {
  }

  validateFn(c) {
  }

  ngOnInit(): void {
    this.form.get('textarea').valueChanges.subscribe((value) => {
      this.propagateChange(value);
      this.valueChanges(value);
    });
    this.onBlur();
  }

  get text() {
    return this.form.get('textarea').value;
  }

  set text(val) {
    this.form.get('textarea').setValue(val);
    this.propagateChange(val);
    this.valueChanges(val);
  }

  ngOnChanges(changes): void {
    if (changes.keyValidators || changes.valueValidators) {
      this.validateFn = KeyValueValidator.validateKeyValue(this.validators);
      this.propagateChange(this.text);
      this.valueChanges(this.text);
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(obj: any): void {
    this.text = obj;
  }

  validate(c: FormControl) {
    return this.validateFn(c);
  }

  valueChanges(value: string) {
    this.lines = KeyValueValidator.getErrors(value, this.validators);
    this.isInvalid = this.lines.filter((line) => !line.valid).length > 0;
  }

  onFocus() {
    this.isFocus = true;
  }

  onBlur() {
    this.isFocus = false;
  }

  fileChange(contents) {
    try {
      const reader = new FileReader();
      reader.onloadend = (e) => {
        this.form.get('textarea').setValue(reader.result);
        this.form.get('file').setValue('');
      };
      reader.readAsText(contents.target.files[0]);
    } catch (e) {
    }
  }

  copyClipboard() {
    if (this.form.get('textarea').value === '') {
      return;
    }
    this.clipboardCopyService.executeCopy(this.form.get('textarea').value);
    this.notificationService.success('Content copied', 'The content have been copied to your clipboard.');
  }

}
