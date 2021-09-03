import {Flo, Properties} from 'spring-flo';
import {dia} from 'jointjs';
import {GraphNodePropertiesSource} from '../../shared/support/graph-node-properties-source';
import {AppUiProperty} from '../../shared/support/app-ui-property';
import {ApplicationType} from '../../../shared/model/app.model';
import Promise = JQuery.Promise;

export const READER_PROPERTIES_KIND = 'readers';
export const WRITER_PROPERTIES_KIND = 'writers';
export const IO_COMMON_PROPERTIES_KIND = 'common';

/**
 * Properties source for Composed Tasks graph node
 *
 * @author Alex Boyko
 */
export class TaskGraphPropertiesSource extends GraphNodePropertiesSource {
  protected createNotationalProperties(): AppUiProperty[] {
    const notationalProperties = [];
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
        }, {
          id: READER_PROPERTIES_KIND,
          name: 'Reader',
          defaultValue: undefined,
          attr: 'reader',
          value: this.computeCurrentReader(),
          description: 'Task input reader type',
          isSemantic: false,
          group: READER_PROPERTIES_KIND,
          hints: {
            valueHints: [
              {
                name: 'File',
                value: 'flatfileitemreader'
              },
              {
                name: 'Kafka',
                value: 'kafkaitemreader'
              },
              {
                name: 'AMQP',
                value: 'amqpitemreader'
              },
              {
                name: 'JDBC',
                value: 'jdbccursoritemreader'
              },
            ]
          }
        },         {
          id: WRITER_PROPERTIES_KIND,
          name: 'Writer',
          defaultValue: undefined,
          attr: 'writer',
          value: this.computeCurrentWriter(),
          description: 'Task output writer type',
          isSemantic: false,
          group: WRITER_PROPERTIES_KIND,
          hints: {
            valueHints: [
              {
                name: 'File',
                value: 'flatfileitemwriter'
              },
              {
                name: 'Kafka',
                value: 'kafkaitemwriter'
              },
              {
                name: 'AMQP',
                value: 'amqpitemwriter'
              },
              {
                name: 'JDBC',
                value: 'jdbccursoritemwriter'
              },
            ]
          }
        }
      );
    }
    return notationalProperties;
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
