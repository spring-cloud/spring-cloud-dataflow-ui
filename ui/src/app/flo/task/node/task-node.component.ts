import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { TaskGraphPropertiesSource } from '../properties/task-properties-source';
import { NodeComponent } from '../../shared/support/node-component';
import { DocService } from '../../shared/service/doc.service';
import { StreamPropertiesDialogComponent } from '../../stream/properties/stream-properties-dialog.component';

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

  @ViewChild('options_modal', { static: true })
  optionsModal: StreamPropertiesDialogComponent;

  constructor(docService: DocService) {
    super(docService);
  }

  showOptions() {
    const element = this.view.model;
    this.optionsModal.title = `Properties for ${element.prop('metadata/name').toUpperCase()}`;
    this.optionsModal.open(element.prop('metadata/name'), 'TASK', null, new TaskGraphPropertiesSource(element));
  }

}

