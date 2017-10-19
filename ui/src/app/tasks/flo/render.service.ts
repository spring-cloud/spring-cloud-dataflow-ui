import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, Injector, Type } from '@angular/core';
import { Constants, Flo } from 'spring-flo';
import { dia } from 'jointjs';
import { defaultsDeep } from 'lodash';
import { BsModalService } from 'ngx-bootstrap';
import { MetamodelService} from './metamodel.service';
import {
  TaskAppShape, BatchSyncShape, BatchLink, BatchStartShape, BatchEndShape,
  CONTROL_GROUP_TYPE, IMAGE_W
} from './support/shapes';
import { layout } from './support/layout';
import { ElementComponent } from '../../shared/flo/support/shape-component';
import { NodeComponent } from './node/node.component';
import { DecorationComponent } from '../../shared/flo/decoration/decoration.component';
import { HandleComponent } from '../../shared/flo/handle/handle.component';
import * as _joint from 'jointjs';
import { TaskPropertiesDialogComponent } from './properties/task-properties-dialog-component';
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

const HORIZONTAL_PADDING = 5;

/**
 * Flo service class for its Renderer used for composed tasks.
 *
 * @author Janne Valkealahti
 * @author Alex Boyko
 */
@Injectable()
export class RenderService implements Flo.Renderer {

  constructor(
    private metamodelService: MetamodelService,
    private bsModalService: BsModalService,
    private componentFactoryResolver?: ComponentFactoryResolver,
    private injector?: Injector,
    private applicationRef?: ApplicationRef
  ) {}

  /**
   * Creates handle in flo cells.
   *
   * @param {string} kind the cell type
   * @param {dia.Cell} parent the owner
   */
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

  /**
   * Creates decuration in flo cells.
   *
   * @param {string} kind the cell type
   * @param {dia.Cell} parent the owner
   */
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

  /**
   * Creates a node with a supported types. Called with
   * types shown in flo editor.
   *
   * @param {Flo.ElementMetadata} metadata the element metadata
   * @returns {dia.Element} the created element
   */
  createNode(metadata: Flo.ElementMetadata): dia.Element {
    if (metadata.name === 'START') {
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
    } else {
      return new TaskAppShape(
        defaultsDeep({
          attrs: {
            '.label': {
              'text': metadata.name
            }
          }
        }, TaskAppShape.prototype.defaults)
      );
    }
  }

  /**
   * Creates a link used to link nodes. For now we
   * only have one node link type.
   */
  createLink() {
    const link = new BatchLink();
    this.metamodelService.load().then(function(metamodel) {
      link.attr('metadata', metamodel.get('links').get('transition'));
    });
    return link;
  }

  fitLabel(paper: dia.Paper, node: dia.Element, labelPath: string) {
    const view = paper.findViewByModel(node);
    if (view) {
      (<any>view).update();
      const textView = view.findBySelector(labelPath.substr(0, labelPath.indexOf('/')))[0];
      let width = joint.V(textView).bbox(false, paper.viewport).width;
      const label = node.attr(labelPath);
      const threshold = IMAGE_W - HORIZONTAL_PADDING - HORIZONTAL_PADDING;
      for (let i = 1; i < label.length && width > threshold; i++) {
        (<any>node).attr(labelPath, label.substr(0, label.length - i) + '\u2026', {silent: true});
        (<any>view).update();
        width = joint.V(textView).bbox(false, paper.viewport).width;
      }
    }
  }

  /**
   * Handles events from link. These will happen for various
   * events like connects and disconnects. Also delete and options
   * are sent as events.
   *
   * @param {Flo.EditorContext} context the editor context
   * @param {string} event the event type
   * @param {dia.Link} link the link
   */
  handleLinkEvent(context: Flo.EditorContext, event: string, link: dia.Link): void {
    if (event === 'options') {
      // TODO, doesn't really work, maybe flo issue
      const modalRef = this.bsModalService.show(TaskPropertiesDialogComponent);
      modalRef.content.title = `Properties for ${link.attr('metadata/name').toUpperCase()}`;
      modalRef.content.setData(link, context.getGraph());
    }
  }

  initializeNewNode(node: dia.Element, viewerDescriptor: Flo.ViewerDescriptor) {
    const metadata: Flo.ElementMetadata = node.attr('metadata');
    if (metadata) {
      if (metadata.group === CONTROL_GROUP_TYPE) {
        // nothing to do here yet for control nodes
      } else {
        node.attr('.image/xlink:href', metadata && metadata.icon ? metadata.icon : 'icons/xd/unknown.png');
        if (viewerDescriptor.paper) {
          this.fitLabel(viewerDescriptor.paper, node, '.label/text');
        }
      }
    }
  }

  refreshVisuals(element: dia.Cell, changedPropertyPath: string, paper: dia.Paper) {
    if (element instanceof joint.dia.Element && element.attr('metadata')) {
      if (changedPropertyPath === 'node-label') {
        const nodeLabel = element.attr('node-label');
        // fitLabel() calls update as necessary, so set label text silently
        element.attr('.label/text', nodeLabel ? nodeLabel : element.attr('metadata/name'));
        this.fitLabel(paper, <dia.Element> element, '.label/text');
      }
    }

    if (element instanceof joint.dia.Link && element.attr('metadata')) {
      if (changedPropertyPath === 'props/ExitStatus') {
        element.set('labels', [
          {
            position: 0.5,
            attrs: {
              text: {
                text: element.attr('props/ExitStatus') || '',
                'stroke': 'black',
                'stroke-width': 1,
                'fill': 'black'
              },
              rect: {
                'fill': 'transparent',
                'stroke-width': 0
              }
            }
          }
        ]);
        const view = paper.findViewByModel(element);
        if (element.attr('props/ExitStatus')) {
          view.$('.connection, .marker-source, .marker-target').toArray()
            .forEach(c => joint.V(c).addClass('composed-task-graph-transition'));
        } else {
          view.$('.connection, .marker-source, .marker-target').toArray()
            .forEach(c => joint.V(c).removeClass('composed-task-graph-transition'));
        }
      }
    }
  }

  /**
   * After a link is constructed it is initialized, this is a chance to fill in the label for it
   * (which is used as the title in the properties view for it).
   */
  initializeNewLink(link: dia.Link, context: Flo.ViewerDescriptor) { // context contains paper and graph
    const paper = context.paper;
    const sourceId = link.get('source');
    const targetId = link.get('target');
    const sourceElement = paper.findViewByModel(sourceId);
    const targetElement = paper.findViewByModel(targetId);
    const sourceLabel = sourceElement.model.attr('.label/text');
    const targetLabel = targetElement.model.attr('.label/text');
    link.attr('.label/text', `Link from '${sourceLabel}' to '${targetLabel}'`);
    this.refreshVisuals(link, 'props/ExitStatus', paper); // TODO this was set early on, why is this call required here?
  }

  isSemanticProperty(propertyPath: string, element: dia.Cell) {
    return /.label*\/text/.test(propertyPath) ||
      propertyPath === 'node-label';
  }

  /**
   * Layout whole flo. For now just delegates to resolve.
   *
   * @param paper the flo paper
   * @returns {Promise<any>} a promise when layout has happened
   */
  layout(paper) {
    return Promise.resolve(layout(paper));
  }

  /**
   * Gets a node view for an element which is used to dynamically handle
   * some angular component instantiation.
   *
   * @returns {dia.ElementView} a element view
   */
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
