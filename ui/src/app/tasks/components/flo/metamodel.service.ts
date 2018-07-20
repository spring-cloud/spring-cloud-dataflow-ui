import { Flo } from 'spring-flo';
import { Injectable } from '@angular/core';
import { ApplicationType } from '../../../shared/model/application-type';
import { SharedAppsService } from '../../../shared/services/shared-apps.service';
import { CONTROL_GROUP_TYPE, START_NODE_TYPE, END_NODE_TYPE, SYNC_NODE_TYPE, TASK_GROUP_TYPE } from './support/shapes';
import { ToolsService } from './tools.service';
import { Graph, Link, Node, TaskConversion } from './model/models';
import { AppMetadata } from '../../../shared/flo/support/app-metadata';

import * as _joint from 'jointjs';
import { LoggerService } from '../../../shared/services/logger.service';
import { arrangeAll } from './support/layout';

const joint: any = _joint;

/**
 * Flo service class for its Metamodel used for composed tasks.
 *
 * @author Janne Valkealahti
 * @author Alex Boyko
 */
@Injectable()
export class MetamodelService implements Flo.Metamodel {

  private COMPOSED_TASK_LABEL = 'label';

  private listeners: Array<Flo.MetamodelListener> = [];

  private request: Promise<Map<string, Map<string, Flo.ElementMetadata>>>;

  constructor(private appsService: SharedAppsService,
              private loggerService: LoggerService,
              private toolsService: ToolsService) {
  }

  /**
   * Converts text dsl into flo graph representation.
   *
   * @param {Flo.EditorContext} flo the flo editor context
   * @param {string} dsl the dsl
   * @returns {Promise<any>} a promise when conversion has happened
   */
  textToGraph(flo: Flo.EditorContext, dsl: string = ''): Promise<any> {
    return this.toolsService.parseTaskTextToGraph(dsl).toPromise()
      .then(taskConversion => {
        this.load().then(metamodel => {
          this.buildGraphFromJson(flo, taskConversion, metamodel);
        });
      });
  }

  /**
   * Converts graph in editor context into dsl. Return a dsl within a
   * promise.
   *
   * @param {Flo.EditorContext} flo the flo editor context
   * @returns {Promise<string>} a promise when conversion has happened
   */
  graphToText(flo: Flo.EditorContext): Promise<string> {
    const graphInInternalFormat = flo.getGraph();
    if (flo.getGraph().getElements().length === 0) {
      return Promise.resolve('');
    }
    const graphInCommonFormat = this.toGraph(graphInInternalFormat);
    return this.toolsService.convertTaskGraphToText(graphInCommonFormat)
      .map(taskConversion => {
        return taskConversion.dsl;
      }).toPromise();
  }

  subscribe(listener: Flo.MetamodelListener) {
    this.listeners.push(listener);
  }

  unsubscribe?(listener: Flo.MetamodelListener) {
    const index = this.listeners.indexOf(listener);
    if (index >= 0) {
      this.listeners.splice(index);
    }
  }

  /**
   * Loads element metadata. For now just delegates to refresh.
   *
   * @returns {Promise<Map<string, Map<string, Flo.ElementMetadata>>>}
   */
  load(): Promise<Map<string, Map<string, Flo.ElementMetadata>>> {
    return this.request ? this.request : this.refresh();
  }

  /**
   * Gets a supported group types in a palette.
   *
   * @returns {Array<string>} a group types
   */
  groups(): Array<string> {
    return [CONTROL_GROUP_TYPE, TASK_GROUP_TYPE];
  }

