import { Flo } from 'spring-flo';
import { Injectable } from '@angular/core';
import { ApplicationType } from '../../shared/model/application-type';
import { SharedAppsService } from '../../shared/services/shared-apps.service';
import { CONTROLNODES_GROUP_TYPE } from './support/shapes';
import { Http } from '@angular/http';
import { HttpUtils } from '../../shared/support/http.utils';
import { Observable } from 'rxjs/Observable';

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

@Injectable()
export class MetamodelService implements Flo.Metamodel {

  private COMPOSED_TASK_LABEL = 'label';

  private request: Promise<Map<string, Map<string, Flo.ElementMetadata>>>;

  constructor(
    private appsService: SharedAppsService,
    private http: Http
  ) {}

  textToGraph(flo: Flo.EditorContext, dsl: string): Promise<any> {
    flo.getGraph().clear();

    const options = HttpUtils.getDefaultRequestOptions();
    const json: Observable<any> = this.http.post('/tools/parseTaskTextToGraph',
        JSON.stringify({ dsl: dsl || ' ', name: 'unknown' }), options)
      .map(data => {
        console.log('graphToText4', data);
        return data.json();
      });


    return new Promise(resolve => {
      json.toPromise().then(
        (jsondata) => this.load().then(
          (metamodel) => resolve(this.buildGraphFromJson(flo, jsondata.graph, metamodel))));
    });
  }

  graphToText(flo: Flo.EditorContext): Promise<string> {
    const graphInInternalFormat = flo.getGraph();
    const graphInCommonFormat = this.toCommonGraphFormat(graphInInternalFormat);
    console.log('graphToText1', graphInCommonFormat);
    console.log('graphToText2', JSON.stringify(graphInCommonFormat));

    const options = HttpUtils.getDefaultRequestOptions();
    const dsl: Observable<any> = this.http.post('/tools/convertTaskGraphToText',
        JSON.stringify(graphInCommonFormat), options)
      .map(data => {
        console.log('graphToText3', data);
        return data.json().dsl;
      });
    return dsl.toPromise();
  }

  load(): Promise<Map<string, Map<string, Flo.ElementMetadata>>> {
    return this.refresh();
  }

  groups(): Array<string> {
    return [CONTROLNODES_GROUP_TYPE, 'task'];
  }

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

