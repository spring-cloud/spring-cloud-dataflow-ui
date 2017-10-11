import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Flo } from 'spring-flo';
import { BsModalService } from 'ngx-bootstrap';
import { MetamodelService } from '../flo/metamodel.service';
import { RenderService } from '../flo/render.service';
import { EditorService } from '../flo/editor.service';
import { TaskCreateComposedTaskDialogComponent } from './task-create-composed-task-dialog.component';

/**
 * Component handling a creation of a composed task.
 *
 * @author Janne Valkealahti
 */
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
              public editorService: EditorService,
              private bsModalService: BsModalService) { }

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
}
