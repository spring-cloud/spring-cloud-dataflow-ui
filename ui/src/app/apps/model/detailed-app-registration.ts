import { Selectable } from '../../shared/model/selectable';
import { ApplicationType } from './application-type';
import { AppRegistration } from './app-registration';

/**
 * The DetailedAppRegistration provides additional information compared
 * to the base {@link AppRegistration} such as options
 * ({@link ConfigurationMetadataProperty}).
 *
 * @author Gunnar Hillert
 */
export class DetailedAppRegistration extends AppRegistration {

  public options: ConfigurationMetadataProperty[];

  constructor(
    name?: string,
    type?: ApplicationType,
    uri?: string ) {
      super(name, type, uri);
    }
}

export class ConfigurationMetadataProperty {
  public  id: string;
  public  name: string;
  public  type: string;
  public  description: string;
  public  defaultValue: string;
  public  deprecation: string;
}
