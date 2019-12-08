import { Injectable } from '@angular/core';
import { Flo } from 'spring-flo';
import { CONTROL_GROUP_TYPE, END_NODE_TYPE, START_NODE_TYPE, SYNC_NODE_TYPE, TASK_GROUP_TYPE } from './support/shapes';
import { dia, g } from 'jointjs';
import * as _joint from 'jointjs';
import { Utils } from '../../../shared/flo/support/utils';
import { arrangeAll } from './support/layout';

const joint: any = _joint;

const DND_ENABLED = true; // Is smart DnD enabled?

/**
 * Flo service class for its Editor used for composed tasks.
 *
 * @author Janne Valkealahti
 * @author Alex Boyko
 */
@Injectable()
export class EditorService implements Flo.Editor {

  TASK_PALETTE_WIDTH = 265;

  constructor() {
  }

  allowLinkVertexEdit = true;

  /**
   * Creates a default content for flo editor. These are outside of what
   * is in dsl and i.e. composed tasks always need to create start and end nodes.
   *
   * @param {Flo.EditorContext} editorContext the flo editor context
   * @param {Map<string, Map<string, Flo.ElementMetadata>>} elementMetadata the element metadata
   */
  setDefaultContent(editorContext: Flo.EditorContext, data: Map<string, Map<string, Flo.ElementMetadata>>): void {
    // Make sure context is clear before anything default content is created
    editorContext.getGraph().clear();
    editorContext.createNode(data.get(CONTROL_GROUP_TYPE).get(START_NODE_TYPE));
    editorContext.createNode(data.get(CONTROL_GROUP_TYPE).get(END_NODE_TYPE));
    arrangeAll(editorContext);
  }

  validateLink(flo: Flo.EditorContext, cellViewS: dia.ElementView, magnetS: SVGElement, cellViewT: dia.ElementView,
               magnetT: SVGElement, isSource: boolean, linkView: dia.LinkView): boolean {
    // Connections only between magnets/ports
    if (!magnetS || !magnetT) {
      return false;
    }
    // Prevent linking from input ports.
    if (magnetS && magnetS.getAttribute('type') === 'input') {
      return false;
    }
    // Prevent linking from output ports to input ports within one element.
    if (cellViewS === cellViewT) {
      return false;
    }
    // Prevent linking to input ports.
    if (magnetT && magnetT.getAttribute('type') === 'output') {
      return false;
    }

    /*
     * See if that can prevented...
     * Not bringing code handling the use case over because it doesn't work
     *
     * Prevent the case below
     *
     *                   |
     *                   |
     *                  \|/
     *   ______        ______
     *   |  A |__new__\| B  |
     *   |____|       /|____|
     *      |
     *      |
     *     \|/
     *
     *
     */

    return true;
  }

