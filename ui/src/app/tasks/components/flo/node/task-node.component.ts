import { Component, ViewEncapsulation } from '@angular/core';
import { DocService } from '../../../../shared/services/doc.service';
import { NodeComponent } from '../../../../shared/flo/support/node-component';

/**
 * Component for displaying application properties and capturing their values.
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
@Component({
  selector: 'app-flo-node',
  templateUrl: 'task-node.component.html',
  styleUrls: ['./task-node.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskNodeComponent extends NodeComponent {

  constructor(docService: DocService) {
    super(docService);
  }

}

