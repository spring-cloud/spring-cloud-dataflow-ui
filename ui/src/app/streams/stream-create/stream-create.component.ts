import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Flo } from 'spring-flo';
import { ParserService } from '../../shared/services/parser.service';
import { MetamodelService } from '../flo/metamodel.service';
import { RenderService } from '../flo/render.service';
import { EditorService } from '../flo/editor.service';
import { BsModalService } from 'ngx-bootstrap';
import { StreamCreateDialogComponent } from '../stream-create-dialog/stream-create-dialog.component';
import { ContentAssistService } from '../flo/content-assist.service';
import * as CodeMirror from 'codemirror';


@Component({
  selector: 'app-stream-create',
  templateUrl: './stream-create.component.html',
  styleUrls: [ '../flo/flo.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class StreamCreateComponent implements OnInit {

  dsl: string;

  editorContext: Flo.EditorContext;

  paletteSize = 170;

  hintOptions: any;

  lintOptions: CodeMirror.LintOptions;

  validationMarkers: Map<string, Flo.Marker[]>;

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
  }

  ngOnInit() {
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
      result.lines.filter(l => Array.isArray(l.errors)).forEach(l => l.errors.forEach(e => annotations.push({
        from: e.range.start,
        to: e.range.end,
        message: e.message,
        severity: 'error'
      })));
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

}
