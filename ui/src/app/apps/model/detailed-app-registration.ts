import { Selectable } from '../../shared/model/selectable';
import { ApplicationType } from './application-type';
import { AppRegistration } from './app-registration';

export class DetailedAppRegistration extends AppRegistration {
  
  public options: ConfigurationMetadataProperty[];
  public shortDescription: string;

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
  public  shortDescription: string;
  public  defaultValue: string;
  public  hints: string;
  public  deprecation: string;
}