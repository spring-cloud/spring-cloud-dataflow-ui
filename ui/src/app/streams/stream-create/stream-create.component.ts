import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Flo } from 'spring-flo';
import { MetamodelService } from '../flo/metamodel.service';
import { RenderService } from '../flo/render.service';
import { EditorService } from '../flo/editor.service';
import { BsModalService } from 'ngx-bootstrap';
import { StreamCreateDialogComponent } from './stream.create.dialog.component';
import { Utils } from '../flo/utils';
import { ContentAssistService } from '../flo/content.assist.service';
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

  hintOptions : any;

  constructor(public metamodelService : MetamodelService,
              public renderService : RenderService,
              public editorService : EditorService,
              private bsModalService : BsModalService,
              private contentAssistService : ContentAssistService) {
    console.log('Building');

    this.hintOptions = {
      async: true,
      hint: (doc : CodeMirror.EditorFromTextArea, options, arg) => this.contentAssist(doc, options, arg)
    };
  }

  ngOnInit() {
  }

  get gridOn() : boolean {
    return this.editorContext.gridSize !== 1;
  }

  set gridOn(on : boolean) {
    this.editorContext.gridSize = on ? 40 : 1;
  }

  arrangeAll() {
    this.editorContext.performLayout().then(() => this.editorContext.fitToPage());
  }

  createStreamDefs() {
    let bsModalRef = this.bsModalService.show(StreamCreateDialogComponent);

    let dependencyLineMap = new Map<number, Array<number>>();
    let graph = this.editorContext.getGraph();

    graph.getElements()
      .filter(e => Utils.canBeHeadOfStream(graph, e))
      .filter(streamHead => typeof streamHead.attr('range/start/line') === 'number')
      .forEach(streamHead => {
        graph.getConnectedLinks(streamHead, {inbound: true})
          .filter(link => link.attr('props/isTapLink') === 'true')
          .forEach(link => {
            let source = graph.getCell(link.get('source').id);
            if (source && typeof source.attr('range/start/line') === 'number') {
              let parentLine = source.attr('range/start/line');
              if (!dependencyLineMap.has(parentLine)) {
                dependencyLineMap.set(parentLine, []);
              }
              dependencyLineMap.get(parentLine).push(streamHead.attr('range/start/line'));
            }
          });
      });

    // Remove empty lines from text definition and strip off white space
    let newLineNumber = 0;
    let text = '';
    this.dsl.split('\n').forEach(line => {
      let newLine = line.trim();
      if (newLine.length > 0) {
        text += (newLineNumber ? '\n' : '') + line.trim();
        newLineNumber++;
      }
    });

    bsModalRef.content.setDsl(text);
    bsModalRef.content.successCallback = () => this.editorContext.clearGraph();
  }

  contentAssist(doc : CodeMirror.EditorFromTextArea, options : any, arg : any) {
    let cursor = (<any>doc).getCursor();
    let startOfLine = {line: cursor.line, ch: 0};
    let prefix = (<any>doc).getRange(startOfLine, cursor);

    return new Promise((resolve) => {
      this.contentAssistService.getProposals(prefix).subscribe(completions => {
        let chopAt = this.interestingPrefixStart(prefix, completions);
        let finalProposals = completions.map((longCompletion : any)=> {
          let text = typeof longCompletion === 'string' ? longCompletion : longCompletion.text;
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

  /**
   * The suggestions provided by rest api are very long and include the whole command typed
   * from the start of the line. This function determines the start of the 'interesting' part
   * at the end of the prefix, so that we can use it to chop-off the suggestion there.
   */
  interestingPrefixStart(prefix : string, completions : Array<any>) {
    let cursor = prefix.length;
    if (completions.every(completion => this.isDelimiter(completion[cursor]))) {
      return cursor;
    }
    return this.findLast(prefix, (s: string) => this.isDelimiter(s));
  }

  isDelimiter(c : string) {
    return c && (/\s|\|/).test(c);
  }

  findLast(string : string, predicate : (s : string) => boolean, start? : number) : number {
    let pos = start || string.length - 1;
    while (pos >= 0 && !predicate(string[pos])) {
      pos--;
    }
    return pos;
  }

}
