import { Flo } from 'spring-flo';
import { Injectable } from '@angular/core';
import { ApplicationType } from '../../shared/model/application-type';
import { SharedAppsService } from '../../shared/services/shared-apps.service';
import { CONTROLNODES_GROUP_TYPE } from './support/shapes';
import { ToolsService } from './tools.service';
import { Graph, Link, Node } from './model/models';

import * as _joint from 'jointjs';
const joint: any = _joint;

class TaskAppMetadata implements Flo.ElementMetadata {

  private _propertiesPromise: Promise<Map<string, Flo.PropertyMetadata>>;

  constructor(
    private _group: string,
    private _name: string,
    private _metadata?: Flo.ExtraMetadata
  ) {}

  get propertiesPromise(): Promise<Map<string, Flo.PropertyMetadata>> {
    return this._propertiesPromise;
  }

  get name(): string {
    return this._name;
  }

  get group(): string {
    return this._group;
  }

  properties(): Promise<Map<string, Flo.PropertyMetadata>> {
    return this.propertiesPromise;
  }

  get(property: string): Promise<Flo.PropertyMetadata> {
    return this.propertiesPromise.then(properties => properties.get(property));
  }

}

/**
 * Flo service class for its Metamodel used for composed tasks.
 *
 * @author Janne Valkealahti
 */
@Injectable()
export class MetamodelService implements Flo.Metamodel {

  private COMPOSED_TASK_LABEL = 'label';

  constructor(
    private appsService: SharedAppsService,
    private toolsService: ToolsService
  ) {}

