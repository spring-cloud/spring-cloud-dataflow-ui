import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Utils } from '../../../flo/stream/support/utils';
import { StreamFloCreateComponent } from '../../../flo/stream/component/create.component';
import { NotificationService } from '../../../shared/service/notification.service';
import { ParserService } from '../../../flo/shared/service/parser.service';
import { Properties } from 'spring-flo';
import { StreamService } from '../../../shared/api/stream.service';
import { Observable, timer } from 'rxjs';
import { SanitizeDsl } from '../../../flo/stream/dsl-sanitize.service';

class ProgressData {
  constructor(public count, public total) {
  }

  get percent(): number {
    return Math.round(this.count / this.total * 100);
  }
}

const PROGRESS_BAR_WAIT_TIME = 500; // to account for animation delay

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styles: []
})
export class CreateComponent implements OnInit {

  isOpen = false;
  form: FormGroup;
  streams: Array<any>;
  errors: Array<string>;
  dependencies: Map<number, Array<number>>;
  progressData: ProgressData;
  operationRunning = '';

  // flo
  @ViewChild('flo', { static: true }) flo: StreamFloCreateComponent;


  constructor(private router: Router,
              private parserService: ParserService,
              private streamService: StreamService,
              private notificationService: NotificationService,
              private fb: FormBuilder,
              private sanitizeDsl: SanitizeDsl) {
    this.form = this.fb.group({}, this.uniqueStreamNames());
  }

  getStreams(): Array<any> {
    return this.streams ? this.streams.filter(d => !d.created) : [];
  }

  ngOnInit(): void {
    this.streams = [];
    // this.setDsl(`foo${new Date().getTime()}=file --app=sasdasdasdasdasdsadasdasdasdsada --app.toto=asdsadsadasdsadasdsadsad|
    // log\nbar${new Date().getTime()}=file|log\njoo${new Date().getTime()}=file|log\nair${new Date().getTime()}=file|log`);
    // this.isOpen = true;
  }

  back() {
    this.router.navigateByUrl('streams/list');
  }

  isStreamCreationInProgress(): boolean {
    return this.progressData !== undefined && this.progressData !== null;
  }

  changeStreamName(index: number, newName: string) {
    const oldName = this.streams[index].name;
    this.streams[index].name = newName;
    if (this.dependencies.has(index)) {
      this.dependencies.get(index).forEach(i => {
        const depDef = this.streams[i].def;
        this.streams[i].def = depDef.replace(`:${oldName}.`, `:${newName}.`);
      });
    }
  }

  changeStreamDescription(index: number, description: string) {
    const def = this.streams[index];
    def.description = description;
  }

  uniqueStreamNames() {
    return (control: FormGroup): { [key: string]: any } => {
      const values = (this.streams || []).map((s, index) => {
        return control.get(index.toString()) ? control.get(index.toString()).value : '';
      }).filter(s => !!s);
      const duplicates = Utils.findDuplicates(values);
      return duplicates.length === 0 ? null : { uniqueStreamNames: duplicates };
    };
  }

  canSubmit(): boolean {
    return !this.isStreamCreationInProgress()
      && this.form.valid
      && this.streams
      && this.streams.length
      && !(this.errors && this.errors.length);
  }

  setDsl(dsl: string) {
    // Remove empty lines from text definition and strip off white space
    let newLineNumber = 0;
    let text = '';
    dsl.split('\n').forEach(line => {
      const newLine = line.trim();
      if (newLine.length > 0) {
        text += (newLineNumber ? '\n' : '') + line.trim();
        newLineNumber++;
      }
    });
    this.dependencies = new Map();
    if (text) {
      const graphAndErrors = this.sanitizeDsl.convert(text, this.parserService.parseDsl(text));
      if (graphAndErrors.graph) {
        this.streams.push(...graphAndErrors.graph.streamdefs);
        this.streams.forEach((streamDef, i) => {
          streamDef.created = false;
          streamDef.index = i;
          this.form.addControl(
            streamDef.index.toString(),
            new FormControl('', [
              Validators.required,
              Validators.pattern(/^[a-zA-Z0-9\-]+$/),
              Validators.maxLength(255)
            ], [
              Properties.Validators.uniqueResource((value) => this.isUniqueStreamName(value), 500)
            ]));

          this.form.addControl(
            streamDef.index.toString() + '_desc', new
            FormControl(streamDef.description || '', [
              Validators.maxLength(255)
            ], []));

        });
        graphAndErrors.graph.links.filter(l => l.linkType === 'tap').forEach(l => {
          const parentLine = graphAndErrors.graph.nodes.find(n => n.id === l.from).range.start.line;
          const childLine = graphAndErrors.graph.nodes.find(n => n.id === l.to).range.start.line;
          if (parentLine !== childLine) {
            if (!this.dependencies.has(parentLine)) {
              this.dependencies.set(parentLine, [childLine]);
            } else {
              this.dependencies.get(parentLine).push(childLine);
            }
          }
        });
      }
      if (graphAndErrors.errors) {
        this.errors = graphAndErrors.errors.map(e => e.message);
      }
    }
  }

