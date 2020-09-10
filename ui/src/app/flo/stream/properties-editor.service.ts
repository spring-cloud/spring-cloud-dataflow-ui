import { Injectable } from '@angular/core';
import { dia } from 'jointjs';
import {
  StreamGraphPropertiesSource,
  StreamHead
} from './properties/stream-properties-source';
import { Utils } from './support/utils';
import { PropertiesDialogComponent } from '../shared/properties/properties-dialog.component';
import { ModalService } from '../../shared/service/modal.service';
import { StreamPropertiesDialogComponent } from './properties/stream-properties-dialog.component';
import { App, ApplicationType } from '../../shared/model/app.model';

/**
 * Service for creating properties source for properties dialog component
 *
 * @author Alex Boyko
 */
@Injectable()
export class PropertiesEditor {

  constructor(protected modalService: ModalService) {}

  showForNode(element: dia.Element, graph: dia.Graph) {
    const app = new App();
    app.name = `${element.prop('metadata/name')}`;
    app.type = (`${element.prop('metadata/group').toUpperCase()}` as any) as ApplicationType;
    app.version = `${element.prop('metadata/version')}`;

    const modal = this.modalService.show(StreamPropertiesDialogComponent);
    modal.app = app;

    const streamHeads: dia.Cell[] = graph.getElements().filter(e => Utils.canBeHeadOfStream(graph, e));

    const streamHead: StreamHead = streamHeads.indexOf(element) >= 0 ? {
      presentStreamNames: streamHeads
        .filter(e => e.attr('stream-name') && e !== element)
        .map(e => e.attr('stream-name'))
    } : undefined;

    modal.setData(this.createPropertiesSourceForNode(element, streamHead));
  }

  protected createPropertiesSourceForNode(element: dia.Element, streamHead: StreamHead): StreamGraphPropertiesSource {
    return new StreamGraphPropertiesSource(element, streamHead);
  }

  showForLink(link: dia.Link) {
    const app = new App();
    app.name = `${link.prop('metadata/name')}`;
    app.type = (`${link.prop('metadata/group').toUpperCase()}` as any) as ApplicationType;
    app.version = `${link.prop('metadata/version')}`;

    const modal = this.modalService.show(StreamPropertiesDialogComponent);
    modal.app = app;

    modal.setData(this.createPropertiesSourceForLink(link));

  }

  protected createPropertiesSourceForLink(link: dia.Link): StreamGraphPropertiesSource {
    return new StreamGraphPropertiesSource(link, null);
  }
}
