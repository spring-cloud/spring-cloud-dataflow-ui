import { DateTime } from 'luxon';
import { Page } from './page.model';
import get from 'lodash.get';

export class ExecutionContext {

  public dirty: boolean;
  public empty: boolean;
  public values: Map<string, string>;

  static parse(input) {
    const context = new ExecutionContext();
    context.dirty = input?.dirty;
    context.empty = input?.empty;
    context.values = new Map<string, string>();
    (input?.values || []).forEach(i => {
      i.forEach((value: string, key: string) => {
        context.values.set(key, value);
      });
    });
    return context;
  }
}

export class ExecutionStep {
  public id: string;
  public name: string;
  public status: string;
  public readCount: number;
  public writeCount: number;
  public commitCount: number;
  public rollbackCount: number;
  public readSkipCount: number;
  public processSkipCount: number;
  public writeSkipCount: number;
  public filterCount: number;
  public skipCount: number;
  public startTime: DateTime;
  public endTime: DateTime;
  public executionContext: ExecutionContext;
  public exitCode: string;
  public exitMessage: string;


  static parse(input): ExecutionStep {
    const executionStep: ExecutionStep = new ExecutionStep();
    executionStep.id = input.id;
    executionStep.name = input.stepName;
    executionStep.status = input.status;
    executionStep.readCount = input.readCount;
    executionStep.writeCount = input.writeCount;
    executionStep.commitCount = input.commitCount;
    executionStep.rollbackCount = input.rollbackCount;
    executionStep.readSkipCount = input.readSkipCount;
    executionStep.processSkipCount = input.processSkipCount;
    executionStep.writeSkipCount = input.writeSkipCount;
    executionStep.filterCount = input.filterCount;
    executionStep.skipCount = input.skipCount;
    executionStep.startTime = DateTime.fromISO(input.startTime);
    executionStep.endTime = DateTime.fromISO(input.endTime);
    if (input.executionContext) {
      const values = new Array<Map<string, string>>();
      input.executionContext.values.forEach(item => {
        const map = new Map<string, string>();
        for (const prop in item) {
          if (item.hasOwnProperty(prop)) {
            map.set(prop, item[prop]);
          }
        }
        values.push(map);
      });
      executionStep.executionContext = ExecutionContext.parse({ ...input, values });
    }
    if (input.exitStatus) {
      executionStep.exitCode = input.exitStatus.exitCode;
      executionStep.exitMessage = input.exitStatus.exitDescription;
    }
    return executionStep;
  }

  labelStatusClass() {
    switch (this.status) {
      case 'COMPLETED':
        return 'label label-job completed';
      case 'ERROR':
      case 'FAILED':
        return 'label label-job error';
      default:
        return 'label label-job unknown';
    }
  }
}

export class ExecutionStepResource {
  public jobExecutionId: string;
  public stepExecution: ExecutionStep;
  public stepType: string;

  static parse(input) {
    const stepExecutionResource = new ExecutionStepResource();
    stepExecutionResource.jobExecutionId = input.jobExecutionId;
    stepExecutionResource.jobExecutionId = input.jobExecutionId;
    stepExecutionResource.stepExecution = ExecutionStep.parse(input.stepExecution);
    stepExecutionResource.stepType = input.stepType;
    return stepExecutionResource;
  }
}

export class CountDetails {
  public count: number;
  public min: number;
  public max: number;
  public mean: number;
  public standardDeviation: number;
}

export class ExecutionStepHistory {
  public stepName: string;
  public count: number;
  public commitCount: CountDetails;
  public rollbackCount: CountDetails;
  public readCount: CountDetails;
  public writeCount: CountDetails;
  public filterCount: CountDetails;
  public readSkipCount: CountDetails;
  public writeSkipCount: CountDetails;
  public processSkipCount: CountDetails;
  public duration: CountDetails;
  public durationPerRead: CountDetails;

  static parse(input): ExecutionStepHistory {
    const stepExecutionHistory: ExecutionStepHistory = new ExecutionStepHistory();
    stepExecutionHistory.stepName = input.stepName;
    stepExecutionHistory.count = input.count;
    ['commitCount', 'rollbackCount', 'readCount', 'writeCount', 'filterCount', 'readSkipCount', 'writeSkipCount',
      'processSkipCount', 'duration', 'durationPerRead'].forEach((item) => {
      stepExecutionHistory[item] = new CountDetails();
      stepExecutionHistory[item].count = input[item].count;
      stepExecutionHistory[item].min = input[item].min;
      stepExecutionHistory[item].max = input[item].max;
      stepExecutionHistory[item].mean = input[item].mean;
      stepExecutionHistory[item].standardDeviation = input[item].standardDeviation;
    });
    return stepExecutionHistory;
  }
}

