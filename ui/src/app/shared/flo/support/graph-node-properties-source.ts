import { Flo, Properties } from 'spring-flo';
import { AppUiProperty } from './app-ui-property';

/**
 * Able to provide AppUiProperty array from the graph node to be consumed by properties dialog
 * as well apply changes from the properties changed in the dialog to the graph node
 *
 * @author Alex Boyko
 */
export class GraphNodePropertiesSource extends Properties.DefaultCellPropertiesSource {

  getProperties(): Promise<Array<AppUiProperty>> {
    return super.getProperties().then(semanticProperties => {
      const notationalProperties = this.createNotationalProperties();
      return semanticProperties ? notationalProperties.concat(<AppUiProperty[]>semanticProperties) : notationalProperties;
    });
  }

  protected determineAttributeName(metadata: Flo.PropertyMetadata): string {
    const nameAttr = `props/${metadata.name}`;
    const idAttr = `props/${metadata.id}`;
    const valueFromName = this.cell.attr(nameAttr);
    const valueFromId = this.cell.attr(idAttr);
    if ((valueFromName === undefined || valueFromName === null) && !(valueFromId === undefined || valueFromId === null)) {
      return idAttr;
    } else {
      return nameAttr;
    }
  }

  protected createProperty(metadata: Flo.PropertyMetadata): AppUiProperty {
    return {
      id: metadata.id,
      name: metadata.name,
      type: metadata.type,
      defaultValue: metadata.defaultValue,
      attr: this.determineAttributeName(metadata),
      value: this.cell.attr(this.determineAttributeName(metadata)),
      description: metadata.description,
      valueOptions: metadata.options,
      isSemantic: true,
      code: metadata.code
    };
  }

  protected createNotationalProperties(): Array<AppUiProperty> {
    return [];
  }

}
