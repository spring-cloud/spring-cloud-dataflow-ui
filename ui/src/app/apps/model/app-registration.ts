import { Selectable } from '../../shared/model/selectable';
import { ApplicationType } from './application-type';

export class AppRegistration implements Selectable {
  public name: string;
  public type: ApplicationType;
  public uri: string;
  public metaDataUri: string;
  public force: boolean;

  constructor(
    name?: string,
    type?: ApplicationType,
    uri?: string ) {
      this.name = name;
      this.type = type;
      this.uri = uri;
    }
    get isSelected(): boolean {
        return this.force;
    }
    set isSelected(isSelected: boolean) {
        this.force = isSelected;
    }
}