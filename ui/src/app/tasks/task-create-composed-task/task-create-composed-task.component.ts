import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MetamodelService } from '../flo/metamodel.service';
import { RenderService } from '../flo/render.service';
import { EditorService } from '../flo/editor.service';
import { Flo } from 'spring-flo';

@Component({
  selector: 'app-task-create-composed-task',
  templateUrl: './task-create-composed-task.component.html',
  styleUrls: [ '../../streams/flo/flo.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class TaskCreateComposedTaskComponent implements OnInit {

  dsl: string;
  paletteSize = 170;
  gridOn = false;
  editorContext: Flo.EditorContext;

  constructor(public metamodelService: MetamodelService,
              public renderService: RenderService,
              public editorService: EditorService) { }

  ngOnInit() {
  }

  arrangeAll() {
    this.editorContext.performLayout().then(() => this.editorContext.fitToPage());
  }

  createTaskDefs() {
  }
}
