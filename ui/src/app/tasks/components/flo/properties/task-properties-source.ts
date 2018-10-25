import { GraphNodePropertiesSource } from '../../../../shared/flo/support/graph-node-properties-source';
import { ApplicationType } from '../../../../shared/model';
import { Flo } from 'spring-flo';
import { dia } from 'jointjs';
import { AppUiProperty } from '../../../../shared/flo/support/app-ui-property';

/**
 * Properties source for Composed Tasks graph node
 *
 * @author Alex Boyko
 */
export class TaskGraphPropertiesSource extends GraphNodePropertiesSource {

  protected createNotationalProperties(): Array<AppUiProperty> {
    const notationalProperties = [];
    if (typeof ApplicationType[this.cell.attr('metadata/group')] === 'number') {
      notationalProperties.push({
        id: 'label',
        name: 'label',
        defaultValue: this.cell.attr('metadata/name'),
        attr: 'node-label',
        value: this.cell.attr('node-label'),
        description: 'Label of the task',
        isSemantic: false
      });
    }
    return notationalProperties;
  }

  protected determineAttributeName(metadata: Flo.PropertyMetadata): string {
    if (this.cell instanceof dia.Link) {
      // For links properties are always id based
      return `props/${metadata.id}`;
    }
    return super.determineAttributeName(metadata);
  }

}
