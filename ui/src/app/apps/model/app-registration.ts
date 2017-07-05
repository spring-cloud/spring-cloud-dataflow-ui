import { Selectable } from '../../shared/model/selectable';

export class AppRegistration implements Selectable {
  public name: String;
  public type: String;
  public uri: String;
  public isSelected: boolean;

  constructor(
    name: String,
    type: String,
    uri: String ) {
      this.name = name;
      this.type = type;
      this.uri = uri;
    }
}