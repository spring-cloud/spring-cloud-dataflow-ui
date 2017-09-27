import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, Injector, Type } from '@angular/core';
import { Constants, Flo } from 'spring-flo';
import { dia } from 'jointjs';
import { defaultsDeep } from 'lodash';
import { TaskAppShape, BatchSyncShape, BatchLink, BatchStartShape, BatchEndShape } from './support/shapes';
import { layout } from '../../streams/flo/support/layout';
import { ElementComponent } from '../../streams/flo/support/shape-component';
import { NodeComponent } from './node/node.component';
import { DecorationComponent } from '../../streams/flo/decoration/decoration.component';
import { HandleComponent } from '../../streams/flo/handle/handle.component';
import * as _joint from 'jointjs';
const joint: any = _joint;

const HANDLE_ICON_MAP = new Map<string, string>()
  .set(Constants.REMOVE_HANDLE_TYPE, 'assets/img/delete.svg')
  .set(Constants.PROPERTIES_HANDLE_TYPE, 'assets/img/cog.svg');

const HANDLE_ICON_SIZE = new Map<string, dia.Size>()
  .set(Constants.REMOVE_HANDLE_TYPE, {width: 10, height: 10})
  .set(Constants.PROPERTIES_HANDLE_TYPE, {width: 11, height: 11});

const DECORATION_ICON_MAP = new Map<string, string>()
  .set(Constants.ERROR_DECORATION_KIND, 'assets/img/error.svg');

const ELEMENT_TYPE_COMPONENT_TYPE = new Map<string, Type<ElementComponent>>()
  .set(joint.shapes.flo.NODE_TYPE, NodeComponent)
  .set(joint.shapes.flo.DECORATION_TYPE, DecorationComponent)
  .set(joint.shapes.flo.HANDLE_TYPE, HandleComponent);

@Injectable()
export class RenderService implements Flo.Renderer {

  constructor(
    private componentFactoryResolver?: ComponentFactoryResolver,
    private injector?: Injector,
    private applicationRef?: ApplicationRef
  ) {}

  createHandle(kind: string, parent: dia.Cell) {
    console.log('createHandle', kind);
    return new joint.shapes.flo.ErrorDecoration({
      size: HANDLE_ICON_SIZE.get(kind),
      attrs: {
        'image': {
          'xlink:href': HANDLE_ICON_MAP.get(kind)
        }
      }
    });
  }

  createDecoration(kind: string, parent: dia.Cell) {
    console.log('createDecoration', kind);
    return new joint.shapes.flo.ErrorDecoration({
      size: {width: 16, height: 16},
      attrs: {
        'image': {
          'xlink:href': DECORATION_ICON_MAP.get(kind)
        }
      }
    });
  }

  createNode(metadata: Flo.ElementMetadata): dia.Element {
    console.log('createNode', metadata.group, metadata.name);
    if (metadata.group === 'task') {
      return new TaskAppShape(
        defaultsDeep({
          attrs: {
            '.label': {
              'text': metadata.name
            }
          }
        }, TaskAppShape.prototype.defaults)
      );
    } else if (metadata.name === 'START') {
      return new BatchStartShape(
        defaultsDeep({
          attrs: {
            '.label': {
              'text': metadata.name
            }
          }
        }, BatchStartShape.prototype.defaults)
      );
    } else if (metadata.name === 'END') {
      return new BatchEndShape(
        defaultsDeep({
          attrs: {
            '.label': {
              'text': metadata.name
            }
          }
        }, BatchEndShape.prototype.defaults)
      );
    } else if (metadata.name === 'sync') {
      return new BatchSyncShape(
        defaultsDeep({
          attrs: {
            '.label': {
              'text': metadata.name
            }
          }
        }, BatchSyncShape.prototype.defaults)
      );
    }
  }

  createLink() {
    return new BatchLink();
  }

  layout(paper) {
    return Promise.resolve(layout(paper));
  }

  getNodeView(): dia.ElementView {
    console.log('getNodeView');
    const self = this;

    return joint.dia.ElementView.extend({
      options: defaultsDeep({}, joint.dia.ElementView.prototype.options),

      renderMarkup: function () {
        // Not called often. It's fine to destro old component and create the new one, because old DOM
        // may have been aletered by JointJS updates
        if (self.componentFactoryResolver && ELEMENT_TYPE_COMPONENT_TYPE.has(this.model.get('type'))) {
          if (this._angularComponentRef) {
            this._angularComponentRef.destroy();
          }
          const nodeComponentFactory = self.componentFactoryResolver
            .resolveComponentFactory(ELEMENT_TYPE_COMPONENT_TYPE.get(this.model.get('type')));

          const componentRef: ComponentRef<ElementComponent> = nodeComponentFactory.create(self.injector);
          self.applicationRef.attachView(componentRef.hostView);
          componentRef.instance.view = this;
          this._angularComponentRef = componentRef;
          const nodes = [];
          for (let i = 0; i < this._angularComponentRef.location.nativeElement.children.length; i++) {
            nodes.push(this._angularComponentRef.location.nativeElement.children.item(i));
          }

          const vNodes = nodes.map(childNode => new joint.V(childNode));
          this.vel.append(vNodes);

          this._angularComponentRef.changeDetectorRef.markForCheck();
          this._angularComponentRef.changeDetectorRef.detectChanges();
        } else {
          joint.dia.ElementView.prototype.renderMarkup.apply(this, arguments);
        }
      },

      onRemove: function() {
        if (this._angularComponentRef) {
          this._angularComponentRef.destroy();
        }
        joint.dia.ElementView.prototype.onRemove.apply(this, arguments);
      },

    });

  }
}
