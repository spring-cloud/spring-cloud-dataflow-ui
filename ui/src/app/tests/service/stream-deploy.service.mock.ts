import { StreamDeployService } from '../../streams/streams/stream-deploy.service';
import { Observable, of } from 'rxjs';
import { Stream, StreamDeployConfig } from '../../shared/model/stream.model';
import { GET_STREAM } from '../data/stream';
import { APP_DETAILS, CONFIG } from '../data/stream-deploy';
import { ApplicationType } from '../../shared/model/app.model';

export class StreamDeployServiceMock {
  static mock: any = null;

  deploymentProperties(name: string): Observable<any> {
    const properties = [];
    const ignoreProperties = [];
    const stream = Stream.parse(GET_STREAM);
    return of({
      properties,
      ignoreProperties: [...properties, ...ignoreProperties],
      stream
    });
  }

  config(id: string): Observable<StreamDeployConfig> {
    const config = new StreamDeployConfig();
    config.id = CONFIG.id;
    config.platform = CONFIG.platform;
    config.deployers = CONFIG.deployers;
    config.apps = CONFIG.apps;
    return of(config);
  }

  appDetails(type: ApplicationType, name: string, version: string) {
    return of(APP_DETAILS);
  }

  static get provider() {
    if (!StreamDeployServiceMock.mock) {
      StreamDeployServiceMock.mock = new StreamDeployServiceMock();
    }
    return { provide: StreamDeployService, useValue: StreamDeployServiceMock.mock };
  }
}