  /**
   * Refresh element metadata.
   *
   * @returns {Promise<Map<string, Map<string, Flo.ElementMetadata>>>} a promise for metamodel
   */
  refresh(): Promise<Map<string, Map<string, Flo.ElementMetadata>>> {
    const metamodel = new Map<string, Map<string, Flo.ElementMetadata>>();
    this.addLinksGroup(metamodel);
    this.addOtherGroup(metamodel);
    return this.request = new Promise(resolve => {
      this.appsService.getApps({ page: 0, size: 1000 }, ApplicationType.task).subscribe(
        data => {
          data.items.forEach(item => {
            if (!metamodel.has(item.type.toString())) {
              metamodel.set(item.type.toString(), new Map<string, Flo.ElementMetadata>());
            }
            const group: Map<string, Flo.ElementMetadata> = metamodel.get(item.type.toString());
            if (group.has(item.name)) {
              this.loggerService.error(`Group '${item.type}' has duplicate element '${item.name}'`);
            } else {
              group.set(item.name, this.createEntry(item.type, item.name, item.version));
            }
          });
          resolve(metamodel);
        },
        error => {
          this.loggerService.error(error.toString());
          resolve(metamodel);
        }
      );
    });
  }

  private addOtherGroup(metamodel: Map<string, Map<string, Flo.ElementMetadata>>): void {
    const elements = new Map<string, Flo.ElementMetadata>()
      .set(START_NODE_TYPE, this.createMetadata(START_NODE_TYPE,
        CONTROL_GROUP_TYPE,
        'Start element for the composed task. Global options for the task are set on this element.',
        new Map<string, Flo.PropertyMetadata>().set('timeout', {
          id: 'timeout',
          name: 'timeout',
          defaultValue: null,
          description: 'Execution timeout',
          type: 'java.lang.Long'
        }), {
          'noPaletteEntry': true,
        })
      )
      .set(END_NODE_TYPE, this.createMetadata(END_NODE_TYPE,
        CONTROL_GROUP_TYPE,
        'End element for a flow or the entire composed task.',
        new Map<string, Flo.PropertyMetadata>(), {
          'noPaletteEntry': true,
          'noEditableProps': true
        })
      )
      .set(SYNC_NODE_TYPE, this.createMetadata(SYNC_NODE_TYPE,
        CONTROL_GROUP_TYPE,
        'After a split, a sync node pulls the threads of parallel tasks back together',
        new Map<string, Flo.PropertyMetadata>(), {
          'noEditableProps': true
        })
      );
    metamodel.set(CONTROL_GROUP_TYPE, elements);
  }

  addLinksGroup(metamodel: Map<string, Map<string, Flo.ElementMetadata>>): void {
    const metadata = this.createMetadata('transition', 'links', 'Transition between tasks',
      new Map<string, Flo.PropertyMetadata>().set('ExitStatus', {
        id: 'ExitStatus',
        name: 'Exit Status',
        defaultValue: '',
        description: 'Exit status triggering transition to alternate task flow route'
      }), {
        unselectable: true
      });
    metamodel.set(metadata.group, new Map<string, Flo.ElementMetadata>().set(metadata.name, metadata));
  }

  private createEntry(type: ApplicationType, name: string, version: string, metadata?: Flo.ExtraMetadata): Flo.ElementMetadata {
    return new AppMetadata(
      type.toString(),
      name,
      version,
      this.appsService.getAppInfo(type, name),
      metadata
    );
  }

  private createMetadata(name: string, group: string, description: string,
                         properties: Map<string, Flo.PropertyMetadata>, metadata?: Flo.ExtraMetadata): Flo.ElementMetadata {
    return {
      name: name,
      group: group,
      metadata: metadata,
      description: () => Promise.resolve(description),
      get: (property: string) => Promise.resolve(properties.get(property)),
      properties: () => Promise.resolve(properties)
    };

  }

