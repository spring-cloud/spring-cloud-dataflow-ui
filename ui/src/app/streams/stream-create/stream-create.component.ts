import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Flo } from 'spring-flo';
import { ParserService } from '../../shared/services/parser.service';
import { Parser } from '../../shared/services/parser';
import { MetamodelService } from '../flo/metamodel.service';
import { RenderService } from '../flo/render.service';
import { EditorService } from '../flo/editor.service';
import { BsModalService } from 'ngx-bootstrap';
import { StreamCreateDialogComponent } from '../stream-create-dialog/stream-create-dialog.component';
import { ContentAssistService } from '../flo/content-assist.service';
import * as CodeMirror from 'codemirror';
import { Subject } from 'rxjs/Subject';


@Component({
  selector: 'app-stream-create',
  templateUrl: './stream-create.component.html',
  styleUrls: [ '../../shared/flo/flo.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class StreamCreateComponent implements OnInit, OnDestroy {

  dsl: string;

  editorContext: Flo.EditorContext;

  paletteSize = 170;

  hintOptions: any;

  lintOptions: CodeMirror.LintOptions;

  validationMarkers: Map<string, Flo.Marker[]>;

  parseErrors: Parser.Error[] = [];

  contentValidated = false;

  busy: Subscription;

  initSubject: Subject<void>;

  constructor(public metamodelService: MetamodelService,
              public renderService: RenderService,
              public editorService: EditorService,
              private bsModalService: BsModalService,
              private contentAssistService: ContentAssistService,
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
    const bsModalRef = this.bsModalService
      .show(StreamCreateDialogComponent);
    bsModalRef.content.setDsl(this.dsl);
    bsModalRef.content.successCallback = () => this.editorContext.clearGraph();
  }

  contentAssist(doc: CodeMirror.EditorFromTextArea) {
    const cursor = (<any>doc).getCursor();
    const startOfLine = {line: cursor.line, ch: 0};
    const prefix = (<any>doc).getRange(startOfLine, cursor);

    return new Promise((resolve) => {
      this.contentAssistService.getProposals(prefix).subscribe(completions => {
        const chopAt = this.interestingPrefixStart(prefix, completions);
        const finalProposals = completions.map((longCompletion: any) => {
          const text = typeof longCompletion === 'string' ? longCompletion : longCompletion.text;
          return text.substring(chopAt);
        });
        console.log(JSON.stringify(finalProposals));
        resolve({
          list: finalProposals,
          from: {line: startOfLine.line, ch: chopAt},
          to: cursor
        });
      }, err => {
        console.error(err);
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
    if (this.dsl && this.contentValidated && this.parseErrors.length === 0) {
      return Array.from(this.validationMarkers.values())
        .find(markers => markers
          .find(m => m.severity === Flo.Severity.Error) !== undefined) !== undefined;
    }
    return true;
  }

}
