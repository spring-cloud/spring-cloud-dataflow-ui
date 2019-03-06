import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { StreamDeployValidator } from '../stream-deploy.validator';
import { NotificationService } from '../../../shared/services/notification.service';

/**
 * Free Text Component
 * Provides a rich textarea with a semantic validation of the properties
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-stream-deploy-free-text',
  templateUrl: 'free-text.component.html',
  styleUrls: ['styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StreamDeployFreeTextComponent implements OnInit, OnDestroy {

  /**
   * Stream ID
   */
  @Input() id: string;

  /**
   * Emit on destroy component with the current value
   */
  @Output() update = new EventEmitter();

  /**
   * Emit for request export
   */
  @Output() exportProperties = new EventEmitter();

  /**
   * Emit for request copy
   */
  @Output() copyProperties = new EventEmitter();

  /**
   * Emit for request deploy
   */
  @Output() deploy = new EventEmitter();

  /**
   * Properties to load
   */
  @Input() properties: Array<string> = [];

  /**
   * Is Deployed
   */
  @Input() isDeployed = false;

  /**
   * Form
   */
  formGroup: FormGroup;

  /**
   * Line of the textarea
   */
  lines: Array<any> = [{
    label: 1,
    valid: true,
    message: ''
  }];

  /**
   * State of the form
   */
  isSubmittable = false;

  /**
   * State of the form
   */
  isExportable = false;

  /**
   * Constructor
   * Initialize FormGroup
   */
  constructor(private notificationService: NotificationService) {
    this.formGroup = new FormGroup({
      'input': new FormControl(),
      'file': new FormControl('')
    });
  }

  /**
   * On Init
   */
  ngOnInit() {
    this.formGroup.get('input').valueChanges
      .subscribe((value) => {
        this.valueChanges(value);
      });

    this.formGroup.get('input').setValue(this.properties.join('\n'));
  }

  private getCleanProperties() {
    return this.formGroup.get('input').value.toString()
      .split('\n')
      .filter((line) => (line.replace(' ', '') !== ''));
  }

  /**
   * On destroy, emit the update event
   */
  ngOnDestroy() {
    this.update.emit(this.getCleanProperties());
  }

  /**
   * Textarea value Change
   */
  valueChanges(value: string) {
    let countInvalidProperties = 0;
    let countValidProperties = 0;

    this.lines = (value.toString() || ' ')
      .split('\n')
      .map((line: string, index: number) => {
        const lineClean = line.replace(' ', '');
        const message = StreamDeployValidator.property(lineClean);
        if (lineClean !== '') {
          if (message === true) {
            countValidProperties++;
          } else {
            countInvalidProperties++;
          }
        }
        return {
          label: (index + 1),
          valid: (message === true),
          message: (message !== true) ? message : ''
        };
      });

    this.isSubmittable = (countInvalidProperties === 0);
    this.isExportable = (countInvalidProperties + countValidProperties) > 0;
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
        this.formGroup.get('input').setValue(reader.result);
        this.formGroup.get('file').setValue('');
      };
      reader.readAsText(contents.target.files[0]);
    } catch (e) {
    }
  }

  /**
   * Emit a request export
   */
  exportProps() {
    this.exportProperties.emit(this.getCleanProperties());
  }

  /**
   * Copye to clipboard
   */
  copyToClipboard() {
    this.copyProperties.emit(this.getCleanProperties());
  }

  /**
   * Emit a request deploy
   */
  deployStream() {
    if (!this.isSubmittable) {
      this.notificationService.error('Some line(s) are invalid.');
    } else {
      this.deploy.emit(this.getCleanProperties());
    }
  }

}