  private validateConnectedLinks(graph: dia.Graph, element: dia.Element, markers: Array<Flo.Marker>) {
    if (element.attr('metadata') && !Utils.isUnresolved(element)) {
      const type = element.attr('metadata/name');
      const incoming = graph.getConnectedLinks(element, { inbound: true });
      const outgoing = graph.getConnectedLinks(element, { outbound: true });

      // Verify that there is no more than link with the same 'ExitStatus' coming out
      // Verify there are no outgoing links to same type tasks (to duplicates)
      const exitStatusNumber = new Map<string, number>();
      outgoing.filter(l => l.attr('props/ExitStatus')).forEach(l => {
        const exitStatus = l.attr('props/ExitStatus');
        const number = exitStatusNumber.get(l.attr('props/ExitStatus'));
        if (typeof number === 'number') {
          exitStatusNumber.set(exitStatus, number + 1);
        } else {
          exitStatusNumber.set(exitStatus, 1);
        }
      });
      Array.from(exitStatusNumber.keys())
        .filter(status => exitStatusNumber.get(status) && exitStatusNumber.get(status) > 1)
        .forEach(exitStatus => markers.push({
          severity: Flo.Severity.Error,
          message: `${exitStatusNumber.get(exitStatus)} links with Exit Status "${exitStatus}". Should only be one such link`,
          range: element.attr('range')
        }));

      let link;
      if (type === START_NODE_TYPE) {
        if (incoming.length !== 0) {
          markers.push({
            severity: Flo.Severity.Error,
            message: `${type} node can only have outgoing links`,
            range: element.attr('range')
          });
        }
        link = outgoing.find(l => l.attr('props/ExitStatus'));
        if (link) {
          markers.push({
            severity: Flo.Severity.Error,
            message: 'Links from START should not specify an Exit Status',
            range: element.attr('range')
          });
        }
      } else if (type === END_NODE_TYPE) {
        if (incoming.length === 0) {
          markers.push({
            severity: Flo.Severity.Error,
            message: 'End state does not have anything leading to it',
            range: element.attr('range')
          });
        }
      } else if (type === SYNC_NODE_TYPE) {
        if (incoming.length === 0) {
          markers.push({
            severity: Flo.Severity.Error,
            message: 'Must have incoming links',
            range: element.attr('range')
          });
        }
        if (outgoing.length === 0) {
          markers.push({
            severity: Flo.Severity.Error,
            message: 'Must have outgoing links',
            range: element.attr('range')
          });
        }
        link = outgoing.find(l => l.attr('props/ExitStatus'));
        if (link) {
          markers.push({
            severity: Flo.Severity.Error,
            message: 'Links should not specify an Exit Status',
            range: element.attr('range')
          });
        }
      } else {
        if (incoming.length === 0) {
          markers.push({
            severity: Flo.Severity.Error,
            message: 'Must have an incoming link',
            range: element.attr('range')
          });
        }
        if (outgoing.length === 0) {
          markers.push({
            severity: Flo.Severity.Error,
            message: 'Must have an outgoing link',
            range: element.attr('range')
          });
        } else {
          link = outgoing.find(l => !l.attr('props/ExitStatus'));
          if (!link) {
            markers.push({
              severity: Flo.Severity.Error,
              message: 'Must have at least one outgoing link with no Exit Status condition specified',
              range: element.attr('range')
            });
          }
        }
      }
    }
  }

  /**
   * Verify any supplied properties are allowed according to the metadata specification
   * for the element.
   */
  private validateProperties(element: dia.Element, markers: Array<Flo.Marker>): Promise<void> {
    return new Promise((resolve) => {
      const specifiedProperties = element.attr('props');
      if (specifiedProperties) {
        const propertiesRanges = element.attr('propertiesranges');
        const appSchema = element.attr('metadata');
        appSchema.properties().then(appSchemaProperties => {
          if (!appSchemaProperties) {
            appSchemaProperties = new Map<string, Flo.PropertyMetadata>();
          }
          Object.keys(specifiedProperties).forEach(propertyName => {
            const allProperties: Flo.PropertyMetadata[] = Array.from(appSchemaProperties.values());
            const property = allProperties.find(p => p.name === propertyName || p.id === propertyName);
            if (!property) {
              const range = propertiesRanges ? propertiesRanges[propertyName] : null;
              markers.push({
                severity: Flo.Severity.Error,
                message: 'unrecognized option \'' + propertyName + '\' for app \'' +
                  element.attr('metadata/name') + '\'',
                range: range
              });
            }
          });
          resolve();
        });
      } else {
        // nothing to check, simply resolve the promise
        resolve();
      }
    });
  }

  private validateMetadata(element: dia.Cell, errors: Array<Flo.Marker>) {
    // Unresolved elements validation
    if (!element.attr('metadata') || Utils.isUnresolved(element)) {
      let msg = `Unknown element '${element.attr('metadata/name')}'`;
      if (element.attr('metadata/group')) {
        msg += ` from group '${element.attr('metadata/group')}'.`;
      }
      errors.push({
        severity: Flo.Severity.Error,
        message: msg,
        range: element.attr('range')
      });
    }
  }

  private validateNode(graph: dia.Graph, element: dia.Element): Promise<Array<Flo.Marker>> {
    return new Promise((resolve) => {
      const markers: Array<Flo.Marker> = [];
      this.validateMetadata(element, markers);
      this.validateConnectedLinks(graph, element, markers);
      this.validateProperties(element, markers).then(() => {
        resolve(markers);
      });
    });
  }

