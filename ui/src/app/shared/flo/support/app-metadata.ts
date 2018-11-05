import { Flo } from 'spring-flo';
import { DetailedAppRegistration, ConfigurationMetadataProperty } from '../../model/detailed-app-registration.model';
import { Observable } from 'rxjs';
import { Utils } from './utils';

/**
 * Class containing metadata for a stream application.
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
export class AppPropertyMetadata implements Flo.PropertyMetadata {

  public options: string[];

  public code: CodeOptions;

  constructor(private metadata: ConfigurationMetadataProperty) {}

  get id(): string {
    return this.metadata.id;
  }

  get name(): string {
    return this.metadata.name;
  }

  get description(): string {
    return this.metadata.description || this.metadata.shortDescription;
  }

  get defaultValue() {
    return this.metadata.defaultValue;
  }

  get type(): string {
    return this.metadata.type;
  }

  get sourceType(): string {
    return this.metadata.sourceType;
  }

}

export class AppMetadata implements Flo.ElementMetadata {

  private _dataPromise: Promise<DetailedAppRegistration>;

  private _propertiesPromise: Promise<Map<string, AppPropertyMetadata>>;

  constructor(
    private _group: string,
    private _name: string,
    private _version: string,
    private _dataObs: Observable<DetailedAppRegistration>,
    private _metadata?: Flo.ExtraMetadata
  ) {}

  get dataPromise(): Promise<DetailedAppRegistration> {
    if (!this._dataPromise) {
      this._dataPromise = new Promise(resolve => this._dataObs.subscribe(data => resolve(data), () => resolve(null)));
    }
    return this._dataPromise;
  }

  get propertiesPromise(): Promise<Map<string, AppPropertyMetadata>> {
    if (!this._propertiesPromise) {
      this._propertiesPromise = new Promise(resolve => this.dataPromise.then((data: DetailedAppRegistration) => {
        const properties = new Map<string, AppPropertyMetadata>();
        if (data) {
          data.options.map((o: ConfigurationMetadataProperty) => {
            const propertyMetadata: AppPropertyMetadata = new AppPropertyMetadata(o);
            if (o.sourceType === Utils.SCRIPTABLE_TRANSFORM_SOURCE_TYPE) {
              switch (o.name.toLowerCase()) {
                case 'language':
                  propertyMetadata.options = [
                    'groovy', 'javascript', 'ruby', 'python'
                  ];
                  break;
                case 'script':
                  propertyMetadata.code = {
                    langPropertyName: 'scriptable-transformer.language'
                  };
                  break;
              }
            } else if (o.sourceType === Utils.RX_JAVA_PROCESSOR_SOURCE_TYPE) {
              if (o.name.toLowerCase() === 'code') {
                propertyMetadata.code = {
                  language: 'java'
                };
              }
            }
            if (o.type) {
              switch (o.type) {
                case 'java.util.concurrent.TimeUnit':
                  propertyMetadata.options = [
                    'NANOSECONDS',
                    'MICROSECONDS',
                    'MILLISECONDS',
                    'SECONDS',
                    'MINUTES',
                    'HOURS',
                    'DAYS'
                  ];
              }
            }
            properties.set(o.id, propertyMetadata);
          });
        }
        resolve(properties);
      }));
    }
    return this._propertiesPromise;
  }

  get name(): string {
    return this._name;
  }

  get group(): string {
    return this._group;
  }

  description(): Promise<string> {
    return Promise.resolve('');
  }

  get(property: string): Promise<AppPropertyMetadata> {
    return this.propertiesPromise.then(properties => properties.get(property));
  }

  properties(): Promise<Map<string, AppPropertyMetadata>> {
    return this.propertiesPromise;
  }

  get metadata(): Flo.ExtraMetadata {
    return this._metadata;
  }

  get version(): string {
    return this._version;
  }

}

export interface CodeOptions {
  readonly language?: string;
  readonly langPropertyName?: string;
}
