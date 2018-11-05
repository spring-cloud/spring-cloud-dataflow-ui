import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { HttpUtils } from '../../../shared/support/http.utils';
import { ErrorHandler } from '../../../shared/model/error-handler';
import { Graph, Link, Node, TaskConversion } from './model/models';
import { catchError, map } from 'rxjs/operators';

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

  constructor(private httpClient: HttpClient,
              private errorHandler: ErrorHandler) {
  }

  /**
   * Parses dsl and returns TaskConversion as an observable.
   *
   * @param {string} dsl the dsl
   * @param {string} name the optional name, defaults to 'unknown'
   * @returns {Observable<TaskConversion>}
   */
  parseTaskTextToGraph(dsl: string = '', name: string = 'unknown'): Observable<TaskConversion> {
    if (!dsl) {
      // Server parser service gives error for empty DSL
      // Workaround: produce empty graph thus START and END node can be created
      return of({
        dsl: '',
        graph: new Graph([], []),
        errors: []
      });
    } else {
      // Multi-line task definitions are not supported
      if (dsl.indexOf('\n') >= 0) {
        return of({
          dsl: dsl,
          graph: null,
          errors: [
            {
              position: 0,
              length: dsl.length,
              message: 'Multi-line task definitions are not supported'
            }
          ]
        });
      } else {
        // Invoke server parser service for non-empty one line DSL
        const httpHeaders = HttpUtils.getDefaultHttpHeaders();
        const body = '{"dsl":"' + dsl + '","name":"' + name + '"}';
        return this.httpClient
          .post<any>(this.parseTaskTextToGraphUrl, body, { headers: httpHeaders })
          .pipe(
            map(response => this.extractConversionData(response)),
            catchError(this.errorHandler.handleError)
          );
      }
    }
  }

  /**
   * Parses graph and returns TaskConversion as an observable.
   *
   * @param {string} graph the graph
   * @returns {Observable<TaskConversion>}
   */
  convertTaskGraphToText(graph: Graph): Observable<TaskConversion> {
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    const body = graph.toJson();

    return this.httpClient
      .post<any>(this.convertTaskGraphToTextUrl, body, { headers: httpHeaders })
      .pipe(
        map(response => this.extractConversionData(response)),
        catchError(this.errorHandler.handleError)
      );
  }

  /**
   * Extract TaskConversion from a response.
   *
   * @param {any} JSON body of the response
   * @returns {TaskConversion}
   */
  extractConversionData(body: any): TaskConversion {
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
    return new TaskConversion(body.dsl, body.errors, graph);
  }

}
