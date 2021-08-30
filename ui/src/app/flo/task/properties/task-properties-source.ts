import {Flo, Properties} from 'spring-flo';
import {dia} from 'jointjs';
import {GraphNodePropertiesSource} from '../../shared/support/graph-node-properties-source';
import {AppUiProperty} from '../../shared/support/app-ui-property';
import {ApplicationType} from '../../../shared/model/app.model';
import Promise = JQuery.Promise;

export const READER_PROPERTIES_KIND = 'readers';
export const WRITER_PROPERTIES_KIND = 'writers';
export const APP_PROPERTIES_KIND = 'app';

export enum TaskIO {
  NONE = 'None',
  FILE = 'File',
  KAFKA = 'Kafka',
  AMQP = 'AMQP',
  JDBC = 'JDBC'
}

/**
 * Properties source for Composed Tasks graph node
 *
 * @author Alex Boyko
 */
export class TaskGraphPropertiesSource extends GraphNodePropertiesSource {
  protected createNotationalProperties(): AppUiProperty[] {
    const notationalProperties = [];
    const ioTypes = Object.keys(TaskIO).filter(k => typeof k === 'string').map(k => ({value: TaskIO[k]}));
    console.log(JSON.stringify(ioTypes));
    if (typeof ApplicationType[this.cell.prop('metadata/group')] === 'number') {
      notationalProperties.push(
        {
          id: 'label',
          name: 'label',
          defaultValue: this.cell.prop('metadata/name'),
          attr: 'node-label',
          value: this.cell.attr('node-label'),
          description: 'Label of the task',
          isSemantic: false,
          kind: APP_PROPERTIES_KIND
        }, {
          id: 'reader',
          name: 'Reader',
          defaultValue: '',
          attr: '',
          value: this.computeCurrentReader(),
          description: 'Task input reader type',
          isSemantic: true,
          kind: READER_PROPERTIES_KIND,
          hints: {
            valueHints: ioTypes
          }
        },         {
          id: 'writer',
          name: 'Writer',
          defaultValue: '',
          attr: '',
          value: this.computeCurrentWriter(),
          description: 'Task output writer type',
          isSemantic: true,
          kind: WRITER_PROPERTIES_KIND,
          hints: {
            valueHints: ioTypes
          }
        }
      );
    }
    return notationalProperties;
  }


  protected createProperty(metadata: Flo.PropertyMetadata): AppUiProperty {
    const prop = super.createProperty(metadata);
    prop.kind = APP_PROPERTIES_KIND;
    return prop;
  }

  private computeCurrentReader(): string {
    return '';
  }

  private computeCurrentWriter(): string {
    return '';
  }

  applyChanges(properties: Properties.Property[]) {
    super.applyChanges(properties);
  }

  protected determineAttributeName(metadata: Flo.PropertyMetadata): string {
    if (this.cell instanceof dia.Link) {
      // For links properties are always id based
      return `props/${metadata.id}`;
    }
    return super.determineAttributeName(metadata);
  }
}
