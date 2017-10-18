import { Expandable } from './../../shared/model/expandable';

/**
 * Represents a StreamDefiniton.
 *
 * @author Janne Valkealahti
 * @author Gunnar Hillert
 * @author Damien Vitrac
 */
export class StreamDefinition implements Expandable {

  public name: String;
  public dslText: String;
  public status: String;
  public isExpanded = false;
  public force = false;

  public deploymentProperties: any = {};

  constructor(
      name: String,
      dslText: String,
      status: String) {
    this.name = name;
    this.dslText = dslText;
    this.status = status;
  }

  get isSelected(): boolean {
    return this.force;
  }
  set isSelected(isSelected: boolean) {
    this.force = isSelected;
  }

  /**
   * Marks a StreamDefinition as expanded/collapsed.
   */
  public toggleIsExpanded() {
    this.isExpanded = !this.isExpanded;
    console.log(`StreamDefinition is ${this.isExpanded ? '' : 'not '}expanded`, this);
  }
}
