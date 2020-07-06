import { Flo } from 'spring-flo';
import { dia } from 'jointjs';
import { GraphNodePropertiesSource } from '../../shared/support/graph-node-properties-source';
import { AppUiProperty } from '../../shared/support/app-ui-property';
import { ApplicationType } from '../../../shared/model/app.model';

/**
 * Properties source for Composed Tasks graph node
 *
 * @author Alex Boyko
 */
export class TaskGraphPropertiesSource extends GraphNodePropertiesSource {

  protected createNotationalProperties(): Array<AppUiProperty> {
    const notationalProperties = [];
    if (typeof ApplicationType[this.cell.prop('metadata/group')] === 'number') {
      notationalProperties.push({
        id: 'label',
        name: 'label',
        defaultValue: this.cell.prop('metadata/name'),
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
