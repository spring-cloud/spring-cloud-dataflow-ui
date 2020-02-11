import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, Injector, Type } from '@angular/core';
import { Constants, Flo } from 'spring-flo';
import { dia } from 'jointjs';
import { defaultsDeep } from 'lodash';
import { BsModalService } from 'ngx-bootstrap';
import { MetamodelService } from './metamodel.service';
import {
  TaskAppShape, BatchSyncShape, BatchLink, BatchStartShape, BatchEndShape,
  CONTROL_GROUP_TYPE, START_NODE_TYPE, END_NODE_TYPE, SYNC_NODE_TYPE, NODE_ROUNDED_CORNER, NODE_ROUNDED_CORNER_PALETTE
} from './support/shapes';
import { layout } from './support/layout';
import { ElementComponent } from '../../../shared/flo/support/shape-component';
import { TaskNodeComponent } from './node/task-node.component';
import * as _joint from 'jointjs';
import { TaskPropertiesDialogComponent } from './properties/task-properties-dialog-component';
import { TaskGraphPropertiesSource } from './properties/task-properties-source';
import { LoggerService } from '../../../shared/services/logger.service';
import { createPaletteGroupHeader } from '../../../shared/flo/support/shared-shapes';
import { ViewUtils } from '../../../shared/flo/support/view-utils';

const joint: any = _joint;

const ELEMENT_TYPE_COMPONENT_TYPE = new Map<string, Type<ElementComponent>>()
  .set(joint.shapes.flo.NODE_TYPE, TaskNodeComponent);

const COMPOSED_TASK_PALETTE_SIZE = { width: 120, height: 30 };
const COMPOSED_TASK_CANVAS_SIZE = { width: 180, height: 42 };
const SYNC_PALETTE_SIZE = { width: 80, height: 30 };
const SYNC_CANVAS_SIZE = { width: 100, height: 40 };

/**
 * Flo service class for its Renderer used for composed tasks.
 *
 * @author Janne Valkealahti
 * @author Alex Boyko
 */
@Injectable()
export class RenderService implements Flo.Renderer {

  constructor(private metamodelService: MetamodelService,
              private bsModalService: BsModalService,
              private componentFactoryResolver?: ComponentFactoryResolver,
              private injector?: Injector,
              private applicationRef?: ApplicationRef) {
  }


  markersChanged(cell: dia.Cell, paper: dia.Paper) {
    const markers: Array<Flo.Marker> = cell.get('markers');
    const view = paper.findViewByModel(cell);
    if (view) {
      joint.V(view.el).toggleClass('validation-errors', markers.length > 0);
    }
  }