  private toGraph(graphInInternalFormat): Graph {
    const elements = graphInInternalFormat.attributes.cells.models;

    const nodes: Array<Node> = new Array();
    const links: Array<Link> = new Array();

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element.get('type') === joint.shapes.flo.NODE_TYPE) {
        const attrs = element.attributes.attrs;
        const metadata = {};
        if (element.attr('node-label')) {
          metadata[this.COMPOSED_TASK_LABEL] = element.attr('node-label');
        }
        nodes.push(new Node(element.attributes.id, attrs.metadata.name, element.attributes.attrs.props, metadata));
      } else if ((element.get('type') === joint.shapes.flo.LINK_TYPE)
        && element.get('source').id && element.get('target').id) {
        const properties = {};
        if (element.attr('metadata') && element.attr('props/ExitStatus')) {
          properties['transitionName'] = element.attr('props/ExitStatus');
        }
        links.push(new Link(element.get('source').id, element.get('target').id, properties));
      }
    }
    return new Graph(nodes, links);
  }

  private buildGraphFromJson(flo: Flo.EditorContext, conversion: TaskConversion, metamodel: Map<string, Map<string, Flo.ElementMetadata>>) {
    if (conversion.graph === undefined || conversion.graph === null) {
      // TODO handle this better when we have service for metadata
      if (!conversion.errors || conversion.errors.length === 0) {
        // There is some text but with errors it may produce invalid graph. Keep the graph as is since it might be work in progress
        flo.clearGraph();
      }
      return;
    }

    // Clear the graph completely including start and end node (they'll be re-created
    flo.getGraph().clear();

    const graph = conversion.graph;

    const inputnodes = graph.nodes;
    const inputlinks = graph.links;

    const inputnodesCount = inputnodes ? inputnodes.length : 0;
    const nodesIndex = [];
    const builtNodesMap = {};
    for (let n = 0; n < inputnodesCount; n++) {
      const name = inputnodes[n].name;

      // It makes more sense to hardcode these than create
      // more complex logic by trying to parse from metadata
      const label = inputnodes[n].name;
      let group;
      if (name === START_NODE_TYPE || name === END_NODE_TYPE || name === SYNC_NODE_TYPE) {
        group = CONTROL_GROUP_TYPE;
      } else {
        group = TASK_GROUP_TYPE;
      }

      let metadata = metamodel.get(group) ? metamodel.get(group).get(name) : undefined;
      if (!metadata) {
        // Unknown element
        metadata = this.createMetadata(name, group, '', new Map<string, Flo.PropertyMetadata>(), { unresolved: true });
      }

      const properties = new Map<string, any>();
      if (inputnodes[n].properties) {
        Object.keys(inputnodes[n].properties).forEach(k => properties.set(k, inputnodes[n].properties[k]));
      }
      const metadataProperties = inputnodes[n].metadata;
      const newNode = flo.createNode(metadata, properties);

      if (metadataProperties && metadataProperties[this.COMPOSED_TASK_LABEL]) {
        newNode.attr('node-label', metadataProperties[this.COMPOSED_TASK_LABEL]);
      }

      nodesIndex.push(newNode.id);
      builtNodesMap[inputnodes[n].id] = newNode.id;
    }

    let link;
    const inputlinksCount = inputlinks ? inputlinks.length : 0;
    for (let l = 0; l < inputlinksCount; l++) {
      link = inputlinks[l];
      const props = new Map<string, any>();
      if (link.properties) {
        // Copy the transitionName from the properties in the JSON form
        // as task exit status in the built link
        // props.ExitStatus = link.properties.transitionName;
        props.set('ExitStatus', link.properties.transitionName);
      }
      // TODO safe to delete from/to/nodesIndex now?
      const otherfrom = { 'id': builtNodesMap[link.from], 'selector': '.output-port' };
      const otherto = { 'id': builtNodesMap[link.to], 'selector': '.input-port' };

      const metadata2 = metamodel.get('links').get('transition');
      flo.createLink(otherfrom, otherto, metadata2, props);
    }

    flo.performLayout();

    // Graph is empty? Ensure there are at least start and end nodes created!
    nodesIndex.length ? arrangeAll(flo) : flo.clearGraph();
  }

  clearCachedData() {
    this.request = undefined;
  }

}
