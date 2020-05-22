import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { Flo } from 'spring-flo';

@Component({
  selector: 'app-graph-view',
  templateUrl: './graph-view.component.html',
  styleUrls: [ '../flo.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class GraphViewComponent {

  @Input()
  dsl: string;

  @Input()
  paperPadding = 5;

  @Input()
  metamodel: Flo.Metamodel;

  @Input()
  renderer: Flo.Renderer;

  @Output()
  floApi = new EventEmitter<Flo.EditorContext>();

  private editorContext: Flo.EditorContext;

  constructor() {}

  setEditorContext(editorContext: Flo.EditorContext) {
    this.editorContext = editorContext;
    this.editorContext.noPalette = true;
    this.editorContext.readOnlyCanvas = true;
    this.floApi.emit(this.editorContext);
  }

  get flo(): Flo.EditorContext {
    return this.editorContext;
  }

}
