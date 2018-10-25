import { ToolsService } from '../../tasks/components/flo/tools.service';
import { Observable } from 'rxjs/Observable';
import { Graph, TaskConversion } from '../../tasks/components/flo/model/models';

export class MockToolsService extends ToolsService {

  constructor() {
    super(null, null);
  }

  parseTaskTextToGraph(dsl: string, name: string = 'unknown'): Observable<TaskConversion> {
    return Observable.of(new TaskConversion(dsl, []));
  }

  convertTaskGraphToText(graph: Graph): Observable<TaskConversion> {
    return Observable.of(new TaskConversion('', [], graph));
  }
}
