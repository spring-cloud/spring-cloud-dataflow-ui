import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Flo } from 'spring-flo';
import { BsModalService } from 'ngx-bootstrap';
import { MetamodelService } from '../flo/metamodel.service';
import { RenderService } from '../flo/render.service';
import { EditorService } from '../flo/editor.service';
import { TaskCreateComposedTaskDialogComponent } from './task-create-composed-task-dialog.component';
import { ContentAssistService } from '../flo/content-assist.service';
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
export class TaskCreateComposedTaskComponent implements OnInit {

  dsl: string;
  paletteSize = 170;
  gridOn = false;
  editorContext: Flo.EditorContext;

  hintOptions: any;
  lintOptions: CodeMirror.LintOptions;
  validationMarkers: Map<string, Flo.Marker[]>;


  constructor(public metamodelService: MetamodelService,
              public renderService: RenderService,
              public editorService: EditorService,
              private bsModalService: BsModalService,
              private contentAssistService: ContentAssistService) {

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

  get isCreateComposedTaskDisabled(): boolean {
    if (this.dsl) {
      return Array.from(this.validationMarkers.values())
        .find(markers => markers
          .find(m => m.severity === Flo.Severity.Error) !== undefined) !== undefined;
    }
    return true;
  }

}
