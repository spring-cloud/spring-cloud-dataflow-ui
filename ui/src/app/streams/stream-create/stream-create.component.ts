import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Flo } from 'spring-flo';
import { MetamodelService } from '../flo/metamodel.service';
import { RenderService } from '../flo/render.service';
import { EditorService } from '../flo/editor.service';
import { BsModalService } from 'ngx-bootstrap';
import { StreamCreateDialogComponent } from './stream.create.dialog.component';
import { Utils } from '../flo/utils';

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

  constructor(public metamodelService : MetamodelService,
              public renderService : RenderService,
              public editorService : EditorService,
              private bsModalService : BsModalService) {
    console.log('Building');
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

}
