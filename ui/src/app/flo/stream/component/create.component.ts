import {
  Component, OnDestroy, OnInit, Renderer2,
  ViewChild, ViewEncapsulation, HostListener
} from '@angular/core';
import { DslEditorComponent, EditorComponent, Flo } from 'spring-flo';
import { Subject } from 'rxjs';
import { Parser } from '../../shared/service/parser';
import { MetamodelService } from '../metamodel.service';
import { EditorService } from '../editor.service';
import { NotificationService } from '../../../shared/service/notification.service';
import { ContentAssistService } from '../content-assist.service';
import { LoggerService } from '../../../shared/service/logger.service';
import { ParserService } from '../../shared/service/parser.service';
import { arrangeAll } from '../support/layout';
import { map, takeUntil } from 'rxjs/operators';
import * as CodeMirror from 'codemirror';
import { RenderService } from '../render.service';
import { StreamGraphPropertiesSource } from '../properties/stream-properties-source';
import { PropertiesDialogComponent } from '../../shared/properties/properties-dialog.component';

@Component({
  selector: 'app-stream-flo-create',
  styleUrls: [
    '../../shared/flo.scss'
  ],
  template: `
    <div id="flo-container" class="stream-editor">
      <flo-editor (floApi)="setEditorContext($event)"
                  [metamodel]="metamodelService"
                  [renderer]="renderService"
                  [editor]="editorService"
                  [(paletteSize)]="editorService.STREAM_PALETTE_WIDTH"
                  [paletteEntryPadding]="{width: 1.5, height: 1.5}"
                  [(dsl)]="dsl" [paperPadding]="55"
                  (contentValidated)="contentValidated=$event"
                  (onProperties)="handleLinkEvent($event)"
                  (validationMarkers)="markersFromGraphChanged($event)"
                  searchFilterPlaceHolder="Search for applications...">

        <div header class="flow-definition-container">
          <dsl-editor [(dsl)]="dsl" line-numbers="true" line-wrapping="true"
                      (focus)="editorContext.graphToTextSync=false" placeholder="Enter stream definition..."
                      (blur)="editorContext.graphToTextSync=true"
                      [hintOptions]="hintOptions" [lintOptions]="lintOptions"></dsl-editor>
        </div>

      </flo-editor>
      <div canvas class="flow-actions" [ngStyle]="{left: (editorService.STREAM_PALETTE_WIDTH + 20) + 'px'}">
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
  `,
  encapsulation: ViewEncapsulation.None
})
export class StreamFloCreateComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<any> = new Subject();
  dsl: string;
  editorContext: Flo.EditorContext;
  hintOptions: any;
  lintOptions: CodeMirror.LintOptions;
  validationMarkers: Map<string, Flo.Marker[]>;
  parseErrors: Parser.Error[] = [];
  contentValidated = false;
  initSubject: Subject<void>;
  zoomValues = [25, 50, 75, 100, 125, 150];
  isReady = false;

  @ViewChild(EditorComponent, { static: true }) flo;
  @ViewChild(PropertiesDialogComponent, { static: true }) propertiesDialog;
  @ViewChild(DslEditorComponent, {static: true}) dslEditor;

  constructor(public metamodelService: MetamodelService,
              public editorService: EditorService,
              public renderService: RenderService,
              private renderer: Renderer2,
              private notificationService: NotificationService,
              private contentAssistService: ContentAssistService,
              private loggerService: LoggerService,
              private parserService: ParserService) {

    this.validationMarkers = new Map();
    this.hintOptions = {
      async: true,
      hint: (doc: CodeMirror.EditorFromTextArea) => this.contentAssist(doc)
    };

    this.lintOptions = {
      async: true,
      hasGutters: true,
      getAnnotations: (content: string,
                       updateLintingCallback: CodeMirror.UpdateLintingCallback,
                       options: CodeMirror.LintStateOptions,
                       editor: CodeMirror.Editor) => this.lint(content, updateLintingCallback, editor)
    };

    this.initSubject = new Subject();
    this.initSubject
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe();
  }

  ngOnInit() {
    if (this.editorService.STREAM_PALETTE_WIDTH === 1) {
      let width = 256;
      if (document.documentElement.clientWidth > 1600) {
        width = 400;
      }
      this.editorService.STREAM_PALETTE_WIDTH = width;
    }
    this.resizeFloGraph();
  }

  ngOnDestroy() {
    this.metamodelService.clearCachedData();
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resizeFloGraph();
  }

  resizeFloGraph(height?: number) {
    const viewEditor = this.flo.element.nativeElement.children[1];
    if (height) {
      height = height - 360;
    } else {
      height = document.documentElement.clientHeight - 360;
    }
    this.renderer.setStyle(viewEditor, 'height', `${Math.max(height, 350)}px`);
  }

  setEditorContext(editorContext: Flo.EditorContext) {
    this.editorContext = editorContext;
    if (this.editorContext) {
      this.editorContext.gridSize = 10;
      const subscription = this.editorContext.paletteReady
        .pipe(takeUntil(this.ngUnsubscribe$))
        .pipe(map((value) => {
          this.resizeFloGraph();
          return value;
        }))
        .subscribe(ready => {
          if (ready) {
            subscription.unsubscribe();
            this.initSubject.next();
            this.initSubject.complete();
            this.isReady = true;
          }
        });
    }
  }

  get gridOn(): boolean {
    return this.editorContext.gridSize !== 1;
  }

  set gridOn(on: boolean) {
    this.editorContext.gridSize = on ? 40 : 1;
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

  handleLinkEvent(link) {
    const name = (link.prop('metadata/name'));
    const version = (link.prop('metadata/version'));
    const type = (link.prop('metadata/group'));
    const props = new StreamGraphPropertiesSource(link, null);
    this.propertiesDialog.open(name, type, version, props);
  }

  arrangeAll() {
    arrangeAll(this.editorContext);
  }

  createStreamDefs() {
    if (!this.dsl || !this.dsl.trim()) {
      this.notificationService.error('An error occurred', 'Please, enter one or more valid streams.');
      return;
    }
    if (this.isCreateStreamsDisabled) {
      this.notificationService.error('An error occurred', 'Some field(s) are missing or invalid.');
      return;
    }
    /*
    TODO
    const bsModalRef = this.bsModalService
      .show(StreamCreateDialogComponent, { class: 'modal-lg' });

    bsModalRef.content.open({ dsl: this.dsl }).subscribe(() => {
      this.editorContext.clearGraph();
    });*/
  }

  contentAssist(doc: CodeMirror.EditorFromTextArea) {
    const cursor = (doc as any).getCursor();
    const startOfLine = { line: cursor.line, ch: 0 };
    const prefix = (doc as any).getRange(startOfLine, cursor);

    return new Promise((resolve) => {
      this.contentAssistService.getProposals(prefix)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(completions => {
          const chopAt = this.interestingPrefixStart(prefix, completions);
          const finalProposals = completions.map((longCompletion: any) => {
            const text = typeof longCompletion === 'string' ? longCompletion : longCompletion.text;
            return text.substring(chopAt);
          });
          this.loggerService.log(JSON.stringify(finalProposals));
          resolve({
            list: finalProposals,
            from: { line: startOfLine.line, ch: chopAt },
            to: cursor
          });
        }, err => {
          this.loggerService.error(err);
          resolve();
        });
    });

  }

  lint(dsl: string, updateLintingCallback: CodeMirror.UpdateLintingCallback, editor: CodeMirror.Editor): void {
    const result = this.parserService.parseDsl(dsl, 'stream');
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
    if (result.lines) {
      const newParseErrors = [];
      result.lines.filter(l => Array.isArray(l.errors)).forEach(l => newParseErrors.push(...l.errors));
      this.parseErrors = newParseErrors;
      newParseErrors.forEach(e => annotations.push({
        from: e.range.start,
        to: e.range.end,
        message: e.message,
        severity: 'error'
      }));
    }
    updateLintingCallback(editor, annotations);
  }

  markersFromGraphChanged(validationMarkers: Map<string, Flo.Marker[]>) {
    this.validationMarkers = validationMarkers;
    this.dslEditor.triggerLinting();
  }

  interestingPrefixStart(prefix: string, completions: Array<any>) {
    const cursor = prefix.length;
    if (completions.every(completion => this.isDelimiter(completion[cursor]))) {
      return cursor;
    }
    return this.findLast(prefix, (s: string) => this.isDelimiter(s));
  }

  isDelimiter(c: string) {
    return c && (/\s|\|/).test(c);
  }

  findLast(str: string, predicate: (s: string) => boolean, start?: number): number {
    let pos = start || str.length - 1;
    while (pos >= 0 && !predicate(str[pos])) {
      pos--;
    }
    return pos;
  }

  get isCreateStreamsDisabled(): boolean {
    if (this.dsl && this.dsl.trim() && this.contentValidated && this.parseErrors.length === 0) {
      return Array.from(this.validationMarkers.values())
        .find(markers => markers
          .find(m => m.severity === Flo.Severity.Error) !== undefined) !== undefined;
    }
    return true;
  }

}
