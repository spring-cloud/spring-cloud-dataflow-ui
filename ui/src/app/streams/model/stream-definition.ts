import { Page } from '../../shared/model/page';

/**
 * Represents a StreamDefiniton.
 *
 * @author Janne Valkealahti
 * @author Gunnar Hillert
 * @author Damien Vitrac
 */
export class StreamDefinition {

  public name: string;

  public dslText: string;

  public description: string;

  public originalDslText: string;

  public status: string;

  public deploymentProperties: any;

  public force = false;

  constructor(name: string, dslText: string, originalDslText: string, description: string, status: string) {
    this.name = name;
    this.dslText = dslText;
    this.originalDslText = originalDslText;
    this.description = description ? description : '';
    this.status = status;
  }

  /**
   * Create a StreamDefinition from JSON
   * @param input
   * @returns {StreamDefinition}
   */
  public static fromJSON(input): StreamDefinition {
    const stream = new StreamDefinition(input.name, input.dslText, input.originalDslText, input.description, input.status);
    if (input.deploymentProperties && input.deploymentProperties.length > 0) {
      stream.deploymentProperties = JSON.parse(input.deploymentProperties);
    }
    return stream;
  }

  /**
   * Create a Page<StreamDefinition> from JSON
   * @param input
   * @returns {Page<StreamDefinition>}
   */
  public static pageFromJSON(input): Page<StreamDefinition> {
    const page = Page.fromJSON<StreamDefinition>(input);
    if (input && input._embedded && input._embedded.streamDefinitionResourceList) {
      page.items = input._embedded.streamDefinitionResourceList.map(StreamDefinition.fromJSON);
    }
    return page;
  }

}