  /**
   * Converts text dsl into flo graph representation.
   *
   * @param {Flo.EditorContext} flo the flo editor context
   * @param {string} dsl the dsl
   * @returns {Promise<any>} a promise when conversion has happened
   */
  textToGraph(flo: Flo.EditorContext, dsl: string = ''): Promise<any> {
    flo.getGraph().clear();
    return this.toolsService.parseTaskTextToGraph(dsl).toPromise()
      .then(taskConversion => {
        this.load().then(metamodel => {
          this.buildGraphFromJson(flo, taskConversion.graph, metamodel);
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
    const graphInCommonFormat = this.toGraph(graphInInternalFormat);
    return this.toolsService.convertTaskGraphToText(graphInCommonFormat)
      .map(taskConversion => {
        return taskConversion.dsl;
      }).toPromise();
  }

  /**
   * Loads element metadata. For now just delegates to refresh.
   *
   * @returns {Promise<Map<string, Map<string, Flo.ElementMetadata>>>}
   */
  load(): Promise<Map<string, Map<string, Flo.ElementMetadata>>> {
    return this.refresh();
  }

  /**
   * Gets a supported group types in a palette.
   *
   * @returns {Array<string>} a group types
   */
  groups(): Array<string> {
    return [CONTROLNODES_GROUP_TYPE, 'task'];
  }

  /**
   * Refresh element metadata.
   *
   * @returns {Promise<Map<string, Map<string, Flo.ElementMetadata>>>} a promise for metamodel
   */
  refresh(): Promise<Map<string, Map<string, Flo.ElementMetadata>>> {
    const metamodel = new Map<string, Map<string, Flo.ElementMetadata>>();
    this.addOtherGroup(metamodel);
    return new Promise(resolve => {
      this.appsService.getApps({page: 0, size: 1000}).subscribe(
        data => {
          data.items.filter(item => {
            return item.type.toString() === ApplicationType[ApplicationType.task];
          }).forEach(item => {

            if (!metamodel.has(item.type.toString())) {
              metamodel.set(item.type.toString(), new Map<string, Flo.ElementMetadata>());
            }
            const group: Map<string, Flo.ElementMetadata> = metamodel.get(item.type.toString());
            if (group.has(item.name)) {
              console.error(`Group '${item.type}' has duplicate element '${item.name}'`);
            } else {
              group.set(item.name, this.createEntry(item.type, item.name));
            }
          });
          resolve(metamodel);
        },
        error => {
          console.error(error);
          resolve(metamodel);
        }
      );
    });
  }

  private addOtherGroup(metamodel: Map<string, Map<string, Flo.ElementMetadata>>): void {
    const elements = new Map<string, Flo.ElementMetadata>()
      .set('START', this.createMetadata('START',
        CONTROLNODES_GROUP_TYPE,
        'Start element for the composed task. Global options for the task are set on this element.',
        new Map<string, Flo.PropertyMetadata>(), {
          'noPaletteEntry': true,
          'fixed-name': true,
        })
      )
      .set('END', this.createMetadata('END',
        CONTROLNODES_GROUP_TYPE,
        'End element for a flow or the entire composed task.',
        new Map<string, Flo.PropertyMetadata>(), {
          'noPaletteEntry': true,
          'fixed-name': true,
        })
      )
      .set('sync', this.createMetadata('sync',
        CONTROLNODES_GROUP_TYPE,
        'After a split, a sync node pulls the threads of parallel tasks back together',
        new Map<string, Flo.PropertyMetadata>(), {
          'fixed-name': true,
        })
      );
    metamodel.set(CONTROLNODES_GROUP_TYPE, elements);
  }

  private createEntry(type: ApplicationType, name: string, metadata?: Flo.ExtraMetadata): Flo.ElementMetadata {
    return new TaskAppMetadata(
      type.toString(),
      name,
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
        const metadata = new Map<string, string>();
        if (element.attr('node-label')) {
          metadata.set(this.COMPOSED_TASK_LABEL, element.attr('node-label'));
        }
        nodes.push(new Node(element.attributes.id, attrs.metadata.name, element.attributes.attrs.props, metadata));
      } else if (element.get('type') === joint.shapes.flo.LINK_TYPE
        && element.get('source').id && element.get('target').id) {
        const properties = new Map<string, string>();
        if (element.attr('metadata') && element.attr('props/ExitStatus')) {
          properties.set('transitionName', element.attr('props/ExitStatus'));
        }
        links.push(new Link(element.get('source').id, element.get('target').id));
      }
    }
    return new Graph(nodes, links);
  }

  private buildGraphFromJson(flo, graph: Graph, metamodel) {
    if (graph === undefined || graph === null) {
      // TODO handle this better when we have service for metadata
      return;
    }
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
      if (name === 'START' || name === 'END' || name === 'SYNC') {
        group = 'control nodes';
      } else {
        group = 'task';
      }

      const metadata = this.createMetadata(name, group, '', new Map<string, Flo.PropertyMetadata>());

      const nodeProperties = inputnodes[n].properties;
      const metadataProperties = inputnodes[n].metadata;
      const newNode = flo.createNode(metadata, nodeProperties);

      newNode.attr('.label/text', label);
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
        // TODO fix when properties supported
        // Copy the transitionName from the properties in the JSON form
        // as task exit status in the built link
        // props.ExitStatus = link.properties.transitionName;
        props.set('ExitStatus', link.properties.transitionName);
      }
      // TODO safe to delete from/to/nodesIndex now?
      const otherfrom = { 'id': builtNodesMap[link.from], 'selector': '.output-port'};
      const otherto = { 'id': builtNodesMap[link.to], 'selector': '.input-port'};

      const metadata2 = this.createMetadata('link', 'links', '', new Map<string, Flo.PropertyMetadata>());
      flo.createLink(otherfrom, otherto, metadata2, props);
    }

    flo.performLayout();

    // Graph is empty? Ensure there are at least start and end nodes created!
    const promise = nodesIndex.length ? flo.performLayout() : flo.clearGraph();

    if (promise && promise.then && promise.then.call) {
      promise.then(function() {
        flo.fitToPage();
      });
    } else {
      flo.fitToPage();
    }

  }
}
