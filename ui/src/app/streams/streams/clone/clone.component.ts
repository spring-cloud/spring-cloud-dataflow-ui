import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { NotificationService } from '../../../shared/service/notification.service';
import { StreamService } from '../../../shared/api/stream.service';
import { StreamPage, Stream } from '../../../shared/model/stream.model';
import { of } from 'rxjs';
import { concatAll } from 'rxjs/operators';
import { Utils } from '../../..//flo/stream/support/utils';

@Component({
    selector: 'app-stream-clone',
    templateUrl: './clone.component.html',
    styles: [],
})
export class CloneComponent {
    isOpen = false;
    form: FormGroup;
    streams: Array<any>;
    names: string[];
    loading = false;
    isRunning = false;
    @Output() onCloned = new EventEmitter();

    constructor(
        private streamService: StreamService,
        private notificationService: NotificationService,
        private fb: FormBuilder
    ) {}

    open(streams: Array<any>) {
        this.streams = streams;
        this.form = this.fb.group({}, { validators: [this.uniqueStreamNames()] });
        this.loading = true;
        this.isRunning = false;
        this.isOpen = true;
        this.refresh();
    }

    refresh(): void {
        this.streamService.getStreams(0, 10000).subscribe((page: StreamPage) => {
            this.names = page.items.map((stream) => stream.name);
            this.streams.forEach((stream) => {
                const newName = this.generateName(stream.name);
                this.form.addControl(
                    stream.name,
                    new FormControl(newName, [
                        Validators.required,
                        this.uniqueStreamName(),
                        Validators.pattern(/^[a-zA-Z0-9\-]+$/),
                        Validators.maxLength(255),
                    ])
                );
            });
            this.loading = false;
        });
    }

    generateName(streamName: string, loop = 1): string {
        let newName = `${streamName}-Copy`;
        if (loop > 1) {
            newName = `${newName}-${loop}`;
        }
        if (this.names.find((name) => name === newName)) {
            return this.generateName(streamName, loop + 1);
        }
        return newName;
    }

    cancel() {
        this.isOpen = false;
    }

    done(success: number, error: number) {
        if (success > 0) {
            if (error > 0) {
                this.notificationService.success(
                    'Stream(s) clone',
                    'Stream(s) have been cloned partially'
                );
            } else {
                this.notificationService.success(
                    'Stream(s) clone',
                    'Stream(s) have been cloned successfully'
                );
            }
            this.onCloned.emit(true);
            this.cancel();
        } else {
            this.notificationService.error(
                'Error(s) occurred',
                'No stream(s) cloned.'
            );
        }
    }

    submit() {
        if (this.form.invalid) {
            this.notificationService.error(
                'Invalid field',
                'Some field(s) are missing or invalid.'
            );
            return;
        }
        const requests = this.streams.map((stream) => {
            const target = this.form.get(stream.name).value;
            return this.streamService.createStream(
                target,
                stream.dslText,
                stream.description
            );
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
                (err) => {
                    count++;
                    error++;
                    this.notificationService.error(
                        'Error(s) occurred',
                        err
                    );
                    if (count === requests.length) {
                        this.done(success, error);
                    }
                }
            );
    }

    uniqueStreamNames() {
        return (control: FormGroup): { [key: string]: any } => {
            let values = [];
            if (control && this.names) {
                values = (this.names || [])
                    .map((name) => control.get(name) ? control.get(name).value : '')
                    .filter((s) => !!s);
            }
            const duplicates = Utils.findDuplicates(values);
            return duplicates.length === 0 ? null : { uniqueStreamNames: duplicates };
        };
    }

    uniqueStreamName() {
        return (control: FormControl): { [key: string]: any } => {
            if (control.value && this.names) {
                if (this.names.indexOf(control.value) > -1) {
                    return { uniqueStreamName: true };
                }
            }
            return null;
        };
    }
}
