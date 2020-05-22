import { Component, Input, OnInit } from '@angular/core';
import { Flo } from 'spring-flo';
import { MetamodelService } from '../metamodel.service';
import { RenderService } from '../render.service';

@Component({
  selector: 'app-task-flo-view',
  template: `
    <div id="task-graph-view-container" class="task-flo-view">
      <flo-editor (floApi)="setEditorContext($event)" [metamodel]="metamodelService" [renderer]="renderService"
                  [dsl]="dsl" [paperPadding]="paperPadding">
      </flo-editor>
    </div>
  `,
  styleUrls: ['../../shared/flo.scss']
})
export class ViewComponent implements OnInit {

  @Input()
  dsl: string;

  @Input()
  paperPadding = 5;

  private editorContext: Flo.EditorContext;

  constructor(public metamodelService: MetamodelService,
              public renderService: RenderService) {
  }

  ngOnInit() {
  }

  setEditorContext(editorContext: Flo.EditorContext) {
    this.editorContext = editorContext;
    this.editorContext.noPalette = true;
    this.editorContext.readOnlyCanvas = true;
  }

  get flo(): Flo.EditorContext {
    return this.editorContext;
  }

}