export class ExecutionStepProgress {
  public stepExecution: ExecutionStep;
  public stepExecutionHistory: ExecutionStepHistory;
  public percentageComplete: number;
  public finished: boolean;
  public duration: number;

  static parse(input): ExecutionStepProgress {
    const stepExecutionProgress: ExecutionStepProgress = new ExecutionStepProgress();
    stepExecutionProgress.percentageComplete = input.percentageComplete;
    stepExecutionProgress.finished = input.finished;
    stepExecutionProgress.duration = input.duration;
    stepExecutionProgress.stepExecution = ExecutionStep.parse(input.stepExecution);
    if (input.stepExecutionHistory) {
      stepExecutionProgress.stepExecutionHistory = ExecutionStepHistory.parse(input.stepExecutionHistory);
    }
    return stepExecutionProgress;
  }
}


export class JobExecution {
  public name: string;
  public taskExecutionId: number;
  public jobInstanceId: number;
  public jobExecutionId: number;
  public startTime: DateTime;
  public endTime: DateTime;
  public stepExecutionCount: number;
  public status: string;
  public jobParametersString: string;
  public exitCode: string;
  public exitMessage: string;
  public stepExecutions: ExecutionStep[];
  public restartable: boolean;
  public abandonable: boolean;
  public stoppable: boolean;
  public defined: boolean;

  constructor() {
  }

  static parse(input): JobExecution {
    const jobExecution: JobExecution = new JobExecution();
    jobExecution.stepExecutions = [];
    jobExecution.name = input.name;
    if (get(input, 'jobExecution.startTime')) {
      jobExecution.startTime = DateTime.fromISO(input.jobExecution.startTime);
    }
    jobExecution.stepExecutionCount = input.stepExecutionCount;
    if (get(input, 'jobExecution.status')) {
      jobExecution.status = input.jobExecution.status;
    }
    jobExecution.jobExecutionId = get(input, 'jobExecution.id');
    jobExecution.taskExecutionId = input.taskExecutionId;
    jobExecution.jobInstanceId = get(input, 'jobExecution.jobInstance.id');
    jobExecution.restartable = input.restartable;
    jobExecution.abandonable = input.abandonable;
    jobExecution.stoppable = input.stoppable;
    jobExecution.defined = input.defined;
    jobExecution.jobParametersString = input.jobParametersString;
    if (get(input, 'jobExecution.stepExecutions')) {
      jobExecution.stepExecutions = input.jobExecution.stepExecutions.map(ExecutionStep.parse);
    }
    if (get(input, 'jobExecution.endTime')) {
      jobExecution.endTime = DateTime.fromISO(input.jobExecution.endTime);
    }
    if (get(input, 'jobExecution.exitStatus')) {
      jobExecution.exitCode = input.jobExecution.exitStatus.exitCode;
      jobExecution.exitMessage = input.jobExecution.exitStatus.exitDescription;
    }
    return jobExecution;
  }

  static parseThin(input): JobExecution {
    const jobExecution: JobExecution = new JobExecution();
    jobExecution.stepExecutions = [];
    jobExecution.name = input.name;
    if (get(input, 'startDateTime')) {
      jobExecution.startTime = DateTime.fromISO(input.startDateTime);
    }
    jobExecution.stepExecutionCount = input.stepExecutionCount;
    jobExecution.status = input.status;
    jobExecution.jobExecutionId = input.executionId;
    jobExecution.taskExecutionId = input.taskExecutionId;
    jobExecution.jobInstanceId = input.instanceId;
    jobExecution.restartable = input.restartable;
    jobExecution.abandonable = input.abandonable;
    jobExecution.stoppable = input.stoppable;
    jobExecution.defined = input.defined;
    jobExecution.jobParametersString = input.jobParametersString;
    return jobExecution;
  }

  labelStatusClass() {
    switch (this.status) {
      case 'COMPLETED':
        return 'label label-execution completed';
      case 'ERROR':
      case 'FAILED':
        return 'label label-execution error';
      default:
        return 'label label-execution unknown';
    }
  }

  labelExitCodeClass() {
    switch (this.exitCode) {
      case 'COMPLETED':
        return 'label label-exit-code completed';
      case 'ERROR':
      case 'FAILED':
        return 'label label-exit-code error';
      default:
        return 'label label-exit-code unknown';
    }
  }

}

export class JobExecutionPage extends Page<JobExecution> {
  public static parse(input): Page<JobExecution> {
    const page = Page.fromJSON<JobExecution>(input);
    if (input && input._embedded) {
      if (input._embedded.jobExecutionResourceList) {
        page.items = input._embedded.jobExecutionResourceList.map(JobExecution.parse);
      }
      if (input._embedded.jobExecutionThinResourceList) {
        page.items = input._embedded.jobExecutionThinResourceList.map(JobExecution.parseThin);
      }
    }
    return page;
  }
}