  validate(graph: dia.Graph, dsl: string, flo: Flo.EditorContext): Promise<Map<string | number, Flo.Marker[]>> {
    return new Promise(resolve => {
      const markers: Map<string | number, Array<Flo.Marker>> = new Map();
      const promises: Promise<void>[] = [];
      graph.getElements().filter(e => !e.get('parent') && e.attr('metadata')).forEach(e => {
        promises.push(new Promise<void>((nodeFinished) => {
          this.validateNode(graph, e).then((result) => {
            markers.set(e.id, result);
            nodeFinished();
          });
        }));
      });
      Promise.all(promises).then(() => {
        resolve(markers);
      });
    });
  }

  private hasIncomingPort(element: dia.Element): boolean {
    return element.attr('metadata/group') !== CONTROL_GROUP_TYPE || element.attr('metadata/name') !== START_NODE_TYPE;
  }

  private hasOutgoingPort(element: dia.Element): boolean {
    return element.attr('metadata/group') !== CONTROL_GROUP_TYPE || element.attr('metadata/name') !== END_NODE_TYPE;
  }

  calculateDragDescriptor(flo: Flo.EditorContext, draggedView: dia.CellView, viewUnderMouse: dia.CellView,
                          point: g.Point, sourceComponent: string): Flo.DnDDescriptor {

    const targetUnderMouse = viewUnderMouse ? viewUnderMouse.model : undefined;

    if (!DND_ENABLED || flo.getGraph().getConnectedLinks(draggedView.model).length > 0) {
      return {
        sourceComponent: sourceComponent,
        source: {
          view: draggedView
        }
      };
    }
    // check if it's a tap being dragged
    const source = <dia.Element> draggedView.model;

    // Find closest port
    const range = 30;
    const graph = flo.getGraph();
    const paper = flo.getPaper();
    let closestData;
    let minDistance = Number.MAX_VALUE;
    const hasIncomingPort = this.hasIncomingPort(source);
    const hasOutgoingPort = this.hasOutgoingPort(source);
    if (!hasIncomingPort && !hasOutgoingPort) {
      return;
    }
    const elements = graph.findModelsInArea(joint.g.rect(point.x - range, point.y - range, 2 * range, 2 * range));
    if (Array.isArray(elements)) {
      elements.map(m => paper.findViewByModel(m))
        .filter(v => v && v !== draggedView && v.model instanceof joint.dia.Element)
        .forEach(view => {
          const targetModel = <dia.Element> view.model;
          const targetHasIncomingPort = this.hasOutgoingPort(targetModel);
          const targetHasOutgoingPort = this.hasOutgoingPort(targetModel);
          view.$('[magnet]').each((index, magnet) => {
            const port = magnet.getAttribute('port');
            if ((port === 'input' && targetHasIncomingPort && hasOutgoingPort)
              || (port === 'output' && targetHasOutgoingPort && hasIncomingPort)) {
              const bbox = joint.V(magnet).bbox(false, paper.viewport);
              const distance = point.distance({
                x: bbox.x + bbox.width / 2,
                y: bbox.y + bbox.height / 2
              });
              if (distance < range && distance < minDistance) {
                minDistance = distance;
                closestData = {
                  sourceComponent: sourceComponent,
                  source: {
                    cssClassSelector: port === 'output' ? '.input-port' : '.output-port',
                    view: draggedView
                  },
                  target: {
                    cssClassSelector: '.' + magnet.getAttribute('class').split(/\s+/)[0],
                    view: view
                  },
                  range: minDistance
                };
              }
            }
          });
        });
    }
    if (closestData) {
      return closestData;
    }

    // Check if drop on a link is allowed
    if (targetUnderMouse instanceof joint.dia.Link) {
      return {
        sourceComponent: sourceComponent,
        source: {
          view: draggedView
        },
        target: {
          view: paper.findViewByModel(targetUnderMouse)
        }
      };
    }

  }

