import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { dia } from 'jointjs';
import { NodeComponent } from '../../shared/support/node-component';
import { DocService } from '../../shared/service/doc.service';
import { PropertiesEditor } from '../properties-editor.service';

/**
 * Component for displaying application properties and capturing their values.
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
@Component({
  selector: 'app-flo-node',
  templateUrl: './stream-node.component.html',
  styleUrls: ['./stream-node.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StreamNodeComponent extends NodeComponent {

  @ViewChild('markerTooltip')
  markerTooltipElement: ElementRef;

  @ViewChild('canvasNodeTooltip')
  canvasTooltipElement: ElementRef;

  @ViewChild('paletteNodeTooltip')
  paletteTooltipElement: ElementRef;

  constructor(docService: DocService, private propertiesEditor: PropertiesEditor) {
    super(docService);
  }

  showOptions() {
    this.propertiesEditor.showForNode(<dia.Element> this.view.model, this.paper.model);
  }

}

