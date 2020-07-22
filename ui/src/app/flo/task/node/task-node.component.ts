import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { TaskGraphPropertiesSource } from '../properties/task-properties-source';
import { NodeComponent } from '../../shared/support/node-component';
import { DocService } from '../../shared/service/doc.service';
import { ModalService } from '../../../shared/service/modal.service';
import { App, ApplicationType } from '../../../shared/model/app.model';
import { TaskPropertiesDialogComponent } from '../properties/task-properties-dialog-component';

/**
 * Component for displaying application properties and capturing their values.
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
@Component({
  selector: 'task-flo-node',
  templateUrl: 'task-node.component.html',
  styleUrls: ['./task-node.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskNodeComponent extends NodeComponent {

  @ViewChild('markerTooltip')
  markerTooltipElement: ElementRef;

  @ViewChild('nodeTooltip')
  nodeTooltipElement: ElementRef;

  constructor(docService: DocService,
              private modalService?: ModalService) {
    super(docService);
  }

  showOptions() {
    const element = this.view.model;
    const modal = this.modalService.show(TaskPropertiesDialogComponent);
    const app = new App();
    app.name = element.prop('metadata/name');
    app.type = ApplicationType.task;
    modal.app = app;
    modal.title = `Properties for ${element.prop('metadata/name').toUpperCase()}`;
    modal.setData(new TaskGraphPropertiesSource(element));
  }

}