  private moveNodeOnNode(flo: Flo.EditorContext, node: dia.Element, pivotNode: dia.Element, side: string,
                         shouldRepairDamage: boolean) {
    side = side || 'left';
    // if (this.canSwap(flo, node, pivotNode, side)) {
    if (side === 'left') {
      const sources: Array<string> = [];
      if (shouldRepairDamage) {
        this.repairDamage(flo, node);
      }
      flo.getGraph().getConnectedLinks(pivotNode, { inbound: true }).forEach(link => {
        sources.push(link.get('source').id);
        link.remove();
      });
      sources.forEach(source => {
        flo.createLink({
          'id': source,
          'selector': '.output-port',
          'port': 'output'
        }, {
          'id': node.id,
          'selector': '.input-port',
          'port': 'input'
        });
      });
      flo.createLink({
        'id': node.id,
        'selector': '.output-port',
        'port': 'output'
      }, {
        'id': pivotNode.id,
        'selector': '.input-port',
        'port': 'input'
      });
    } else if (side === 'right') {
      const targets: Array<string> = [];
      if (shouldRepairDamage) {
        this.repairDamage(flo, node);
      }
      flo.getGraph().getConnectedLinks(pivotNode, { outbound: true }).forEach(link => {
        targets.push(link.get('target').id);
        link.remove();
      });
      targets.forEach(target => {
        flo.createLink({
          'id': node.id,
          'selector': '.output-port',
          'port': 'output'
        }, {
          'id': target,
          'selector': '.input-port',
          'port': 'input'
        });
      });
      flo.createLink({
        'id': pivotNode.id,
        'selector': '.output-port',
        'port': 'output'
      }, {
        'id': node.id,
        'selector': '.input-port',
        'port': 'input'
      });
    }
    // }
  }

  private moveNodeOnLink(flo: Flo.EditorContext, node: dia.Element, link: dia.Link, shouldRepairDamage?: boolean) {
    const source = link.get('source').id;
    const target = link.get('target').id;

    if (shouldRepairDamage) {
      this.repairDamage(flo, node);
    }
    link.remove();

    if (source) {
      flo.createLink({
        id: source,
        selector: '.output-port',
        port: 'output'
      }, {
        id: node.id,
        selector: '.input-port',
        port: 'input'
      });
    }
    if (target) {
      flo.createLink({
        id: node.id,
        selector: '.output-port',
        port: 'output'
      }, {
        id: target,
        selector: '.input-port',
        port: 'input'
      });
    }
  }

  handleNodeDropping(flo: Flo.EditorContext, dragDescriptor: Flo.DnDDescriptor): void {
    // TODO Should only do something if thing being dropped has no links
    if (!DND_ENABLED) {
      return;
    }
    const source = dragDescriptor.source ? dragDescriptor.source.view : undefined;
    const target = dragDescriptor.target ? dragDescriptor.target.view : undefined;
    if (source instanceof joint.dia.ElementView && target instanceof joint.dia.ElementView) {
      if (dragDescriptor.target.cssClassSelector === '.output-port') {
        this.moveNodeOnNode(flo, <dia.Element> source.model, <dia.Element> target.model, 'right', false);
      } else if (dragDescriptor.target.cssClassSelector === '.input-port') {
        this.moveNodeOnNode(flo, <dia.Element> source.model, <dia.Element> target.model, 'left', false);
      }
    } else if (source instanceof joint.dia.ElementView && target instanceof joint.dia.LinkView) {
      this.moveNodeOnLink(flo, <dia.Element> source.model, <dia.Link> target.model);
    }
  }

  private repairDamage(flo: Flo.EditorContext, node: dia.Element) {
    /*
     * remove incoming, outgoing links and cache their sources and targets not equal to current node
     */
    const sources: Array<string> = [];
    const targets: Array<string> = [];
    const i = 0;
    flo.getGraph().getConnectedLinks(node).forEach(link => {
      const targetId = link.get('target').id;
      const sourceId = link.get('source').id;
      if (targetId === node.id) {
        link.remove();
        sources.push(sourceId);
      } else if (sourceId === node.id) {
        link.remove();
        targets.push(targetId);
      }
    });
    /*
     * best attempt to connect source and targets bypassing the node
     */
    if (sources.length === 1) {
      const source = sources[0];
      // TODO: replace selector CSS class with the result of view.getSelector(...)
      targets.forEach(target => flo.createLink({
        'id': source,
        'selector': '.output-port',
        'port': 'output'
      }, {
        'id': target,
        'selector': '.input-port',
        'port': 'input'
      }));
    } else if (targets.length === 1) {
      const target = targets[0];
      sources.forEach(source => flo.createLink({
        'id': sources[i],
        'selector': '.output-port',
        'port': 'output'
      }, {
        'id': target,
        'selector': '.input-port',
        'port': 'input'
      }));
    }
  }

}
