import {
  Component, OnDestroy, OnInit, Renderer2,
  ViewChild, ViewEncapsulation, HostListener
} from '@angular/core';
import { Flo } from 'spring-flo';
import { ParserService } from '../../shared/services/parser.service';
import { Parser } from '../../shared/services/parser';
import { MetamodelService } from '../components/flo/metamodel.service';
import { RenderService } from '../components/flo/render.service';
import { EditorService } from '../components/flo/editor.service';
import { BsModalService } from 'ngx-bootstrap';
import { StreamCreateDialogComponent } from './create-dialog/create-dialog.component';
import { ContentAssistService } from '../components/flo/content-assist.service';
import * as CodeMirror from 'codemirror';
import { Subject, Subscription } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { LoggerService } from '../../shared/services/logger.service';
import { EditorComponent } from 'spring-flo';
import { NotificationService } from '../../shared/services/notification.service';


/**
 *  @author Gunnar Hillert
 */
@Component({
  selector: 'app-stream-create',
  templateUrl: './stream-create.component.html',
  styleUrls: ['../../shared/flo/flo.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StreamCreateComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<any> = new Subject();

  dsl: string;

  editorContext: Flo.EditorContext;

  paletteSize = 310;

  hintOptions: any;

  lintOptions: CodeMirror.LintOptions;

  validationMarkers: Map<string, Flo.Marker[]>;

  parseErrors: Parser.Error[] = [];

  contentValidated = false;

  initSubject: Subject<void>;

  @ViewChild(EditorComponent, { static: true }) flo;

  constructor(public metamodelService: MetamodelService,
              public renderService: RenderService,
              public editorService: EditorService,
              private bsModalService: BsModalService,
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
    this.resizeFloGraph();
  }

  /**
   * Will cleanup any {@link Subscription}s to prevent
   * memory leaks.
   */
  ngOnDestroy() {
    // Invalidate cached metamodel, thus it's reloaded next time page is opened
    this.metamodelService.clearCachedData();

    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
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

  arrangeAll() {
    this.editorContext.performLayout().then(() => this.editorContext.fitToPage());
  }

  createStreamDefs() {
    if (this.isCreateStreamsDisabled) {
      this.notificationService.error('Some field(s) are missing or invalid.');
    } else {
      const bsModalRef = this.bsModalService
        .show(StreamCreateDialogComponent, { class: 'modal-lg' });

      bsModalRef.content.open({ dsl: this.dsl }).subscribe(() => {
        this.editorContext.clearGraph();
      });
    }
  }

  contentAssist(doc: CodeMirror.EditorFromTextArea) {
    const cursor = (<any>doc).getCursor();
    const startOfLine = { line: cursor.line, ch: 0 };
    const prefix = (<any>doc).getRange(startOfLine, cursor);

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

  /**
   * The suggestions provided by rest api are very long and include the whole command typed
   * from the start of the line. This function determines the start of the 'interesting' part
   * at the end of the prefix, so that we can use it to chop-off the suggestion there.
   */
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

  findLast(string: string, predicate: (s: string) => boolean, start?: number): number {
    let pos = start || string.length - 1;
    while (pos >= 0 && !predicate(string[pos])) {
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
