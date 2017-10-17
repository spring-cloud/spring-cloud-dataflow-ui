import { Flo } from 'spring-flo';
import { DetailedAppRegistration, ConfigurationMetadataProperty } from '../../model/detailed-app-registration.model';
import { Observable} from 'rxjs/Observable';


/**
 * Class containing metadata for a stream application.
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
export class AppMetadata implements Flo.ElementMetadata {

  private _dataPromise: Promise<DetailedAppRegistration>;

  private _propertiesPromise: Promise<Map<string, Flo.PropertyMetadata>>;

  constructor(
    private _group: string,
    private _name: string,
    private _dataObs: Observable<DetailedAppRegistration>,
    private _metadata?: Flo.ExtraMetadata
  ) {}

  get dataPromise(): Promise<DetailedAppRegistration> {
    if (!this._dataPromise) {
      this._dataPromise = new Promise(resolve => this._dataObs.subscribe(data => resolve(data), () => resolve(null)));
    }
    return this._dataPromise;
  }

  get propertiesPromise(): Promise<Map<string, Flo.PropertyMetadata>> {
    if (!this._propertiesPromise) {
      this._propertiesPromise = new Promise(resolve => this.dataPromise.then((data: DetailedAppRegistration) => {
        const properties = new Map<string, Flo.PropertyMetadata>();
        if (data) {
          data.options.map((o: ConfigurationMetadataProperty) => {
            const propertyMetadata: Flo.PropertyMetadata = {
              id: o.id,
              name: o.name,
              description: o.description || o.shortDescription,
              defaultValue: o.defaultValue,
              type: o.type
            };
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

  get(property: string): Promise<Flo.PropertyMetadata> {
    return this.propertiesPromise.then(properties => properties.get(property));
  }

  properties(): Promise<Map<string, Flo.PropertyMetadata>> {
    return this.propertiesPromise;
  }

  get metadata(): Flo.ExtraMetadata {
    return this._metadata;
  }

}
