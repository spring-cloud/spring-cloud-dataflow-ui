import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { StreamGraphPropertiesSource, StreamHead } from '../properties/stream-properties-source';
import { Utils } from '../support/utils';
import { dia } from 'jointjs';
import { NodeComponent } from '../../shared/support/node-component';
import { DocService } from '../../shared/service/doc.service';
import { StreamPropertiesDialogComponent } from '../properties/stream-properties-dialog.component';

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

  @ViewChild('options_modal', { static: true }) optionsModal: StreamPropertiesDialogComponent;

  constructor(docService: DocService) {
    super(docService);
  }

  isSingleOutputPort(): boolean {
    return this.view.model.attr('.output-port');
  }

  isSingleIntputPort(): boolean {
    return this.view.model.attr('.input-port');
  }

  showOptions() {
    // this.
    const element = this.view.model;
    const graph = this.paper.model;
    const streamHeads: dia.Cell[] = graph.getElements().filter(e => Utils.canBeHeadOfStream(graph, e));
    const streamHead: StreamHead = streamHeads.indexOf(element) >= 0 ? {
      presentStreamNames: streamHeads
        .filter(e => e.attr('stream-name') && e !== element)
        .map(e => e.attr('stream-name'))
    } : undefined;

    this.optionsModal.open(`${element.attr('metadata/name')}`,
      `${element.attr('metadata/group').toUpperCase()}`,
      `${element.attr('metadata/version')}`,
      new StreamGraphPropertiesSource(element, streamHead)
    );

  }

}

