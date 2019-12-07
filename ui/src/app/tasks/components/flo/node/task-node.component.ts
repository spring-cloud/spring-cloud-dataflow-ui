import { Component, ViewEncapsulation } from '@angular/core';
import { DocService } from '../../../../shared/services/doc.service';
import { NodeComponent } from '../../../../shared/flo/support/node-component';
import { BsModalService } from 'ngx-bootstrap';
import { TaskPropertiesDialogComponent } from '../properties/task-properties-dialog-component';
import { TaskGraphPropertiesSource } from '../properties/task-properties-source';

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

  constructor(docService: DocService, private bsModalService: BsModalService) {
    super(docService);
  }

  showOptions() {
    const modalRef = this.bsModalService.show(TaskPropertiesDialogComponent);
    const element = this.view.model;
    modalRef.content.title = `Properties for ${element.attr('metadata/name').toUpperCase()}`;
    modalRef.content.name = element.attr('metadata/name');
    modalRef.content.type = 'TASK';
    modalRef.content.setData(new TaskGraphPropertiesSource(element));
  }

}

