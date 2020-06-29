import { Injectable } from '@angular/core';
import { dia } from 'jointjs';
import { BsModalService } from 'ngx-bootstrap';
import { StreamPropertiesDialogComponent } from './properties/stream-properties-dialog.component';
import {
  StreamAppPropertiesSource,
  StreamGraphPropertiesSource,
  StreamHead
} from './properties/stream-properties-source';
import { Utils } from './support/utils';

/**
 * Service for creating properties source for properties dialog component
 *
 * @author Alex Boyko
 */
@Injectable()
export class PropertiesEditor {

  constructor(protected bsModalService: BsModalService) {
  }

  showForNode(element: dia.Element, graph: dia.Graph) {
    const modalRef = this.bsModalService.show(StreamPropertiesDialogComponent, { class: 'modal-properties' });
    modalRef.content.name = `${element.attr('metadata/name')}`;
    modalRef.content.version = `${element.attr('metadata/version')}`;
    modalRef.content.type = `${element.attr('metadata/group').toUpperCase()}`;
    // const streamHeads: dia.Cell[] = flo.getGraph().getElements().filter(e => Utils.canBeHeadOfStream(flo.getGraph(), e));
    // const streamNames = streamHeads
    //   .filter(e => e.attr('stream-name') && e !== c)
    //   .map(e => e.attr('stream-name'));

    const streamHeads: dia.Cell[] = graph.getElements().filter(e => Utils.canBeHeadOfStream(graph, e));

    const streamHead: StreamHead = streamHeads.indexOf(element) >= 0 ? {
      presentStreamNames: streamHeads
        .filter(e => e.attr('stream-name') && e !== element)
        .map(e => e.attr('stream-name'))
    } : undefined;
    modalRef.content.setData(this.createPropertiesSourceForNode(element, streamHead));

  }

  protected createPropertiesSourceForNode(element: dia.Element, streamHead: StreamHead): StreamAppPropertiesSource {
    return new StreamGraphPropertiesSource(element, streamHead);
  }

  showForLink(link: dia.Link) {
    const modalRef = this.bsModalService.show(StreamPropertiesDialogComponent, { class: 'modal-properties' });
    modalRef.content.name = `${link.attr('metadata/name')}`;
    modalRef.content.version = `${link.attr('metadata/version')}`;
    modalRef.content.type = `${link.attr('metadata/group').toUpperCase()}`;
    modalRef.content.setData(this.createPropertiesSourceForLink(link));
  }

  protected createPropertiesSourceForLink(link: dia.Link): StreamAppPropertiesSource {
    return new StreamGraphPropertiesSource(link, null);
  }
}
