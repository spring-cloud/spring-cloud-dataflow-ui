import { Injectable } from '@angular/core';
import get from 'lodash.get';
import set from 'lodash.set';

@Injectable({
  providedIn: 'root'
})
export class ContextService {

  size = window.innerWidth - 300;

  context = {
    apps: {
      current: 1,
      size: 20,
      name: '',
      type: '',
      by: 'name',
      reverse: false,
      sizeName: this.size - 950,
      sizeType: 140,
      sizeVersion: 200,
      sizeUri: this.size - 820,
      cols: [true, true, true, true, false]
    },
    streams: {
      current: 1,
      size: 20,
      name: '',
      by: 'name',
      reverse: false,
      sizeName: 300,
      sizeDescription: 300,
      sizeDslText: this.size - 820,
      sizeStatus: 100,
      cols: [true, true, true, true],
      expended: []
    },
    tasks: {
      current: 1,
      size: 20,
      name: '',
      by: 'taskName',
      reverse: false,
      cols: [true, true, true, true]
    },
    executions: {
      current: 1,
      size: 20,
      name: '',
      by: 'TASK_EXECUTION_ID',
      reverse: true,
      sizeId: 160,
      sizeDuration: 180,
      sizeStart: 230,
      sizeEnd: 230,
      sizeExit: 110,
      cols: [true, true, true, true, true]
    },
    jobs: {
      current: 1,
      size: 20,
      name: '',
      by: 'TASK_EXECUTION_ID',
      reverse: true,
      sizeId: 160,
      sizeTaskId: 105,
      sizeInstanceId: 105,
      sizeStart: 230,
      sizeStepCount: 150,
      sizeStatus: 140,
      cols: [true, true, true, true, true, true, true]
    },
    records: {
      current: 1,
      size: 20,
      name: '',
      by: 'id',
      reverse: true,
      sizeId: 120,
      sizeCorrelationId: this.size - 1040,
      sizeCreatedOn: 240,
      sizeAuditAction: 140,
      sizeAuditOperation: 200,
      sizeCreatedBy: 160,
      sizePlatformName: 160,
      cols: [true, true, true, true, true, true, true]
    },
    stream: {
      visualize: false,
      child: {}
    },
    task: {
      visualize: false,
      child: {}
    },
    execution: {
      child: {}
    },
    job: {
      child: {}
    }
  };

  constructor() {
  }

  update(key, value) {
    set(this.context, key, value);
  }

  get(key) {
    return get(this.context, key, null);
  }

}