  private toCommonGraphFormat(graphInInternalFormat) {
    const elements = graphInInternalFormat.attributes.cells.models;
    const nodes = [];
    const links = [];
    let globalOptions;
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element.attributes.type === 'sinspctr.IntNode') {
        const attrs = element.attributes.attrs;
        const newNode = {};
        newNode['name'] = attrs.metadata.name;
        newNode['id'] = element.attributes.id;
        if (element.attributes.attrs.props) {
          if (newNode['name'] === 'START') {
            // Global options are held on the START node during graph editing
            globalOptions = element.attributes.attrs.props;
          } else {
            newNode['properties'] = element.attributes.attrs.props;
            if (element.attr('node-label')) {
              newNode['metadata'] = {};
              newNode['metadata'][this.COMPOSED_TASK_LABEL] = element.attr('node-label');
            }
          }
        }
        nodes.push(newNode);
      } else if (element.attributes.type === 'sinspctr.Link' || element.attributes.type === 'link') {
        const newlink = {'from': element.attributes.source.id, 'to': element.attributes.target.id};
        if (element.attributes.attrs.metadata && element.attributes.attrs.props &&
          element.attributes.attrs.props.ExitStatus) {
          newlink['properties'] = {'transitionName': element.attributes.attrs.props.ExitStatus};
        }
        links.push(newlink);
      }
    }
    const graph = {'nodes': nodes, 'links': links};
    if (globalOptions) {
      graph['properties'] = globalOptions;
    }
    return graph;
  }

  private buildGraphFromJson(flo, jsonFormatData, metamodel) {
    if (jsonFormatData === undefined || jsonFormatData === null) {
      // TODO handle this better when we have service for metadata
      return;
    }
    const inputnodes = jsonFormatData.nodes;
    const inputlinks = jsonFormatData.links;

    const incoming = {};
    const outgoing = {};
    let link;
    for (let i = 0; i < inputlinks.length; i++) {
      link = inputlinks[i];
      if (typeof link.from === 'number') {
        if (typeof outgoing[link.from] !== 'number') {
          outgoing[link.from] = 0;
        }
        outgoing[link.from]++;
      }
      if (typeof link.to === 'number') {
        if (typeof incoming[link.to] !== 'number') {
          incoming[link.to] = 0;
        }
        incoming[link.to]++;
      }
    }

    const inputnodesCount = inputnodes ? inputnodes.length : 0;
    const nodesIndex = [];
    const builtNodesMap = {};
    for (let n = 0; n < inputnodesCount; n++) {
      const name = inputnodes[n].name;
      const label = inputnodes[n].label || inputnodes[n].name;
      let group = inputnodes[n].group;
      if (!group) {
        // TODO matchGroup port as is doesn't work
        // group = this.matchGroup(metamodel, name, incoming[n], outgoing[n]);
        if (name === 'START' || name === 'END' || name === 'SYNC') {
          group = 'control nodes';
        } else {
          group = 'task';
        }
      }
      // TODO fix this metadata usage
      // var metadata = metamodelUtils.getMetadata(metamodel, name, group);
      // if (metadata.unresolved) {
      //   metadata.metadata = {
      //     titleProperty: 'metadata/name'
      //   };
      // }
      const metadata = this.createMetadata(name, group, '', new Map<string, Flo.PropertyMetadata>());

      let nodeProperties = inputnodes[n].properties;
      const metadataProperties = inputnodes[n].metadata;
      // Put the global properties onto the start node if there are any
      if (n === 0 && name === 'START' && jsonFormatData.properties) {
        nodeProperties = jsonFormatData.properties;
      }
      const newNode = flo.createNode(metadata, nodeProperties);
      // Hang the properties off the start node!
      newNode.attr('.label/text', label);
      if (inputnodes[n].range) {
        newNode.attr('range', inputnodes[n].range);
      }
      if (inputnodes[n].propertiesranges) {
        newNode.attr('propertiesranges', inputnodes[n].propertiesranges);
      }
      if (inputnodes[n]['stream-id']) {
        newNode.attr('stream-id', inputnodes[n]['stream-id']);
      }
      if (metadataProperties && metadataProperties[this.COMPOSED_TASK_LABEL]) {
        newNode.attr('node-label', metadataProperties[this.COMPOSED_TASK_LABEL]);
      }
      nodesIndex.push(newNode.id);
      builtNodesMap[inputnodes[n].id] = newNode.id;
    }

    const inputlinksCount = inputlinks ? inputlinks.length : 0;
    for (let l = 0; l < inputlinksCount; l++) {
      link = inputlinks[l];
      const props = {};
      if (link.properties) {
        // TODO fix when properties supported
        // Copy the transitionName from the properties in the JSON form
        // as task exit status in the built link
        // props.ExitStatus = link.properties.transitionName;
      }
      // TODO safe to delete from/to/nodesIndex now?
      const otherfrom = { 'id': builtNodesMap[link.from], 'selector': '.output-port'};
      const otherto = { 'id': builtNodesMap[link.to], 'selector': '.input-port'};

      const metadata2 = this.createMetadata('link', 'links', '', new Map<string, Flo.PropertyMetadata>());
      flo.createLink(otherfrom, otherto, metadata2, new Map<string, any>());
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

  private matchGroup(metamodel, type, incoming, outgoing) {
    // TODO simple port of this function doesn't work
    console.log('matchGroup', type, incoming, outgoing);
    incoming = typeof incoming === 'number' ? incoming : 0;
    outgoing = typeof outgoing === 'number' ? outgoing : 0;
    const matches = [];
    let i;
    if (type) {
      for (i in metamodel) {
        if (metamodel[i][type]) {
          matches.push(metamodel[i][type]);
        }
      }
    }
    let group;
    let score = Number.MIN_VALUE;
    for (i = 0; i < matches.length; i++) {
      const constraints = matches[i].constraints;
      if (constraints) {
        let failedConstraintsNumber = 0;
        if (typeof constraints.maxOutgoingLinksNumber === 'number' && constraints.maxOutgoingLinksNumber < outgoing) {
          failedConstraintsNumber++;
        }
        if (typeof constraints.minOutgoingLinksNumber === 'number' && constraints.minOutgoingLinksNumber > outgoing) {
          failedConstraintsNumber++;
        }
        if (typeof constraints.maxIncomingLinksNumber === 'number' && constraints.maxIncomingLinksNumber < incoming) {
          failedConstraintsNumber++;
        }
        if (typeof constraints.minIncomingLinksNumber === 'number' && constraints.minIncomingLinksNumber > incoming) {
          failedConstraintsNumber++;
        }

        if (failedConstraintsNumber === 0) {
          return matches[i].group;
        } else if (failedConstraintsNumber > score) {
          score = failedConstraintsNumber;
          group = matches[i].group;
        }
      } else {
        return matches[i].group;
      }
    }
    return group;
  }
}
