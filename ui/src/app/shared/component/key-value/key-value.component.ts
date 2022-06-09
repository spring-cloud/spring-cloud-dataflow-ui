import {Component, Input, OnChanges, forwardRef, OnInit, ViewChild} from '@angular/core';
import {
  ControlValueAccessor,
  UntypedFormControl,
  UntypedFormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import {KeyValueValidator} from './key-value.validator';
import {KeyValueValidators} from './key-value.interface';
import {ClipboardCopyService} from '../../service/clipboard-copy.service';
import {NotificationService} from '../../service/notification.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-key-value',
  template: `
    <div [formGroup]="form">
      <div class="clr-textarea" [class.invalid]="isInvalid" [class.focus]="isFocus">
        <div class="numbers">
          <ng-template ngFor let-item [ngForOf]="lines">
            <div class="number">
              <span [class.invalid]="!item.valid">{{ item.label }}</span>
            </div>
          </ng-template>
        </div>
        <textarea
          dataflowAutoResize
          [formControl]="form.get('textarea')"
          rows="5"
          cols="20"
          (blur)="onBlur()"
          (focus)="onFocus()"
          placeholder="{{ placeholder }}"
          [dataflowFocus]="kvFocus"
        ></textarea>
      </div>
    </div>
    <div class="bar">
      <div class="btn-group">
        <a class="btn btn-copy btn-sm btn-secondary" (click)="propertiesFile.click()">
          <input
            [formControl]="form.get('file')"
            #propertiesFile
            id="propertiesFile"
            name="propertiesFile"
            type="file"
            (change)="fileChange($event)"
          />
          {{ 'commons.importFile' | translate }}
        </a>
        <a class="btn btn-sm btn-secondary" (click)="copyClipboard()">Copy to the clipboard</a>
      </div>
    </div>
  `,
  styleUrls: ['./key-value.component.scss'],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => KeyValueComponent), multi: true},
    {provide: NG_VALIDATORS, useExisting: forwardRef(() => KeyValueComponent), multi: true}
  ]
})
export class KeyValueComponent implements ControlValueAccessor, OnChanges, OnInit {
  @Input() validators: KeyValueValidators = {key: [], value: []};
  @Input() placeholder: string;
  @Input() kvFocus = false;
  isDisabled = false;
  isInvalid = false;
  isFocus = false;
  form: UntypedFormGroup;
  lines: Array<any> = [];
  @ViewChild('propertiesFile', {static: true}) propertiesFile;

  constructor(
    private clipboardCopyService: ClipboardCopyService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {
    this.form = new UntypedFormGroup({
      textarea: new UntypedFormControl(''),
      file: new UntypedFormControl('')
    });
  }

  propagateChange(val: any): void {}

  validateFn(c: any): any {}

  ngOnInit(): void {
    this.form.get('textarea').valueChanges.subscribe(value => {
      this.propagateChange(value);
      this.valueChanges(value);
    });
    this.onBlur();
  }

  get text(): string {
    return this.form.get('textarea').value;
  }

  set text(val: string) {
    this.form.get('textarea').setValue(val);
    this.propagateChange(val);
    this.valueChanges(val);
  }

  ngOnChanges(changes: any): void {
    if (changes.keyValidators || changes.valueValidators) {
      this.validateFn = KeyValueValidator.validateKeyValue(this.validators);
      this.propagateChange(this.text);
      this.valueChanges(this.text);
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {}

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(obj: any): void {
    this.text = obj;
  }

  validate(c: UntypedFormControl): any {
    return this.validateFn(c);
  }

  valueChanges(value: string): void {
    this.lines = KeyValueValidator.getErrors(value, this.validators);
    this.isInvalid = this.lines.filter(line => !line.valid).length > 0;
  }

  onFocus(): void {
    this.isFocus = true;
  }

  onBlur(): void {
    this.isFocus = false;
  }

  fileChange(contents: any): void {
    try {
      const reader = new FileReader();
      reader.onloadend = e => {
        this.form.get('textarea').setValue(reader.result);
        this.form.get('file').setValue('');
      };
      reader.readAsText(contents.target.files[0]);
    } catch (e) {}
  }

  copyClipboard(): void {
    if (this.form.get('textarea').value === '') {
      return;
    }
    this.clipboardCopyService.executeCopy(this.form.get('textarea').value);
    this.notificationService.success(
      this.translate.instant('commons.message.copiedTitle'),
      this.translate.instant('commons.message.copiedContent')
    );
  }
}
