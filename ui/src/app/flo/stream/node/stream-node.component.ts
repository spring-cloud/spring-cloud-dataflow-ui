import { Component, ViewEncapsulation } from '@angular/core';
import { StreamHead } from '../properties/stream-properties-source';
import { Utils } from '../support/utils';
import { dia } from 'jointjs';
import { NodeComponent } from '../../shared/support/node-component';
import { DocService } from '../../shared/service/doc.service';

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
        alert('TODO: StreamNodeComponent');
        // this.view
        // TODO
        // const modalRef = this.bsModalService.show(StreamPropertiesDialogComponent, { class: 'modal-properties' });
        // modalRef.content.name = `${element.attr('metadata/name')}`;
        // modalRef.content.version = `${element.attr('metadata/version')}`;
        // modalRef.content.type = `${element.attr('metadata/group').toUpperCase()}`;
        // const graph = this.paper.model;
        // const streamHeads: dia.Cell[] = graph.getElements().filter(e => Utils.canBeHeadOfStream(graph, e));
        // const streamHead: StreamHead = streamHeads.indexOf(element) >= 0 ? {
        //   presentStreamNames: streamHeads
        //     .filter(e => e.attr('stream-name') && e !== element)
        //     .map(e => e.attr('stream-name'))
        // } : undefined;
        // modalRef.content.setData(new StreamGraphPropertiesSource(element, streamHead));
    }

}

