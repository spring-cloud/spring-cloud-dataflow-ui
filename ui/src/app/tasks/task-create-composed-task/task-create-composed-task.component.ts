import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import { Flo } from 'spring-flo';
import { Subject } from 'rxjs/Subject';
import { Subscription} from 'rxjs/Subscription';
import { BsModalService } from 'ngx-bootstrap';
import { MetamodelService } from '../flo/metamodel.service';
import { RenderService } from '../flo/render.service';
import { EditorService } from '../flo/editor.service';
import { TaskCreateComposedTaskDialogComponent } from './task-create-composed-task-dialog.component';
import * as CodeMirror from 'codemirror';

/**
 * Component handling a creation of a composed task.
 *
 * @author Janne Valkealahti
 */
@Component({
  selector: 'app-task-create-composed-task',
  templateUrl: './task-create-composed-task.component.html',
  styleUrls: [ '../../shared/flo/flo.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class TaskCreateComposedTaskComponent implements OnInit, OnDestroy {

  dsl: string;
  paletteSize = 170;
  editorContext: Flo.EditorContext;

  lintOptions: CodeMirror.LintOptions;
  validationMarkers: Map<string, Flo.Marker[]>;

  initSubject: Subject<void>;
  busy: Subscription;

  constructor(public metamodelService: MetamodelService,
              public renderService: RenderService,
              public editorService: EditorService,
              private bsModalService: BsModalService) {

    this.validationMarkers = new Map();

    this.lintOptions = {
      async: true,
      hasGutters: true,
      getAnnotations: (content: string,
                       updateLintingCallback: CodeMirror.UpdateLintingCallback,
                       options: CodeMirror.LintStateOptions,
                       editor: CodeMirror.Editor) => this.lint(content, updateLintingCallback, editor)
    };

    this.initSubject = new Subject();
    this.busy = this.initSubject.subscribe();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    // Invalidate cached metamodel, thus it's reloaded next time page is opened
    this.metamodelService.clearCachedData();
  }

  setEditorContext(editorContext: Flo.EditorContext) {
    this.editorContext = editorContext;
    if (this.editorContext) {
      const subscription = this.editorContext.paletteReady.subscribe(ready => {
        if (ready) {
          subscription.unsubscribe();
          this.initSubject.next();
          this.initSubject.complete();
        }
      });
    }
  }

  arrangeAll() {
    this.editorContext.performLayout().then(() => this.editorContext.fitToPage());
  }

  clearGraph() {
    this.editorContext.clearGraph();
  }

  createTaskDefs() {
    console.log('createTaskDefs');
    const bsModalRef = this.bsModalService.show(TaskCreateComposedTaskDialogComponent);
    bsModalRef.content.setDsl(this.dsl);
    bsModalRef.content.successCallback = () => this.clearGraph();
  }

  lint(dsl: string, updateLintingCallback: CodeMirror.UpdateLintingCallback, editor: CodeMirror.Editor): void {
    const annotations: CodeMirror.Annotation[] = [];
    Array.from(this.validationMarkers.values())
      .filter(markers => Array.isArray(markers))
      .forEach(markers => markers
        .filter(m => m.range && m.hasOwnProperty('severity'))
        .forEach(m => annotations.push({
          message: m.message,
          from: m.range.start,
          to: m.range.end,
          severity: Flo.Severity[m.severity].toLowerCase()
        }))
      );
    updateLintingCallback(editor, annotations);
  }

  get isCreateComposedTaskDisabled(): boolean {
    if (this.dsl) {
      return Array.from(this.validationMarkers.values())
        .find(markers => markers
          .find(m => m.severity === Flo.Severity.Error) !== undefined) !== undefined;
    }
    return true;
  }

  get gridOn(): boolean {
    return this.editorContext.gridSize !== 1;
  }

  set gridOn(on: boolean) {
    this.editorContext.gridSize = on ? 20 : 1;
  }

}
