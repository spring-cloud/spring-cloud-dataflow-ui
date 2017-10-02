import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpUtils } from '../../shared/support/http.utils';
import { ErrorHandler } from '../../shared/model/error-handler';
import { Graph, Link, Node, TaskConversion } from './model/models';

/**
 * Provides tools service having conversion between
 * dsl and flo json in composed tasks.
 *
 * @author Janne Valkealahti
 *
 */
@Injectable()
export class ToolsService {

  private parseTaskTextToGraphUrl = '/tools/parseTaskTextToGraph';
  private convertTaskGraphToTextUrl = '/tools/convertTaskGraphToText';

  constructor(
    private http: Http,
    private errorHandler: ErrorHandler
  ) { }

  /**
   * Parses dsl and returns TaskConversion as an observable.
   *
   * @param {string} dsl the dsl
   * @param {string} name the optional name, defaults to 'unknown'
   * @returns {Observable<TaskConversion>}
   */
  parseTaskTextToGraph(dsl: string, name: string = 'unknown'): Observable<TaskConversion> {
    const options = HttpUtils.getDefaultRequestOptions();
    const body = '{"dsl":"' + dsl + '","name":"' + name + '"}';

    return this.http.post(this.parseTaskTextToGraphUrl, body, options)
      .map(this.extractConversionData.bind(this))
      .catch(this.errorHandler.handleError);
  }

  /**
   * Parses graph and returns TaskConversion as an observable.
   *
   * @param {string} graph the graph
   * @returns {Observable<TaskConversion>}
   */
  convertTaskGraphToText(graph: Graph): Observable<TaskConversion> {
    const options = HttpUtils.getDefaultRequestOptions();
    const body = graph.toJson();

    return this.http.post(this.convertTaskGraphToTextUrl, body, options)
      .map(this.extractConversionData.bind(this))
      .catch(this.errorHandler.handleError);
  }

  /**
   * Extract TaskConversion from a response.
   *
   * @param {Response} res the response
   * @returns {TaskConversion}
   */
  extractConversionData(res: Response): TaskConversion {
    const body = res.json();

    let graph: Graph;
    if (body.graph) {
      const nodes: Array<Node> = new Array();
      const links: Array<Link> = new Array();
      if (body.graph.nodes) {
        body.graph.nodes.map(item => {
          nodes.push(new Node(item.id, item.name, item.properties, item.metadata));
        });
      }
      if (body.graph.links) {
        body.graph.links.map(item => {
          links.push(new Link(item.from, item.to, item.properties));
        });
      }
      graph = new Graph(nodes, links);
    }

    return new TaskConversion(body.dsl, null, graph);
  }

}
