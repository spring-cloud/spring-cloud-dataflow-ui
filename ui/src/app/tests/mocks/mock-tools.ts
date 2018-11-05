import { ToolsService } from '../../tasks/components/flo/tools.service';
import { Observable, of } from 'rxjs';
import { Graph, TaskConversion } from '../../tasks/components/flo/model/models';

export class MockToolsService extends ToolsService {

  constructor() {
    super(null, null);
  }

  parseTaskTextToGraph(dsl: string, name: string = 'unknown'): Observable<TaskConversion> {
    return of(new TaskConversion(dsl, []));
  }

  convertTaskGraphToText(graph: Graph): Observable<TaskConversion> {
    return of(new TaskConversion('', [], graph));
  }
}
