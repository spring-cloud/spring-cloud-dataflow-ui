import { Injectable } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap';
import { Constants, Flo } from 'spring-flo';
import { CONTROLNODES_GROUP_TYPE } from './support/shapes';
import { dia } from 'jointjs';
import * as _joint from 'jointjs';
import { PropertiesDialogComponent } from '../../streams/flo/properties/properties-dialog.component';

const joint: any = _joint;

@Injectable()
export class EditorService implements Flo.Editor {

  constructor(
    private bsModalService: BsModalService
  ) {}

  createHandles(flo: Flo.EditorContext, createHandle: (owner: dia.CellView, kind: string,
                                                       action: () => void, location: dia.Point) => void, owner: dia.CellView): void {
    if (owner.model instanceof joint.dia.Link) {
      return;
    } else if (owner.model instanceof joint.dia.Element) {
      const element = <dia.Element> owner.model;
      const bbox = element.getBBox();

      // Delete handle
      let pt = (<any>bbox).origin().offset(bbox.width + 3, bbox.height + 3);
      createHandle(owner, Constants.REMOVE_HANDLE_TYPE, flo.deleteSelectedNode, pt);

      // Properties handle
      if (!element.attr('metadata/unresolved')) {
        pt = (<any>bbox).origin().offset(-14, bbox.height + 3);
        createHandle(owner, Constants.PROPERTIES_HANDLE_TYPE, () => {
          const modalRef = this.bsModalService.show(PropertiesDialogComponent);
          modalRef.content.title = `Properties for ${element.attr('metadata/name').toUpperCase()}`;
          modalRef.content.setData(element, flo.getGraph());
        }, pt);
      }
    }
  }

  setDefaultContent(editorContext: Flo.EditorContext,
                    elementMetadata: Map<string, Map<string, Flo.ElementMetadata>>): void {
    editorContext.createNode(this.createMetadata('START',
      CONTROLNODES_GROUP_TYPE,
      '',
      new Map<string, Flo.PropertyMetadata>(), {
        'fixed-name': true,
      }));

    editorContext.createNode(this.createMetadata('END',
      CONTROLNODES_GROUP_TYPE,
      '',
      new Map<string, Flo.PropertyMetadata>(), {
        'fixed-name': true,
      }));

    editorContext.performLayout();
  }

  private createMetadata(name: string, group: string, description: string,
                         properties: Map<string, Flo.PropertyMetadata>,
                         metadata?: Flo.ExtraMetadata): Flo.ElementMetadata {
    return {
      name: name,
      group: group,
      metadata: metadata,
      description: () => Promise.resolve(description),
      get: (property: string) => Promise.resolve(properties.get(property)),
      properties: () => Promise.resolve(properties)
    };

  }

}
