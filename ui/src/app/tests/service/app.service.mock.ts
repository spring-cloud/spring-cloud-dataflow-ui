import { Flo } from 'spring-flo';
import { Observable, EMPTY, of } from 'rxjs';
import { App, ApplicationType, AppPage } from '../../shared/model/app.model';
import { DetailedApp } from '../../shared/model/detailed-app.model';
import { AppService } from '../../shared/api/app.service';

const METAMODEL_DATA: Array<RawMetadata> = [
  {
    name: 'file-app', type: 'app', description: 'File App',
    options: [
      { id: 'port', name: 'port', defaultValue: '80', description: 'Port on which to listen', type: 'number' }
    ],
  },
  {
    name: 'time-app', type: 'app', description: 'Time App',
    options: [
      { id: 'port', name: 'port', defaultValue: '80', description: 'Port on which to listen', type: 'number' }
    ],
  },
  {
    name: 'http-app', type: 'app', description: 'HTTP app',
    options: [
      { id: 'port', name: 'port', defaultValue: '80', description: 'Port on which to listen', type: 'number' }
    ],
  },
  {
    name: 'http', type: 'source', description: 'Receive HTTP input',
    options: [
      { id: 'port', name: 'port', defaultValue: '80', description: 'Port on which to listen', type: 'number' }
    ],
  }, {
    name: 'rabbit', type: 'source', description: 'Receives messages from RabbitMQ',
    options: [
      { id: 'queue', name: 'queue', description: 'the queue(s) from which messages will be received' },
      {
        id: 'time-unit', name: 'time-unit', description: 'Time unit for heart beat messages', type: 'enum',
        options: ['HOURS', 'MINUTES', 'SECONDS', 'MILIOSECONDS'], defaultValue: 'SECONDS'
      },
      { id: 'heart-beat', name: 'heart-beat', description: 'Heart beat on/off', type: 'boolean', defaultValue: false },
      {
        id: 'interval',
        name: 'interval',
        description: 'Time period being consecutive heart beat messages',
        type: 'number',
        defaultValue: 20
      },
      { id: 'url', name: 'url', description: 'Service URL', type: 'url' },
      { id: 'password', name: 'password', description: 'Password to login to service', type: 'password' },
      { id: 'messages', name: 'messages', description: 'List of messages', type: 'list' },
      { id: 'counts', name: 'counts', description: 'List of counts', type: 'list[number]' },
      { id: 'successes', name: 'successes', description: 'List of successes', type: 'list[boolean]' },
    ],
  }, {
    name: 'filewatch', type: 'source', description: 'Produce messages from the content of files created in a directory',
    options: [
      { id: 'dir', name: 'dir', description: 'the absolute path to monitor for files' }
    ],
  }, {
    name: 'transform', type: 'processor', description: 'Apply an expression to modify incoming messages',
    options: [
      { id: 'expression', name: 'expression', defaultValue: 'payload', description: 'SpEL expression to apply' }
    ],
  }, {
    name: 'filter', type: 'processor', description: 'Only allow messages through that pass the filter expression',
    options: [
      {
        id: 'expression',
        name: 'expression',
        defaultValue: 'true',
        description: 'SpEL expression to use for filtering'
      }
    ],
  }, {
    name: 'filesave', type: 'sink', description: 'Writes messages to a file',
    options: [
      { id: 'dir', name: 'dir', description: 'Absolute path to directory' },
      { id: 'name', name: 'name', description: 'The name of the file to create' }
    ],
  }, {
    name: 'end', type: 'sink', description: 'Writes messages to a file',
    options: [
      { id: 'dir', name: 'dir', description: 'Absolute path to directory' },
      { id: 'name', name: 'name', description: 'The name of the file to create' }
    ],
  }, {
    name: 'null', type: 'sink', description: 'Writes messages to a file',
    options: [
      { id: 'dir', name: 'dir', description: 'Absolute path to directory' },
      { id: 'name', name: 'name', description: 'The name of the file to create' }
    ],
  }, {
    name: 'console', type: 'sink', description: 'Writes messages to a file',
    options: [
      { id: 'dir', name: 'dir', description: 'Absolute path to directory' },
      { id: 'name', name: 'name', description: 'The name of the file to create' }
    ],
  }, {
    name: 'hdfs', type: 'sink', description: 'Writes messages to a file',
    options: [
      { id: 'dir', name: 'dir', description: 'Absolute path to directory' },
      { id: 'name', name: 'name', description: 'The name of the file to create' }
    ],
  }, {
    name: 'jdbc', type: 'sink', description: 'Writes messages to a file',
    options: [
      { id: 'dir', name: 'dir', description: 'Absolute path to directory' },
      { id: 'name', name: 'name', description: 'The name of the file to create' }
    ],
  }, {
    name: 'ftp', type: 'sink', description: 'Send messages over FTP',
    options: [
      { id: 'host', name: 'host', description: 'the host name for the FTP server' },
      { id: 'port', name: 'port', description: 'The port for the FTP server', type: 'number' },
      { id: 'remoteDir', name: 'remoteDir', description: 'The remote directory on the server' },
    ],
  }, {
    name: 'a', type: 'task', description: 'Task a', options: []
  }, {
    name: 'b', type: 'task', description: 'Task b', options: []
  }, {
    name: 'c', type: 'task', description: 'Task c', options: []
  }, {
    name: 'd', type: 'task', description: 'Task d', options: []
  }, {
    name: 'super-very-very-very-looooooooong-task-name', type: 'task', description: 'Task d', options: []
  },
  {
    'name': 'time',
    'type': 'source',
    'description': 'Desc',
    'options': [
      {
        'id': 'trigger.time-unit',
        'name': 'time-unit',
        'type': 'java.util.concurrent.TimeUnit',
        'description': 'The TimeUnit to apply to delay values.',
        'shortDescription': 'The TimeUnit to apply to delay values.',
        'defaultValue': null,
        'hints': {
          'keyHints': [],
          'keyProviders': [],
          'valueHints': [
            {
              'value': 'NANOSECONDS',
              'description': null,
              'shortDescription': null
            },
            {
              'value': 'MICROSECONDS',
              'description': null,
              'shortDescription': null
            },
            {
              'value': 'MILLISECONDS',
              'description': null,
              'shortDescription': null
            },
            {
              'value': 'SECONDS',
              'description': null,
              'shortDescription': null
            },
            {
              'value': 'MINUTES',
              'description': null,
              'shortDescription': null
            },
            {
              'value': 'HOURS',
              'description': null,
              'shortDescription': null
            },
            {
              'value': 'DAYS',
              'description': null,
              'shortDescription': null
            }
          ],
          'valueProviders': [
            {
              'name': 'java.util.concurrent.TimeUnit',
              'parameters': {}
            }
          ]
        },
        'deprecation': null,
        'deprecated': false
      },
      {
        'id': 'trigger.fixed-delay',
        'name': 'fixed-delay',
        'type': 'java.lang.Integer',
        'description': 'Fixed delay for periodic triggers.',
        'shortDescription': 'Fixed delay for periodic triggers.',
        'defaultValue': 1,
        'hints': {
          'keyHints': [],
          'keyProviders': [],
          'valueHints': [],
          'valueProviders': []
        },
        'deprecation': null,
        'deprecated': false
      },
      {
        'id': 'trigger.cron',
        'name': 'cron',
        'type': 'java.lang.String',
        'description': 'Cron expression value for the Cron Trigger.',
        'shortDescription': 'Cron expression value for the Cron Trigger.',
        'defaultValue': null,
        'hints': {
          'keyHints': [],
          'keyProviders': [],
          'valueHints': [],
          'valueProviders': []
        },
        'deprecation': null,
        'deprecated': false
      },
      {
        'id': 'trigger.initial-delay',
        'name': 'initial-delay',
        'type': 'java.lang.Integer',
        'description': 'Initial delay for periodic triggers.',
        'shortDescription': 'Initial delay for periodic triggers.',
        'defaultValue': 0,
        'hints': {
          'keyHints': [],
          'keyProviders': [],
          'valueHints': [],
          'valueProviders': []
        },
        'deprecation': null,
        'deprecated': false
      },
      {
        'id': 'trigger.max-messages',
        'name': 'max-messages',
        'type': 'java.lang.Long',
        'description': 'Maximum messages per poll, -1 means infinity.',
        'shortDescription': 'Maximum messages per poll, -1 means infinity.',
        'defaultValue': 1,
        'hints': {
          'keyHints': [],
          'keyProviders': [],
          'valueHints': [],
          'valueProviders': []
        },
        'deprecation': null,
        'deprecated': false
      },
      {
        'id': 'trigger.date-format',
        'name': 'date-format',
        'type': 'java.lang.String',
        'description': 'Format for the date value.',
        'shortDescription': 'Format for the date value.',
        'defaultValue': null,
        'hints': {
          'keyHints': [],
          'keyProviders': [],
          'valueHints': [],
          'valueProviders': []
        },
        'deprecation': null,
        'deprecated': false
      }
    ],
  }

];

interface RawMetadata {
  name: string;
  type: string;
  description: string;
  options: Array<Flo.PropertyMetadata>;
}

export class MockSharedAppService extends AppService {

  constructor() {
    super(null);
  }

  getApps(page: number, size: number, search?: string, type?: ApplicationType, sort?: string, order?: string): Observable<AppPage> {

    const appPage = new AppPage();
    const seekType = ApplicationType[type];
    const apps = METAMODEL_DATA
      .filter(d => !type || d.type === type.toString())
      .map(App.parse);
    appPage.items = apps;
    appPage.page = 0;
    appPage.total = apps.length;
    appPage.size = apps.length;
    appPage.pages = 1;
    return of(appPage);
  }

  getApp(name: string, type: ApplicationType, appVersion?: string): Observable<DetailedApp> {
    const rawData = METAMODEL_DATA.find(d => d.name === name && (!type || d.type === type.toString()));
    if (rawData) {
      return of(DetailedApp.parse(rawData));
    } else {
      return EMPTY;
    }
  }

}
