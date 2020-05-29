import { Observable, of } from 'rxjs';
import {ToolsService} from "../../flo/task/tools.service";
import {Graph, TaskConversion} from "../../flo/task/model/models";

export class MockToolsService extends ToolsService {

  constructor() {
    super(null);
  }

  parseTaskTextToGraph(dsl: string, name: string = 'unknown'): Observable<TaskConversion> {
    return of(new TaskConversion(dsl, []));
  }

  convertTaskGraphToText(graph: Graph): Observable<TaskConversion> {
    return of(new TaskConversion('', [], graph));
  }
}
