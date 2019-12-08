import { GraphNodePropertiesSource } from '../../../../shared/flo/support/graph-node-properties-source';
import { ApplicationType } from '../../../../shared/model';
import { AppUiProperty } from '../../../../shared/flo/support/app-ui-property';
import { Flo, Properties } from 'spring-flo';
import { dia } from 'jointjs';
import PropertiesSource = Properties.PropertiesSource;
import { AppMetadata } from '../../../../shared/flo/support/app-metadata';

export interface StreamHead {
  presentStreamNames: string[];
}

export interface StreamAppPropertiesSource extends PropertiesSource {
  getStreamHead(): StreamHead;
}


/**
 * Properties source for a stream graph node
 *
 * @author Alex Boyko
 */
export class StreamGraphPropertiesSource extends GraphNodePropertiesSource implements StreamAppPropertiesSource {

  constructor(cell: dia.Cell, private streamHead: StreamHead) {
    super(cell);
  }

  protected createNotationalProperties(): AppUiProperty[] {
    const notationalProperties = [];
    if (typeof ApplicationType[this.cell.attr('metadata/group')] === 'number') {
      notationalProperties.push({
        id: 'label',
        name: 'label',
        type: null,
        defaultValue: this.cell.attr('metadata/name'),
        attr: 'node-name',
        value: this.cell.attr('node-name'),
        description: 'Label of the app',
        isSemantic: false
      });
    }
    if (this.streamHead) {
      notationalProperties.push({
        id: 'stream-name',
        name: 'stream name',
        type: null,
        value: this.cell.attr('stream-name'),
        defaultValue: '',
        description: 'The name of the stream started by this app',
        attr: 'stream-name',
        isSemantic: false
      });
    }

    return notationalProperties;
  }

  protected createProperty(metadata: Flo.PropertyMetadata): AppUiProperty {
    const property: any = super.createProperty(metadata);
    if (this.cell instanceof dia.Link) {
      const link = <dia.Link> this.cell;
      switch (metadata.id) {
        case 'outputChannel':
          property.type = Properties.InputType[Properties.InputType.SELECT];
          const sourceMetadata = link.getSourceElement().attr('metadata');
          if (sourceMetadata instanceof AppMetadata) {
            const sourceAppMetadata = <AppMetadata> sourceMetadata;
            property.valueOptions = sourceAppMetadata.outputChannels || [];
          } else {
            property.valueOptions = [];
          }
          break;
        case 'inputChannel':
          property.type = Properties.InputType[Properties.InputType.SELECT];
          const targetMetadata = link.getTargetElement().attr('metadata');
          if (targetMetadata instanceof AppMetadata) {
            const targetAppMetadata = <AppMetadata> targetMetadata;
            property.valueOptions = targetAppMetadata.inputChannels || [];
          } else {
            property.valueOptions = [];
          }
          break;
      }
    }
    return property;
  }

  protected determineAttributeName(metadata: Flo.PropertyMetadata): string {
    if (this.cell.attr('metadata/group') === 'other') {
      // For something in the other group (like tap) use the id not the name of the property
      return `props/${metadata.id}`;
    }
    return super.determineAttributeName(metadata);
  }

  getStreamHead() {
    return this.streamHead;
  }

}
