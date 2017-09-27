import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { Flo } from 'spring-flo';
import { MetamodelService } from '../flo/metamodel.service';
import { RenderService } from '../flo/render.service';

@Component({
  selector: 'app-stream-graph-view',
  templateUrl: './stream-graph-view.component.html',
  styleUrls: [ '../flo/flo.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class StreamGraphViewComponent {

  @Input()
  dsl: string;

  @Input()
  paperPadding = 5;

  @Output()
  floApi = new EventEmitter<Flo.EditorContext>();

  private editorContext: Flo.EditorContext;

  constructor(
    public metamodelService: MetamodelService,
    public renderService: RenderService
  ) {}

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
