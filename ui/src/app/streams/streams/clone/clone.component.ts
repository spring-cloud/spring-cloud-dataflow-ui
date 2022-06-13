import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../../../shared/service/notification.service';
import {StreamService} from '../../../shared/api/stream.service';
import {StreamPage, Stream} from '../../../shared/model/stream.model';
import {of} from 'rxjs';
import {concatAll} from 'rxjs/operators';
import {Utils} from '../../..//flo/stream/support/utils';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-stream-clone',
  templateUrl: './clone.component.html',
  styles: []
})
export class CloneComponent {
  isOpen = false;
  form: UntypedFormGroup;
  streams: Array<any>;
  names: string[];
  loading = false;
  isRunning = false;
  @Output() onCloned = new EventEmitter();

  constructor(
    private streamService: StreamService,
    private notificationService: NotificationService,
    private fb: UntypedFormBuilder,
    private translate: TranslateService
  ) {}

  open(streams: Array<any>): void {
    this.streams = streams;
    this.form = this.fb.group({}, {validators: [this.uniqueStreamNames()]});
    this.loading = true;
    this.isRunning = false;
    this.isOpen = true;
    this.refresh();
  }

  refresh(): void {
    this.streamService.getStreams(0, 10000).subscribe(
      (page: StreamPage) => {
        this.names = page.items.map(stream => stream.name);
        this.streams.forEach(stream => {
          const newName = this.generateName(stream.name);
          this.form.addControl(
            stream.name,
            new UntypedFormControl(newName, [
              Validators.required,
              this.uniqueStreamName(),
              Validators.pattern(/^[a-zA-Z0-9\-]+$/),
              Validators.maxLength(255)
            ])
          );
        });
        this.loading = false;
      },
      error => {
        this.notificationService.error(this.translate.instant('commons.message.error'), error);
        this.loading = false;
      }
    );
  }

  generateName(streamName: string, loop = 1): string {
    let newName = `${streamName}-Copy`;
    if (loop > 1) {
      newName = `${newName}-${loop}`;
    }
    if (this.names.find(name => name === newName)) {
      return this.generateName(streamName, loop + 1);
    }
    return newName;
  }

  cancel(): void {
    this.isOpen = false;
  }

  done(success: number, error: number): void {
    if (success > 0) {
      if (error > 0) {
        this.notificationService.success(
          this.translate.instant('streams.clone.message.partialSuccessTitle'),
          this.translate.instant('streams.clone.message.partialSuccessContent')
        );
      } else {
        this.notificationService.success(
          this.translate.instant('streams.clone.message.successTitle'),
          this.translate.instant('streams.clone.message.successContent')
        );
      }
      this.onCloned.emit(true);
      this.cancel();
    } else {
      this.notificationService.error(
        this.translate.instant('commons.message.error'),
        this.translate.instant('streams.clone.message.errorContent')
      );
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.notificationService.error(
        this.translate.instant('commons.message.invalidFieldsTitle'),
        this.translate.instant('commons.message.invalidFieldsContent')
      );
      return;
    }
    const requests = this.streams.map(stream => {
      const target = this.form.get(stream.name).value;
      return this.streamService.createStream(target, stream.dslText, stream.description);
    });
    let count = 0;
    let success = 0;
    let error = 0;

    of(...requests)
      .pipe(concatAll())
      .subscribe(
        () => {
          count++;
          success++;
          if (count === requests.length) {
            this.done(success, error);
          }
        },
        err => {
          count++;
          error++;
          this.notificationService.error(this.translate.instant('commons.message.error'), err);
          if (count === requests.length) {
            this.done(success, error);
          }
        }
      );
  }

  uniqueStreamNames(): any {
    return (control: UntypedFormGroup): {[key: string]: any} => {
      let values = [];
      if (control && this.names) {
        values = (this.names || []).map(name => (control.get(name) ? control.get(name).value : '')).filter(s => !!s);
      }
      const duplicates = Utils.findDuplicates(values);
      return duplicates.length === 0 ? null : {uniqueStreamNames: duplicates};
    };
  }

  uniqueStreamName(): any {
    return (control: UntypedFormControl): {[key: string]: any} => {
      if (control.value && this.names) {
        if (this.names.indexOf(control.value) > -1) {
          return {uniqueStreamName: true};
        }
      }
      return null;
    };
  }
}
