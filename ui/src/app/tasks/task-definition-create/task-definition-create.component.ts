import { Component, HostListener, OnDestroy, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { EditorComponent, Flo } from 'spring-flo';
import { Subject, Subscription } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap';
import { MetamodelService } from '../components/flo/metamodel.service';
import { RenderService } from '../components/flo/render.service';
import { EditorService } from '../components/flo/editor.service';
import * as CodeMirror from 'codemirror';
import { ToolsService } from '../components/flo/tools.service';
import { TaskDefinitionCreateDialogComponent } from './create-dialog/create-dialog.component';
import { Router } from '@angular/router';
import { LoggerService } from '../../shared/services/logger.service';
import { arrangeAll } from '../components/flo/support/layout';
import { NotificationService } from '../../shared/services/notification.service';

/**
 * Component handling a creation of a composed task.
 *
 * @author Janne Valkealahti
 */
@Component({
  selector: 'app-task-definitin-create',
  templateUrl: './task-definition-create.component.html',
  styleUrls: ['../../shared/flo/flo.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskDefinitionCreateComponent implements OnInit, OnDestroy {

  dsl: string;
  paletteSize = 310;
  editorContext: Flo.EditorContext;

  contentValidated = false;
  lintOptions: CodeMirror.LintOptions;
  validationMarkers: Map<string, Flo.Marker[]>;
  parseErrors: any[];

  initSubject: Subject<void>;

  @ViewChild(EditorComponent, { static: true }) flo;

  constructor(public metamodelService: MetamodelService,
              public renderService: RenderService,
              public editorService: EditorService,
              private renderer: Renderer2,
              private notificationService: NotificationService,
              private bsModalService: BsModalService,
              private toolsService: ToolsService,
              private loggerService: LoggerService,
              private router: Router) {

    this.validationMarkers = new Map();
    this.parseErrors = [];

    this.lintOptions = {
      async: true,
      hasGutters: true,
      getAnnotations: (content: string,
                       updateLintingCallback: CodeMirror.UpdateLintingCallback,
                       options: CodeMirror.LintStateOptions,
                       editor: CodeMirror.Editor) => this.lint(content, updateLintingCallback, editor)
    };

    this.initSubject = new Subject();
    this.initSubject.subscribe();
  }

  ngOnInit() {
    this.resizeFloGraph();
  }

  ngOnDestroy() {
    // Invalidate cached metamodel, thus it's reloaded next time page is opened
    this.metamodelService.clearCachedData();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resizeFloGraph();
  }

  resizeFloGraph(height?: number) {
    const viewEditor = this.flo.element.nativeElement.children[2];
    if (height) {
      height = height - 330;
    } else {
      height = document.documentElement.clientHeight - 330;
    }
    this.renderer.setStyle(viewEditor, 'height', `${Math.max(height, 300)}px`);
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
    arrangeAll(this.editorContext);
  }

  clearGraph() {
    this.editorContext.clearGraph();
  }

  createTaskDefs() {
    if (this.isCreateComposedTaskDisabled) {
      this.notificationService.error('Some field(s) are missing or invalid.');
    } else {
      this.loggerService.log('createTaskDefs');
      const bsModalRef = this.bsModalService.show(TaskDefinitionCreateDialogComponent, { class: 'modal-lg' });
      bsModalRef.content.setDsl(this.dsl);
      bsModalRef.content.successCallback = () => {
        this.router.navigate([`tasks/definitions`]);
      };
    }
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
    const doc = editor.getDoc();
    const dslText = this.dsl;
    this.parseErrors = [];
    if (dslText) {
      this.toolsService.parseTaskTextToGraph(dslText).toPromise().then(taskConversion => {
        if (taskConversion.errors) {
          this.parseErrors = taskConversion.errors;
          taskConversion.errors.forEach(e => annotations.push({
            from: doc.posFromIndex(e.position),
            to: e['length'] ? doc.posFromIndex(e.position + e.length)
              : doc.posFromIndex(e.position + 1),
            message: e.message,
            severity: 'error'
          }));
        }
        updateLintingCallback(editor, annotations);
      }).catch(error => updateLintingCallback(editor, annotations));
    } else {
      // Don't parse empty DSL. It'll produce an error: "Ran out of input"
      updateLintingCallback(editor, annotations);
    }
  }

  get isCreateComposedTaskDisabled(): boolean {
    if (this.dsl && this.contentValidated && this.parseErrors.length === 0) {
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