  /**
   * Creates a node with a supported types. Called with
   * types shown in flo editor.
   *
   * @param {Flo.ElementMetadata} metadata the element metadata
   * @returns {dia.Element} the created element
   */
  createNode(viewerDescriptor: Flo.ViewerDescriptor, metadata: Flo.ElementMetadata): dia.Element {
    const isPalette = viewerDescriptor.paper.model.get('type') === Constants.PALETTE_CONTEXT;
    switch (metadata.name) {
      case START_NODE_TYPE:
        return new BatchStartShape(
          defaultsDeep({
            attrs: {
              '.name-label': {
                'text': metadata.name
              }
            }
          }, BatchStartShape.prototype.defaults)
        );
      case END_NODE_TYPE:
        return new BatchEndShape(
          defaultsDeep({
            attrs: {
              '.name-label': {
                'text': metadata.name
              }
            }
          }, BatchEndShape.prototype.defaults)
        );
      case SYNC_NODE_TYPE:
        return new BatchSyncShape(
          defaultsDeep({
            size: isPalette ? SYNC_PALETTE_SIZE : SYNC_CANVAS_SIZE,
            attrs: {
              '.name-label': {
                'text': metadata.name
              },
              '.palette-entry-name-label': {
                text: metadata.name
              },
              '.type-label': {
                text: metadata.name.toUpperCase()
              }
            }
          }, BatchSyncShape.prototype.defaults)
        );
      default:
        return new TaskAppShape(
          defaultsDeep({
            size: isPalette ? COMPOSED_TASK_PALETTE_SIZE : COMPOSED_TASK_CANVAS_SIZE,
            attrs: {
              '.box': {
                rx: isPalette ? NODE_ROUNDED_CORNER_PALETTE : NODE_ROUNDED_CORNER,
                ry: isPalette ? NODE_ROUNDED_CORNER_PALETTE : NODE_ROUNDED_CORNER,
              },
              '.name-label': {
                'text': metadata.name
              },
              '.palette-entry-name-label': {
                text: metadata.name
              },
              '.type-label': {
                text: metadata.name.toUpperCase()
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
    this.metamodelService.load().then(function (metamodel) {
      link.attr('metadata', metamodel.get('links').get('transition'));
    });
    return link;
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
      const modalRef = this.bsModalService.show(TaskPropertiesDialogComponent, { class: 'modal-properties' });
      modalRef.content.name = `${link.attr('metadata/name')}`;
      modalRef.content.type = `TASK`;
      modalRef.content.setData(new TaskGraphPropertiesSource(link));
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
          const isPalette = viewerDescriptor.paper.model.get('type') === Constants.PALETTE_CONTEXT;
          if (isPalette) {
            ViewUtils.fitLabelWithFixedLocation(viewerDescriptor.paper, node, '.palette-entry-name-label', node.attr('.palette-entry-name-label/refX'));
            // ViewUtils.fitLabel(viewerDescriptor.paper, node, '.palette-entry-name-label', 10, 10);

          } else {
            ViewUtils.fitLabel(viewerDescriptor.paper, node, '.name-label', 10, 10);

            // ViewUtils.fitLabelWithFixedLocation(viewerDescriptor.paper, node, '.name-label', node.attr('.name-label/refX'));
            // ViewUtils.fitLabelWithFixedLocation(viewerDescriptor.paper, node, '.type-label', node.attr('.type-label/refX'));
          }
        }
      }
    }
  }

  refreshVisuals(element: dia.Cell, changedPropertyPath: string, paper: dia.Paper) {
    if (element instanceof joint.dia.Element && element.attr('metadata')) {
      if (changedPropertyPath === 'node-label') {
        const nodeLabel = element.attr('node-label');
        // fitLabel() calls update as necessary, so set label text silently
        element.attr('.name-label/text', nodeLabel ? nodeLabel : element.attr('metadata/name'));
        // ViewUtils.fitLabelWithFixedLocation(paper, <dia.Element> element, '.name-label', element.attr('.name-label/refX'));

        // Update the view to get default label visuals showing without truncation.
        (<dia.ElementView>paper.findViewByModel(element)).update();
        ViewUtils.fitLabel(paper, <dia.Element> element, '.name-label', 10, 10);
      }
    }

    if (element instanceof joint.dia.Link && element.attr('metadata')) {

      if (changedPropertyPath === 'props/ExitStatus') {
        // If the exitstatus has been changed from blank to something then this
        // may leave no default link from the node at the source of the link since 'element' was
        // previously the default link. In this case add a new default link if a suitable
        // target can be determined. If no target can be computed, a validation error will remind
        // the user that they must add one.
        const link = <joint.dia.Link> element;
        const newExitStatus = link.attr('props/ExitStatus') || '';
        const currentLabels = link.labels();
        const currentText = Array.isArray(currentLabels) && currentLabels.length > 0 ? currentLabels[0].attrs.text.text : '';
        if (newExitStatus.length !== 0 && currentText.length === 0) {
          let hasDefaultLink = false;
          const relatedLinks = paper.model.getConnectedLinks(element.get('source'), { outbound: true });
          for (let i = 0; i < relatedLinks.length; i++) {
            const relatedLink = relatedLinks[i];
            if (relatedLink === element) {
              continue;
            }
            const exitStatus = relatedLink.attr('props/ExitStatus') || '';
            if (exitStatus.length === 0) {
              // This is a 'default' link
              hasDefaultLink = true;
              break;
            }
          }
          if (!hasDefaultLink) {
            // Create a new default (no specified exit status) link
            const newDefaultLink = this.createLink();
            const sourceNodeId = element.get('source').id;
            const outgoingLinks = paper.model.getConnectedLinks(element.get('target'), { outbound: true });
            const defaultLink = outgoingLinks.find(l => {
              const exitStatus = l.attr('props/ExitStatus');
              return !exitStatus || exitStatus.length === 0;
            });
            if (defaultLink) {
              // configure link from existing source to targets target
              newDefaultLink.set('source', {
                id: sourceNodeId,
                port: 'output',
                selector: '.output-port'
              });
              newDefaultLink.set('target', {
                id: defaultLink.get('target').id,
                port: 'input',
                selector: '.input-port'
              });
              paper.model.addCell(newDefaultLink);
              newDefaultLink.attr('.marker-vertices/display', 'none');
            }
          }
        }


        setTimeout(() => {
          link.labels([
            {
              position: {
                distance: 0.5
              },
              attrs: {
                text: {
                  text: newExitStatus,
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
        });
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
    const sourceLabel = sourceElement.model.attr('.name-label/text');
    const targetLabel = targetElement.model.attr('.name-label/text');
    // Set the visual label for exitStatus
    this.refreshVisuals(link, 'props/ExitStatus', paper);
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
    LoggerService.log('getNodeView');
    const self = this;

    return joint.shapes.flo.ElementView.extend({
      options: defaultsDeep({}, joint.dia.ElementView.prototype.options),

      renderMarkup: function () {
        // Not called often. It's fine to destroy old component and create the new one, because old DOM
        // may have been altered by JointJS updates
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

      onRemove: function () {
        if (this._angularComponentRef) {
          this._angularComponentRef.destroy();
        }
        joint.dia.ElementView.prototype.onRemove.apply(this, arguments);
      },

    });

  }

  getPaletteRenderer() {
    return {
      createGroupHeader: createPaletteGroupHeader
    };
  }
}
