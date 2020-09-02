import { Component, HostListener, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { EditorComponent, Flo } from 'spring-flo';
import { MetamodelService } from '../metamodel.service';
import { RenderService } from '../render.service';
import { Subject } from 'rxjs';
import { EditorService } from '../editor.service';
import { NotificationService } from '../../../shared/service/notification.service';
import { ToolsService } from '../tools.service';
import { LoggerService } from '../../../shared/service/logger.service';
import { Router } from '@angular/router';
import get from 'lodash.get';
import { arrangeAll } from '../support/layout';
import * as CodeMirror from 'codemirror';
import { StreamGraphPropertiesSource } from '../../stream/properties/stream-properties-source';
import { PropertiesDialogComponent } from '../../shared/properties/properties-dialog.component';
import { TaskGraphPropertiesSource } from '../properties/task-properties-source';

@Component({
  selector: 'app-task-create-view',
  styleUrls: [
    '../../shared/flo.scss'
  ],
  template: `
    <div id="flo-container" class="stream-editor">
      <flo-editor (floApi)="setEditorContext($event)" [metamodel]="metamodelService" [renderer]="renderService"
                  [editor]="editorService" [(paletteSize)]="editorService.TASK_PALETTE_WIDTH"
                  [paletteEntryPadding]="{width: 2, height: 2}"
                  [paperPadding]="55" [(dsl)]="dsl" (contentValidated)="contentValidated=$event"
                  (validationMarkers)="validationMarkers = $event"
                  (onProperties)="handleLinkEvent($event)"
                  searchFilterPlaceHolder="Applications">

        <div header class="flow-definition-container">
          <dsl-editor [(dsl)]="dsl" line-numbers="true" line-wrapping="true"
                      (focus)="editorContext.graphToTextSync=false" placeholder="Enter task definitions here..."
                      (blur)="editorContext.graphToTextSync=true"
                      [lintOptions]="lintOptions"></dsl-editor>
        </div>
      </flo-editor>
      <div canvas class="flow-actions" [ngStyle]="{left: (editorService.TASK_PALETTE_WIDTH + 20) + 'px'}">
        <button class="btn btn-sm btn-transparent minus" type="button" (click)="changeZoom(-25)"
                [disabled]="editorContext.zoomPercent <= 25">
          <clr-icon shape="minus-circle"></clr-icon>
        </button>
        <clr-dropdown>
          <button class="btn btn-sm btn-secondary" clrDropdownTrigger>
            {{editorContext.zoomPercent}}%
            <clr-icon shape="caret down"></clr-icon>
          </button>
          <clr-dropdown-menu clrPosition="top-left" *clrIfOpen>
            <div clrDropdownItem *ngFor="let val of zoomValues" [class.active]="editorContext.zoomPercent === val"
                 (click)="editorContext.zoomPercent = val">
              {{val}}%
            </div>
          </clr-dropdown-menu>
        </clr-dropdown>
        <button class="btn btn-sm btn-transparent plus" type="button" (click)="changeZoom(25)"
                [disabled]="editorContext.zoomPercent >= 150">
          <clr-icon shape="plus-circle"></clr-icon>
        </button>
        <div class="divider"></div>
        <button (click)="arrangeAll()" class="btn btn-sm btn-secondary" type="button">Fit to Content</button>
      </div>
      <div class="overlay-loader" *ngIf="!isReady">
        <div style="padding: 10px 0;">
          <clr-spinner clrSmall clrInline></clr-spinner>&nbsp;
          Loading editor...
        </div>
      </div>
      <app-properties-dialog-content #propertiesDialog></app-properties-dialog-content>
    </div>
  `
})
export class TaskFloCreateComponent implements OnInit, OnDestroy {
  dsl: string;
  editorContext: Flo.EditorContext;
  isReady = false;

  contentValidated = false;
  lintOptions: CodeMirror.LintOptions;
  validationMarkers: Map<string, Flo.Marker[]>;
  parseErrors: any[];
  zoomValues = [25, 50, 75, 100, 125, 150];
  initSubject: Subject<void>;
  @ViewChild(EditorComponent, { static: true }) flo;
  @ViewChild(PropertiesDialogComponent, { static: true }) propertiesDialog;

  constructor(public metamodelService: MetamodelService,
              public renderService: RenderService,
              public editorService: EditorService,
              private renderer: Renderer2,
              private notificationService: NotificationService,
              private toolsService: ToolsService) {

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

  handleLinkEvent(link) {
    const name = (link.prop('metadata/name'));
    const version = (link.prop('metadata/version'));
    const type = (link.prop('metadata/group'));
    const props = new TaskGraphPropertiesSource(link);
    this.propertiesDialog.open(name, type, version, props);
  }

  resizeFloGraph(height?: number) {
    const viewEditor = this.flo.element.nativeElement.children[1];
    if (height) {
      height = height - 360;
    } else {
      height = document.documentElement.clientHeight - 360;
    }
    this.renderer.setStyle(viewEditor, 'height', `${Math.max(height, 300)}px`);
  }

  setEditorContext(editorContext: Flo.EditorContext) {
    this.editorContext = editorContext;
    if (this.editorContext) {
      this.editorContext.gridSize = 10;
      const subscription = this.editorContext.paletteReady.subscribe(ready => {
        if (ready) {
          subscription.unsubscribe();
          this.initSubject.next();
          this.initSubject.complete();
          this.isReady = true;
        }
      });
    }
  }

  arrangeAll() {
    arrangeAll(this.editorContext);
  }

  changeZoom(change: number) {
    if (this.zoomValues.indexOf(this.editorContext.zoomPercent) > -1) {
      this.editorContext.zoomPercent = this.editorContext.zoomPercent + change;
    } else {
      const index = Math.max(Math.round(this.editorContext.zoomPercent / 25) - 1, 0);
      if (change > 0) {
        this.editorContext.zoomPercent = this.zoomValues[Math.min(index, 5)];
      } else {
        this.editorContext.zoomPercent = this.zoomValues[Math.min(index, 5)];
      }
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
            to: get(e, 'length', 0) ? doc.posFromIndex(e.position + e.length)
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

}
