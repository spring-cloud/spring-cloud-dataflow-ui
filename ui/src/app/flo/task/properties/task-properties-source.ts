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
  protected createNotationalProperties(propGroups: {[group: string]: string[]}): AppUiProperty[] {
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
      if (Object.keys(propGroups).length > 0) {
        const readerGroups: {[group: string]: string[]} = {};
        const writerGroups: {[group: string]: string[]} = {};

        Object.keys(propGroups).forEach(g => {
          if (g.startsWith(READER_PROPERTIES_KIND)) {
            readerGroups[g] = propGroups[g];
          } else if (g.startsWith(WRITER_PROPERTIES_KIND)) {
            writerGroups[g] = propGroups[g];
          }
        });

        notationalProperties.push(
          {
            id: READER_PROPERTIES_KIND,
            name: 'Reader',
            defaultValue: undefined,
            attr: 'reader',
            value:
              this.cell.attr('reader') ||
              this.computeCurrentIOType(this.cell.attr('props'), readerGroups, READER_PROPERTIES_KIND + '.'),
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
                }
              ]
            }
          },
          {
            id: WRITER_PROPERTIES_KIND,
            name: 'Writer',
            defaultValue: undefined,
            attr: 'writer',
            value:
              this.cell.attr('writer') ||
              this.computeCurrentIOType(this.cell.attr('props'), writerGroups, WRITER_PROPERTIES_KIND + '.'),
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
                }
              ]
            }
          }
        );
      }
    }
    return notationalProperties;
  }

  private computeCurrentIOType(
    props: any,
    groups: {[group: string]: string[]},
    trimPrefix: string
  ): string | undefined {
    if (!props) {
      return undefined;
    }
    const ioPropsMap: {[prop: string]: number} = {};
    Object.keys(props).forEach(property => {
      const group = Object.keys(groups).find(g => groups[g].indexOf(property) >= 0);
      if (group) {
        if (typeof ioPropsMap[group] === 'number') {
          ioPropsMap[group]++;
        } else {
          ioPropsMap[group] = 1;
        }
      }
    });
    // const group = Object.keys(ioPropsMap).reduce((r, g) => {
    //   if (r && ioPropsMap[r] < ioPropsMap[g]) {
    //     return g;
    //   } else {
    //     return r;
    //   }
    // });
    if (Object.keys(ioPropsMap).length === 1) {
      const group = Object.keys(ioPropsMap)[0];
      if (group && group.length > trimPrefix.length) {
        return group.substr(trimPrefix.length);
      }
    }
    return undefined;
  }

  applyChanges(properties: Properties.Property[]) {
    const readerProp = properties.find(p => p.id === READER_PROPERTIES_KIND);
    const writerProp = properties.find(p => p.id === WRITER_PROPERTIES_KIND);

    this.resetNotApplicableIoProps(properties, readerProp);
    this.resetNotApplicableIoProps(properties, writerProp);

    super.applyChanges(properties);
  }

  private resetNotApplicableIoProps(properties: Properties.Property[], filterProperty: Properties.Property): void {
    if (filterProperty) {
      const prefixPropertyFilter = filterProperty.id + '.';
      const group = prefixPropertyFilter + (filterProperty.value || '');
      properties
        .filter(p => p.group && p.group.startsWith(prefixPropertyFilter) && p.group !== group)
        .forEach(p => (p.value = p.defaultValue));
    }
  }

  private filterIoProps(properties: Properties.Property[], filterProperty: Properties.Property): Properties.Property[] {
    if (filterProperty) {
      const prefixPropertyFilter = filterProperty.id + '.';
      const group = prefixPropertyFilter + (filterProperty.value || '');
      properties = properties.filter(
        p =>
          !(
            p.group &&
            (p.group === filterProperty.id || (p.group.startsWith(prefixPropertyFilter) && p.group !== group))
          )
      );
    }
    return properties;
  }

  protected determineAttributeName(metadata: Flo.PropertyMetadata): string {
    if (this.cell instanceof dia.Link) {
      // For links properties are always id based
      return `props/${metadata.id}`;
    }
    const nameAttr = `props/${metadata.name}`;
    const idAttr = `props/${metadata.id}`;
    const valueFromName = this.cell.attr(nameAttr);
    const valueFromId = this.cell.attr(idAttr);
    if (
      !(valueFromName === undefined || valueFromName === null) &&
      (valueFromId === undefined || valueFromId === null)
    ) {
      return nameAttr;
    } else {
      return idAttr;
    }
  }
}
