import { Observable, of } from 'rxjs';
import {
  ValuedConfigurationMetadataProperty, ValuedConfigurationMetadataPropertyList
} from '../../shared/model/detailed-app.model';
import { TaskLaunchConfig } from '../../shared/model/task.model';
import { TaskLaunchService } from '../../tasks-jobs/tasks/launch/task-launch.service';
import { ApplicationType } from '../../shared/model/app.model';
import { CTR_OPTIONS } from '../data/task';

export class TaskLaunchServiceMock {
  static mock: any = null;

  config(id: string): Observable<TaskLaunchConfig> {
    const config = new TaskLaunchConfig();
    config.id = id;
    config.platform = {
      id: 'platform',
      name: 'platform',
      form: 'select',
      type: 'java.lang.String',
      defaultValue: '',
      values: [
        {
          key: 'local',
          name: 'local',
          type: 'Local',
          options: []
        }
      ]
    };
    config.apps = [
      {
        origin: 'timestamp',
        name: 't1',
        type: 'task',
        version: '2.1.0.RELEASE',
        versions: [],
        options: [],
        optionsState: {
          isLoading: false,
          isOnError: false,
          isInvalid: false
        }
      },
      {
        origin: 'timestamp',
        name: 't2',
        type: 'task',
        version: '2.1.0.RELEASE',
        versions: [],
        options: [],
        optionsState: {
          isLoading: false,
          isOnError: false,
          isInvalid: false
        }
      }
    ];
    config.ctr = {
      options: ValuedConfigurationMetadataPropertyList.parse(CTR_OPTIONS),
      optionsState: {
        isLoading: false,
        isOnError: false
      }
    };
    config.deployers = [
      {
        id: 'memory',
        name: 'memory',
        form: 'autocomplete',
        type: 'java.lang.Integer',
        value: null,
        defaultValue: null,
        suffix: 'MB'
      }
    ];
    config.deploymentProperties = [
      'app.composed-task-runner.split-thread-max-pool-size=10'
    ];

    return of(config);
  }

  ctrOptions(): Observable<ValuedConfigurationMetadataProperty[]> {
    return of([
      {
        id: 'split-thread-max-pool-size',
        name: 'split-thread-max-pool-size',
        type: 'java.lang.Integer',
        description: 'Split\'s maximum pool size. Default is {@code Integer.MAX_VALUE}.',
        shortDescription: 'Split\'s maximum pool size.',
        defaultValue: null,
        deprecation: null,
        sourceType: '',
        isDeprecated: false,
        value: ''
      },
      {
        id: 'split-thread-core-pool-size',
        name: 'split-thread-core-pool-size',
        type: 'java.lang.Integer',
        description: 'Split\'s core pool size. Default is 4\;',
        shortDescription: 'Split\'s core pool size.',
        defaultValue: 4,
        deprecation: null,
        sourceType: '',
        isDeprecated: false,
        value: ''
      },
      {
        id: 'composed-task-properties',
        name: 'composed-task-properties',
        type: 'java.lang.Integer',
        description: 'The properties to be used for each of the tasks as well as their deployments.',
        shortDescription: 'The properties to be used for each of the tasks as well as their deployments.',
        defaultValue: null,
        deprecation: null,
        sourceType: '',
        isDeprecated: false,
        value: ''
      },
      {
        id: 'increment-instance-enabled',
        name: 'increment-instance-enabled',
        type: 'java.lang.Boolean',
        description: 'Allows a single ComposedTaskRunner instance to be re-executed without changing the parameters. Default is false which means a ComposedTaskRunner instance can only be executed once with a given set of parameters, if true it can be re-executed.',
        shortDescription: 'Allows a single ComposedTaskRunner instance to be re-executed without changing the parameters.',
        defaultValue: true,
        deprecation: null,
        sourceType: '',
        isDeprecated: false,
        value: ''
      }
    ]);
  }

  appDetails(type: ApplicationType, name: string, version: string): Observable<Array<any>> {
    return of([]);
  }

  static get provider() {
    if (!TaskLaunchServiceMock.mock) {
      TaskLaunchServiceMock.mock = new TaskLaunchServiceMock();
    }
    return { provide: TaskLaunchService, useValue: TaskLaunchServiceMock.mock };
  }
}
