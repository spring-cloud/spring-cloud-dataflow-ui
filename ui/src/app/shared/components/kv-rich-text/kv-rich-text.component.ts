import { Component, Input, OnChanges, forwardRef, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { ClipboardService } from 'ngx-clipboard';
import { NotificationService } from '../../services/notification.service';
import { KvRichTextValidator } from './kv-rich-text.validator';
import { KvRichTextValidators } from './kv-rich-text.interface';

/**
 * Key Value Rich Text component
 * Implement Custom Form Control
 *
 * <app-rich-text [formControl]="myControl"></app-rich-text>
 * <app-rich-text formControlName="myCntrolName"></app-rich-text>
 *
 * By Default, the key and the value can be empty (a line `=` is valid).
 * You can add validator on the key and the value (required, custom validator ...).
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-kv-rich-text',
  template: `
    <div [formGroup]="form">
      <div class="form-textarea" [class.invalid]="isInvalid" [class.focus]="isFocus">
        <div class="numbers">
          <ng-template ngFor let-item [ngForOf]="lines">
            <div class="number">
              <span [class.invalid]="!item.valid">{{ item.label }}</span>
            </div>
          </ng-template>
        </div>
        <textarea dataflowAutoResize [formControl]="form.get('textarea')" rows="5" cols="20"
                  (blur)="onBlur()" (focus)="onFocus()" placeholder="{{ placeholder }}"></textarea>
      </div>
    </div>
    <div class="bar">

      <label class="file-btn">
        <input [formControl]="form.get('file')" id="propertiesFile" name="propertiesFile" type="file"
               (change)="fileChange($event)"/>
        Import a file
      </label>
      <span class="divider">|</span>
      <a (click)="copyClipboard()">Copy to the clipboard</a>
    </div>
  `,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => KvRichTextComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => KvRichTextComponent), multi: true }
  ]
})
export class KvRichTextComponent implements ControlValueAccessor, OnChanges, OnInit {

  /**
   * Validators
   */
  @Input() validators: KvRichTextValidators = { key: [], value: [] };

  /**
   * Placeholder input
   */
  @Input() placeholder: string;

  /**
   * Is Disabled State
   */
  isDisabled = false;

  /**
   * Is Valid State
   */
  isInvalid = false;

  /**
   * IsFocus State
   */
  isFocus = false;

  /**
   * Form Group
   */
  form: FormGroup;

  /**
   * Line of the textarea
   */
  lines: Array<any> = [];

  /**
   * Constructor
   *
   * @param clipboardService
   * @param notificationService
   */
  constructor(private clipboardService: ClipboardService,
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

  /**
   * On Init
   */
  ngOnInit(): void {
    this.form.get('textarea').valueChanges.subscribe((value) => {
      this.propagateChange(value);
      this.valueChanges(value);
    });
    this.onBlur();
  }

  /**
   * Text getter
   */
  get text() {
    return this.form.get('textarea').value;
  }

  /**
   * Text setter
   * @param val
   */
  set text(val) {
    this.form.get('textarea').setValue(val);
    this.propagateChange(val);
    this.valueChanges(val);
  }

  /**
   * On Input(s) change
   * @param changes
   */
  ngOnChanges(changes): void {
    if (changes.keyValidators || changes.valueValidators) {
      this.validateFn = KvRichTextValidator.validateKvRichText(this.validators);
      this.propagateChange(this.text);
      this.valueChanges(this.text);
    }
  }

  /**
   * Impl. registerOnChange
   * @param fn
   */
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  /**
   * Impl. registerOnTouched
   * @param fn
   */
  registerOnTouched(fn: any): void {
  }

  /**
   * Set disable state
   * @param isDisabled
   */
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  /**
   * Write
   * @param obj
   */
  writeValue(obj: any): void {
    this.text = obj;
  }

  /**
   * Validate the value
   * @param c
   */
  validate(c: FormControl) {
    return this.validateFn(c);
  }

  /**
   * Textarea value Change
   */
  valueChanges(value: string) {
    this.lines = KvRichTextValidator.getErrors(value, this.validators);
    this.isInvalid = this.lines.filter((line) => !line.valid).length > 0;
  }

  /**
   * On Textarea Focus
   * isFocus state set to true
   */
  onFocus() {
    this.isFocus = true;
  }

  /**
   * On Textarea Blur
   * isFocus state set to false
   */
  onBlur() {
    this.isFocus = false;
  }

  /**
   * Parse and load a file to the properties control
   * Produce an exception when the user cancel the file dialog
   *
   * @param {Blob} contents File
   */
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

  /**
   * Copy Clipboard
   */
  copyClipboard() {
    if (this.form.get('textarea').value === '') {
      return;
    }
    this.clipboardService.copyFromContent(this.form.get('textarea').value);
    this.notificationService.success('The content have been copied to your clipboard.');
  }

}
