import { Injectable } from '@angular/core';
import { dia } from 'jointjs';
import {
  StreamGraphPropertiesSource,
  StreamHead
} from './properties/stream-properties-source';
import { Utils } from './support/utils';
import { PropertiesDialogComponent } from '../shared/properties/properties-dialog.component';

/**
 * Service for creating properties source for properties dialog component
 *
 * @author Alex Boyko
 */
@Injectable()
export class PropertiesEditor {

  constructor() {}

  showForNode(propertiesDialog: PropertiesDialogComponent, element: dia.Element, graph: dia.Graph) {
    const name = `${element.attr('metadata/name')}`;
    const version = `${element.attr('metadata/version')}`;
    const type = `${element.attr('metadata/group').toUpperCase()}`;

    const streamHeads: dia.Cell[] = graph.getElements().filter(e => Utils.canBeHeadOfStream(graph, e));

    const streamHead: StreamHead = streamHeads.indexOf(element) >= 0 ? {
      presentStreamNames: streamHeads
        .filter(e => e.attr('stream-name') && e !== element)
        .map(e => e.attr('stream-name'))
    } : undefined;

    propertiesDialog.open(name, type, version, this.createPropertiesSourceForNode(element, streamHead));
  }

  protected createPropertiesSourceForNode(element: dia.Element, streamHead: StreamHead): StreamGraphPropertiesSource {
    return new StreamGraphPropertiesSource(element, streamHead);
  }

  showForLink(propertiesDialog: PropertiesDialogComponent, link: dia.Link) {
    const name = `${link.attr('metadata/name')}`;
    const version = `${link.attr('metadata/version')}`;
    const type = `${link.attr('metadata/group').toUpperCase()}`;
    propertiesDialog.open(name, type, version, this.createPropertiesSourceForLink(link));

  }

  protected createPropertiesSourceForLink(link: dia.Link): StreamGraphPropertiesSource {
    return new StreamGraphPropertiesSource(link, null);
  }
}
