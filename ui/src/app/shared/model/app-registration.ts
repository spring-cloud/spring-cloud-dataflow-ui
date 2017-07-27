import { Selectable } from '../../shared/model/selectable';
import { ApplicationType } from './application-type';

/**
 * Represents an App Registration and implements Selectable
 * so it can be used in multi-select data-grids.
 *
 * @author Gunnar Hillert
 */
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
