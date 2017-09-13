import { Component, ViewEncapsulation, Input } from '@angular/core';
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

  private editorContext: Flo.EditorContext;

  constructor(
    public metamodelService: MetamodelService,
    public renderService: RenderService
  ) {}

  setEditorContext(editorContext: Flo.EditorContext) {
    this.editorContext = editorContext;
    this.editorContext.noPalette = true;
    this.editorContext.readOnlyCanvas = true;
  }

  get flo(): Flo.EditorContext {
    return this.editorContext;
  }

}
