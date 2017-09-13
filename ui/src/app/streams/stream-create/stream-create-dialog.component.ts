import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { FormGroup, FormControl, AbstractControl, Validators } from '@angular/forms';
import { ParserService } from '../../shared/services/parser.service';
import { convertParseResponseToJsonGraph } from '../flo/text-to-graph';
import { Utils } from '../flo/support/utils';
import { StreamsService } from '../streams.service';
import { ToastyService } from 'ng2-toasty';
import { Properties } from 'spring-flo';

/**
 * Stores progress percentage.
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
class ProgressData {
  constructor(public count, public total) {}
  get percent(): number {
    return Math.round(this.count / this.total * 100);
  }
}

const PROGRESS_BAR_WAIT_TIME = 500; // to account for animation delay

/**
 * Component to display dialog to allow user to name and deploy (if selected) a stream.
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
@Component({
  selector: 'app-stream-create-dialog-content',
  templateUrl: 'stream-create-dialog.component.html',
  styleUrls: [ 'stream-create-dialog.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class StreamCreateDialogComponent implements OnInit {

  form: FormGroup;
  streamDefs: Array<any> = [];
  errors: Array<string>;
  warnings: Array<string>;
  dependencies: Map<number, Array<number>>;
  progressData: ProgressData;
  deploy = false;
  successCallback: () => void;


  constructor(
    private bsModalRef: BsModalRef,
    private toastyService: ToastyService,
    private parserService: ParserService,
    private streamService: StreamsService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({}, this.uniqueStreamNames());
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
      // TODO: Adopt to parser types once they are available
      const graphAndErrors = convertParseResponseToJsonGraph(text, this.parserService.parseDsl(text));
      if (graphAndErrors.graph) {
        this.streamDefs.push(...graphAndErrors.graph.streamdefs);
        this.streamDefs.forEach((streamDef, i) => {
          streamDef.created = false;
          streamDef.index = i;
          this.form.addControl(streamDef.index.toString(), new FormControl(streamDef.name || '', [
            Validators.required,
            Validators.pattern(/^[\w\-]+$/)
          ], [
            Properties.Validators.uniqueResource((value) => this.streamService.getDefinition(value), 500)
          ]));
        });

        graphAndErrors.graph.links.filter(l => l.linkType === 'tap').forEach(l => {
          const parentLine = graphAndErrors.graph.nodes.find(n => n.id === l.from).range.start.line;
          const childLine = graphAndErrors.graph.nodes.find(n => n.id === l.to).range.start.line;
          if (parentLine !== childLine) {
            if (!this.dependencies.has(parentLine)) {
              this.dependencies.set(parentLine, [ childLine ]);
            } else {
              this.dependencies.get(parentLine).push(childLine);
            }
          }
        });

        // if (angular.isFunction($scope.focusInvalidField)) {
        //   // Need to be timed to let angular compile the DOM node for these changes.
        //   // HACK, but couldn't find anything better for this to work
        //   utils.$timeout($scope.focusInvalidField, 300);
        // }
      }
      if (graphAndErrors.errors) {
        this.errors = graphAndErrors.errors.map(e => e.message);
      }
    }
  }

  uniqueStreamNames() {
    const streamDefs = this.streamDefs;
    return (control: AbstractControl): { [key: string]: any } => {
      const duplicates = Utils.findDuplicates(streamDefs.filter(s => s.name).map(s => s.name));
      return duplicates.length === 0 ? null : {'uniqueStreamNames': duplicates};
    };
  }

  invalidStreamRow(def: any): boolean {
    return this.getControl(def.index.toString()).invalid || this.hasDuplicateName(def);
  }

  hasDuplicateName(def: any): boolean {
    return this.form.errors && this.form.errors.uniqueStreamNames && this.form.errors.uniqueStreamNames.indexOf(def.name) >= 0;
  }

  getControl(id: string): AbstractControl {
    return this.form.controls[id];
  }

  changeStreamName(index: number, newName: string) {
    const oldName = this.streamDefs[index].name;
    this.streamDefs[index].name = newName;
    if (this.dependencies.has(index)) {
      this.dependencies.get(index).forEach(i => {
        const depDef = this.streamDefs[i].def;
        this.streamDefs[i].def = depDef.replace(`:${oldName}.`, `:${newName}.`);
      });
    }
  }

  isStreamCreationInProgress(): boolean {
    return this.progressData !== undefined && this.progressData !== null;
  }

  handleOk() {
    this.submitStreams();
  }

  handleCancel() {
    this.bsModalRef.hide();
  }

  get okDisabled() {
    return false;
  }

  streamDefsToCreate(): Array<any> {
    return this.streamDefs ? this.streamDefs.filter(d => !d.created) : [];
  }

  waitForStreamDef(streamDefNameToWaitFor: string, attemptCount: number): Promise<void> {
    return new Promise(resolve => {
      if (attemptCount === 10) {
        console.error('Aborting after 10 attempts, cannot find the stream: ' + streamDefNameToWaitFor);
        resolve();
      }
      this.streamService.getDefinition(streamDefNameToWaitFor).subscribe(() => {
        console.log('Stream ' + streamDefNameToWaitFor + ' is ok!');
        resolve();
      }, () => {
        console.log('Stream ' + streamDefNameToWaitFor + ' is not there yet (attempt=#' + attemptCount + ')');
        setTimeout(() => {
          this.waitForStreamDef(streamDefNameToWaitFor, attemptCount + 1).then(() => {
            resolve();
          });
        }, 400);
      });
    });
  }

  canSubmit(): boolean {
    return !this.isStreamCreationInProgress()
      && this.form.valid
      && this.streamDefs
      && this.streamDefs.length
      && !(this.errors && this.errors.length);
  }

  submitStreams() {
    if (this.canSubmit()) {
      // Find index of the first not yet created stream
      // Can't use Array#findIndex(...) because not all browsers support it
      let index = 0;
      for (; index < this.streamDefs.length && this.streamDefs[index].created; index++) {
        // nothing to do - just loop to the not created stream def
      }
      // Setup progress bar data
      this.progressData = new ProgressData(0, (this.streamDefs.length - index) * 2 - 1); // create, wait for each - wait for the last
      // Start stream(s) creation
      this.createStreams(index);
    }
  }

  /**
   * Function creating streams based on the info in scopes flo.streamdefs contents.
   *
   * After calling the REST API to create a stream, it doesn't mean it is fully defined yet. So this createStreams()
   * function can be passed a stream name that it should wait on before continuing. This ensures that if a later
   * stream depends on an earlier stream, everything works.
   */
  createStreams(index: number) {
    if (index < 0 || index >= this.streamDefs.length) {
      // Invalid index means all streams have been created, close the dialog.
      this.bsModalRef.hide();
    } else {
      // Send the request to create a stream
      const def = this.streamDefs[index];
      this.streamService.createDefinition(def.name, def.def, this.deploy).subscribe(() => {
        console.log('Stream ' + def.name + ' created OK');
        // Stream created successfully, mark it as created
        def.created = true;
        this.progressData.count++;
        if (this.streamDefs.length - 1 === index) {
          // Last stream created, close the dialog
          // Delay closing the dialog thus progress bar 100% would stay up for a short a bit
          if (this.successCallback) {
            this.successCallback();
          }
          setTimeout(() => {
            this.bsModalRef.hide();
            this.toastyService.success('Stream(s) have been created successfully');
          }, PROGRESS_BAR_WAIT_TIME);
        } else {
          // There are more streams to create, so create the next one
          this.waitForStreamDef(def.name, 0).then(() => {
            this.progressData.count++;
            // $scope.createProgressData($scope.progressData.total, $scope.progressData.count + 1);
            this.createStreams(index + 1);
          }, function() {
            // Error handling
            // Previous stream creation request was issues but the stream resource is still unavailable for some reason
            // Never mind and keep creating the rest of the streams?
            this.progressData.count++;
            // $scope.createProgressData($scope.progressData.total, $scope.progressData.count + 1);
            this.createStreams(index + 1);
          });
        }
      }, (error) => {
        // Delay hiding the progress bar thus user can see it if operation went too fast
        setTimeout(() => {
          this.progressData = undefined;
        }, PROGRESS_BAR_WAIT_TIME);
        if (error._body && error._body.message) {
          this.toastyService.error(`Problem creating stream '${def.name}': ${error._body.message}`);
        } else {
          this.toastyService.error(`Failed to create stream '${def.name}'`);
        }
      });
    }
  }

}

