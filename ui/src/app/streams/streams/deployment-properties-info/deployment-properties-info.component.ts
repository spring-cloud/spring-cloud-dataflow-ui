import { Component, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { StreamDefinition } from '../../model/stream-definition';
import { StreamsService } from '../../streams.service';

const VERSION_PROPERTY_KEY_PREFIX = 'maven://';

export class KeyValuePair {
  constructor(public key: string,
              public value: string) {
  }
}

export class DeployedAppProperties {
  constructor(public name: string,
              public version: string,
              public props: KeyValuePair[]) {
  }
}


@Component({
  selector: 'app-stream-deployment-properties-info',
  templateUrl: './deployment-properties-info.component.html',
  styleUrls: ['./deployment-properties-info.component.scss'],
})
/**
 * Component that shows stream deployment info.
 *
 * @author Alex Boyko
 */
export class DeploymentPropertiesInfoComponent {

  public deploymentProperties: Observable<DeployedAppProperties[]>;

  constructor(private streamsService: StreamsService) {
  }

  @Input()
  set streamDefinition(streamDef: StreamDefinition) {
    if (streamDef.deploymentProperties) {
      this.deploymentProperties = of(this.extractData(streamDef.deploymentProperties)).pipe(share());
    } else {
      this.deploymentProperties = this.streamsService.getDeploymentInfo(streamDef.name.toString()).pipe(
        map(d => {
          streamDef.deploymentProperties = d.deploymentProperties;
          return this.extractData(streamDef.deploymentProperties);
        }),
        share()
      );
    }
  }

  getAppTitle(app: DeployedAppProperties): string {
    if (app.version) {
      return `${app.name} (${app.version})`;
    } else {
      return app.name;
    }
  }

  private extractData(deploymentProperties: any) {
    return Object.keys(deploymentProperties).map(k => this.extractSingleApp(k, deploymentProperties[k]));
  }

  private extractSingleApp(app: string, data: any) {
    const props = [];
    let version;
    Object.keys(data).forEach(k => {
      if (k.startsWith(VERSION_PROPERTY_KEY_PREFIX)) {
        version = data[k];
      } else {
        props.push(new KeyValuePair(k, data[k]));
      }
    });
    return new DeployedAppProperties(app, version, props);
  }

}
