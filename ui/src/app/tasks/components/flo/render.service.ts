import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, Injector, Type } from '@angular/core';
import { Constants, Flo } from 'spring-flo';
import { dia } from 'jointjs';
import { defaultsDeep } from 'lodash';
import { BsModalService } from 'ngx-bootstrap';
import { MetamodelService } from './metamodel.service';
import {
  TaskAppShape, BatchSyncShape, BatchLink, BatchStartShape, BatchEndShape,
  CONTROL_GROUP_TYPE, IMAGE_W, START_NODE_TYPE, END_NODE_TYPE, SYNC_NODE_TYPE
} from './support/shapes';
import { layout } from './support/layout';
import { ElementComponent } from '../../../shared/flo/support/shape-component';
import { NodeComponent } from './node/node.component';
import { DecorationComponent } from '../../../shared/flo/decoration/decoration.component';
import { HandleComponent } from '../../../shared/flo/handle/handle.component';
import * as _joint from 'jointjs';
import { TaskPropertiesDialogComponent } from './properties/task-properties-dialog-component';
import { TaskGraphPropertiesSource } from './properties/task-properties-source';
import { LoggerService } from '../../../shared/services/logger.service';

const joint: any = _joint;

const HANDLE_ICON_MAP = new Map<string, string>()
  .set(Constants.REMOVE_HANDLE_TYPE, 'assets/img/delete.svg')
  .set(Constants.PROPERTIES_HANDLE_TYPE, 'assets/img/cog.svg');

const HANDLE_ICON_SIZE = new Map<string, dia.Size>()
  .set(Constants.REMOVE_HANDLE_TYPE, { width: 10, height: 10 })
  .set(Constants.PROPERTIES_HANDLE_TYPE, { width: 11, height: 11 });

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

  constructor(private metamodelService: MetamodelService,
              private bsModalService: BsModalService,
              private componentFactoryResolver?: ComponentFactoryResolver,
              private injector?: Injector,
              private applicationRef?: ApplicationRef) {
  }

  /**
   * Creates handle in flo cells.
   *
   * @param {string} kind the cell type
   * @param {dia.Cell} parent the owner
   */
  createHandle(kind: string, parent: dia.Cell) {
    LoggerService.log('createHandle', kind);
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
    LoggerService.log('createDecoration', kind);
    return new joint.shapes.flo.ErrorDecoration({
      size: { width: 16, height: 16 },
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
    switch (metadata.name) {
      case START_NODE_TYPE:
        return new BatchStartShape(
          defaultsDeep({
            attrs: {
              '.label': {
                'text': metadata.name
              }
            }
          }, BatchStartShape.prototype.defaults)
        );
      case END_NODE_TYPE:
        return new BatchEndShape(
          defaultsDeep({
            attrs: {
              '.label': {
                'text': metadata.name
              }
            }
          }, BatchEndShape.prototype.defaults)
        );
      case SYNC_NODE_TYPE:
        return new BatchSyncShape(
          defaultsDeep({
            attrs: {
              '.label': {
                'text': metadata.name
              }
            }
          }, BatchSyncShape.prototype.defaults)
        );
      default:
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
    this.metamodelService.load().then(function (metamodel) {
      link.attr('metadata', metamodel.get('links').get('transition'));
    });
    return link;
  }

  fitLabel(paper: dia.Paper, node: dia.Element, labelPath: string) {
    const view = paper.findViewByModel(node);
    if (view) {
      // (<any>view).update();
      const textView = view.findBySelector(labelPath.substr(0, labelPath.indexOf('/')))[0];
      let width = joint.V(textView).bbox(false, paper.viewport).width;
      const label = node.attr(labelPath);
      const threshold = IMAGE_W - HORIZONTAL_PADDING - HORIZONTAL_PADDING;

      if (width > threshold) {
        const styles = getComputedStyle(textView);
        const stylesObj: {} = {};
        for (let i = 0; i < styles.length; i++) {
          const property = styles.item(i);
          if (!property.startsWith('-')) {
            stylesObj[property] = styles.getPropertyValue(property);
          }
        }

        const svgDocument = joint.V('svg').node;
        const textSpan = joint.V('tspan').node;
        const textElement = joint.V('text').attr(stylesObj).append(textSpan).node;
        const textNode = document.createTextNode(label);

        // Prevent flickering
        textElement.style.opacity = 0;
        // Prevent FF from throwing an uncaught exception when `getBBox()`
        // called on element that is not in the render tree (is not measurable).
        // <tspan>.getComputedTextLength() returns always 0 in this case.
        // Note that the `textElement` resp. `textSpan` can become hidden
        // when it's appended to the DOM and a `display: none` CSS stylesheet
        // rule gets applied.
        textElement.style.display = 'block';
        textSpan.style.display = 'block';

        textSpan.appendChild(textNode);
        svgDocument.appendChild(textElement);

        document.body.appendChild(svgDocument);

        try {
          width = textSpan.getComputedTextLength();
          for (let i = 1; i < width && width > threshold; i++) {
            textNode.data = label.substr(0, label.length - i) + '\u2026';
            width = textSpan.getComputedTextLength();
          }
          node.attr(labelPath, textNode.data);
        } finally {
          document.body.removeChild(svgDocument);
        }
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
      const modalRef = this.bsModalService.show(TaskPropertiesDialogComponent);
      modalRef.content.title = `Properties for ${link.attr('metadata/name').toUpperCase()}`;
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
        // If the exitstatus has been changed from blank to something then this
        // may leave no default link from the node at the source of the link since 'element' was
        // previously the default link. In this case add a new default link if a suitable
        // target can be determined. If no target can be computed, a validation error will remind
        // the user that they must add one.
        const newExitStatus = element.attr('props/ExitStatus') || '';
        const currentLabels = element.get('labels');
        let currentText = '';
        try {
            currentText = currentLabels[0].attrs.text.text;
        } catch (e) {
            // Label or label value not accessible (so not set)
        }
        if (newExitStatus.length !== 0 && currentText.length === 0) {
            let hasDefaultLink = false;
            const relatedLinks = paper.model.getConnectedLinks(element.get('source'), {outbound: true});
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
                const outgoingLinks = paper.model.getConnectedLinks(element.get('target'), {outbound: true});
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


        element.set('labels', [
          {
            position: 0.5,
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

}