  isUniqueStreamName(name: string): Observable<boolean> {
    return new Observable<boolean>(obs => {
      if (name) {
        this.streamService.getStream(name).subscribe(def => {
          if (def) {
            obs.next(false);
          } else {
            obs.next(true);
          }
          obs.complete();
        }, () => {
          obs.next(true);
          obs.complete();
        });
      } else {
        obs.next(true);
        obs.complete();
      }
    });
  }

  cancel() {
    this.form = new FormGroup({}, this.uniqueStreamNames());
    this.streams = [];
    this.isOpen = false;
  }

  submit = function () {
    // this.form.mark
    if (this.canSubmit()) {
      // Find index of the first not yet created stream
      // Can't use Array#findIndex(...) because not all browsers support it
      let index = 0;
      for (; index < this.streams.length && this.streams[index].created; index++) {
        // nothing to do - just loop to the not created stream def
      }
      // Setup progress bar data
      this.progressData = new ProgressData(0, (this.streams.length - index) * 2 - 1); // create, wait for each - wait for the last
      // Start stream(s) creation
      this.createStreams(index);
    } else {

    }
  };

  createStream() {
    if (!this.flo.dsl || !this.flo.dsl.trim()) {
      this.notificationService.error('Invalid stream(s)', 'Please, enter one or more valid streams.');
      return;
    }
    if (this.flo.isCreateStreamsDisabled) {
      this.notificationService.error('Invalid stream(s)', 'Some field(s) are missing or invalid.');
      return;
    }
    this.form = new FormGroup({}, this.uniqueStreamNames());
    this.streams = [];
    this.setDsl(this.flo.dsl);
    this.isOpen = true;
  }

  createStreams(index: number) {
    if (index < 0 || index >= this.streams.length) {
      // TODO
      // Invalid index means all streams have been created, close the dialog.
      // this.bsModalRef.hide();
    } else {
      const def = this.streams[index];
      // this.blockerService.lock();
      this.operationRunning = `Create stream ${def.name}`;
      const description = def.description === undefined ? '' : def.description;
      this.streamService
        .createStream(def.name, def.def, description)
        // .pipe(takeUntil(this.ngUnsubscribe$), finalize(() => this.blockerService.unlock()))
        .subscribe(() => {
          // Stream created successfully, mark it as created
          def.created = true;
          this.progressData.count++;
          if (this.streams.length - 1 === index) {
            // this.confirm.emit(true);
            this.operationRunning = `Creation completed`;
            setTimeout(() => {
              this.notificationService.success('Stream(s) creation', 'Stream(s) have been created successfully');
              this.router.navigate(['/streams/list']);
            }, PROGRESS_BAR_WAIT_TIME);
          } else {
            this.waitForStreamDef(def.name, 0)
              .then(() => {
                this.progressData.count++;
                this.createStreams(index + 1);
              }, () => {
                this.progressData.count++;
                this.createStreams(index + 1);
              });
          }
        }, (error) => {
          setTimeout(() => {
            this.progressData = undefined;
          }, PROGRESS_BAR_WAIT_TIME);
          if (error._body && error._body.message) {
            this.notificationService.error('An error occurred', `Problem creating stream '${def.name}': ${error._body.message}`);
          } else {
            this.notificationService.error('An error occurred', `Failed to create stream '${def.name}'`);
          }
        });
    }
  }

  getControl(id: string): AbstractControl {
    return this.form.controls[id];
  }

  waitForStreamDef(streamDefNameToWaitFor: string, attemptCount: number): Promise<void> {
    return new Promise(resolve => {
      if (attemptCount === 10) {
        resolve();
      }
      this.streamService.getStream(streamDefNameToWaitFor)
        // .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => {
          resolve();
        }, () => {
          setTimeout(() => {
            this.waitForStreamDef(streamDefNameToWaitFor, attemptCount + 1).then(() => {
              resolve();
            });
          }, 400);
        });
    });
  }

}
