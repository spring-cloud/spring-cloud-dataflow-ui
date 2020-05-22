import { Component, ViewEncapsulation } from '@angular/core';
import { TaskPropertiesDialogComponent } from '../properties/task-properties-dialog-component';
import { TaskGraphPropertiesSource } from '../properties/task-properties-source';
import { NodeComponent } from '../../shared/support/node-component';
import { DocService } from '../../shared/service/doc.service';

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

  constructor(docService: DocService) {
    super(docService);
  }

  showOptions() {
    // TODO
    // const modalRef = this.bsModalService.show(TaskPropertiesDialogComponent);
    // const element = this.view.model;
    // modalRef.content.titleModal = `Properties for ${element.attr('metadata/name').toUpperCase()}`;
    // modalRef.content.name = element.attr('metadata/name');
    // modalRef.content.type = 'TASK';
    // modalRef.content.setData(new TaskGraphPropertiesSource(element));
  }

}

