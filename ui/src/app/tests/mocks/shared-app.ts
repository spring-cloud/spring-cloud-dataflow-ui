import { SharedAppsService } from '../../shared/services/shared-apps.service';
import { PageRequest } from '../../shared/model/pagination/page-request.model';
import { ApplicationType } from '../../shared/model/application-type';
import { Page } from '../../shared/model/page';
import { AppRegistration } from '../../shared/model/app-registration.model';
import { DetailedAppRegistration } from '../../shared/model/detailed-app-registration.model';
import { Flo } from 'spring-flo';
import { Observable, EMPTY, of } from 'rxjs';

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
  }];

interface RawMetadata {
  name: string;
  type: string;
  description: string;
  options: Array<Flo.PropertyMetadata>;
}

export class MockSharedAppService extends SharedAppsService {

  constructor() {
    super(null, null, null);
  }

  getApps(pageRequest: PageRequest, type?: ApplicationType, search?: string,
          sort?: Array<{ sort: string, order: string }>): Observable<Page<AppRegistration>> {

    const page = new Page<AppRegistration>();
    const apps = METAMODEL_DATA
      .filter(d => !type || d.type === ApplicationType[type])
      .map(AppRegistration.fromJSON);
    page.items = apps;
    page.pageNumber = 0;
    page.pageSize = apps.length;
    page.totalElements = apps.length;
    page.totalPages = 1;
    return of(page);
  }

  getAppInfo(appType: ApplicationType, appName: string, appVersion?: string): Observable<DetailedAppRegistration> {
    const rawData = METAMODEL_DATA.find(d => d.name === appName && (!appType || d.type === ApplicationType[appType]));
    if (rawData) {
      return of(new DetailedAppRegistration().deserialize(rawData));
    } else {
      return EMPTY;
    }
  }

}
