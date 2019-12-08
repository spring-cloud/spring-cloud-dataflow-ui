import { Component, ViewEncapsulation } from '@angular/core';
import { NodeComponent } from '../../../../shared/flo/support/node-component';
import { DocService } from '../../../../shared/services/doc.service';
import { BsModalService } from 'ngx-bootstrap';
import { StreamGraphPropertiesSource, StreamHead } from '../properties/stream-properties-source';
import { StreamPropertiesDialogComponent } from '../properties/stream-properties-dialog.component';
import { Utils } from '../support/utils';
import { dia } from 'jointjs';

/**
 * Component for displaying application properties and capturing their values.
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
@Component({
  selector: 'app-flo-node',
  templateUrl: 'stream-node.component.html',
  styleUrls: ['./stream-node.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StreamNodeComponent extends NodeComponent {

  constructor(docService: DocService, private bsModalService: BsModalService) {
    super(docService);
  }

  isSingleOutputPort(): boolean {
    return this.view.model.attr('.output-port');
  }

  isSingleIntputPort(): boolean {
    return this.view.model.attr('.input-port');
  }

  showOptions() {
    const element = this.view.model;
    const modalRef = this.bsModalService.show(StreamPropertiesDialogComponent, { class: 'modal-properties' });
    modalRef.content.name = `${element.attr('metadata/name')}`;
    modalRef.content.version = `${element.attr('metadata/version')}`;
    modalRef.content.type = `${element.attr('metadata/group').toUpperCase()}`;
    // const streamHeads: dia.Cell[] = flo.getGraph().getElements().filter(e => Utils.canBeHeadOfStream(flo.getGraph(), e));
    // const streamNames = streamHeads
    //   .filter(e => e.attr('stream-name') && e !== c)
    //   .map(e => e.attr('stream-name'));

    const graph = this.paper.model;
    const streamHeads: dia.Cell[] = graph.getElements().filter(e => Utils.canBeHeadOfStream(graph, e));

    const streamHead: StreamHead = streamHeads.indexOf(element) >= 0 ? {
      presentStreamNames: streamHeads
        .filter(e => e.attr('stream-name') && e !== element)
        .map(e => e.attr('stream-name'))
    } : undefined;
    modalRef.content.setData(new StreamGraphPropertiesSource(element, streamHead));
  }

}

