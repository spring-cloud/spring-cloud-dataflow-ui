/*
 * Copyright 2015-2020 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Flo } from 'spring-flo';
import { Injectable } from '@angular/core';
import { convertGraphToText } from './graph-to-text';
import { convertTextToGraph } from './text-to-graph';
import { OTHER_GROUP_TYPE } from './support/shapes';
import { AppService } from '../../shared/api/app.service';
import { LoggerService } from '../../shared/service/logger.service';
import { App, ApplicationType } from '../../shared/model/app.model';
import { AppMetadata } from '../shared/support/app-metadata';

/**
 * Metamodel Service for Flo based Stream Definition graph editor
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
@Injectable()
export class MetamodelService implements Flo.Metamodel {

  private listeners: Array<Flo.MetamodelListener> = [];

  private request: Promise<Map<string, Map<string, Flo.ElementMetadata>>>;

  constructor(protected appService: AppService) {
  }

  textToGraph(flo: Flo.EditorContext, dsl: string): Promise<any> {
    LoggerService.log('> textToGraph ' + dsl);
    return new Promise(resolve => {
      this.load().then((metamodel) => resolve(convertTextToGraph(dsl, flo, metamodel)));
    });
  }

  graphToText(flo: Flo.EditorContext): Promise<string> {
    return Promise.resolve(convertGraphToText(flo.getGraph()));
  }

  subscribe(listener: Flo.MetamodelListener) {
    this.listeners.push(listener);
  }

  unsubscribe?(listener: Flo.MetamodelListener) {
    const index = this.listeners.indexOf(listener);
    if (index >= 0) {
      this.listeners.splice(index);
    }
  }

  groups(): Array<string> {
    return ['app', 'source', 'processor', 'sink', 'other'];
  }

  load(): Promise<Map<string, Map<string, Flo.ElementMetadata>>> {
    return this.request ? this.request : this.refresh();
  }

  refresh(): Promise<Map<string, Map<string, Flo.ElementMetadata>>> {
    const metamodel = new Map<string, Map<string, Flo.ElementMetadata>>();
    this.addOtherGroup(metamodel);
    this.request = new Promise(resolve => {
      this.appService.getApps(0, 10000, null, null, 'name', 'ASC').subscribe(
        data => {
          data.items.filter(item => {
            return item.type.toString() === ApplicationType[ApplicationType.app]
              || item.type.toString() === ApplicationType[ApplicationType.source]
              || item.type.toString() === ApplicationType[ApplicationType.processor]
              || item.type.toString() === ApplicationType[ApplicationType.sink];
          }).forEach(item => {

            if (!metamodel.has(item.type.toString())) {
              metamodel.set(item.type.toString(), new Map<string, AppMetadata>());
            }
            const group: Map<string, Flo.ElementMetadata> = metamodel.get(item.type.toString());
            if (group.has(item.name)) {
              LoggerService.error(`Group '${item.type}' has duplicate element '${item.name}'`);
            } else {
              group.set(item.name, this.createEntry(item));
            }
          });

          this.addExtras(metamodel);

          resolve(metamodel);
        },
        error => {
          LoggerService.error(error);
          resolve(metamodel);
        }
      );
    });
    return this.request;
  }

  protected addExtras(metamodel: Map<string, Map<string, Flo.ElementMetadata>>) {

  }

  protected createEntry(reg: App, metadata?: Flo.ExtraMetadata): AppMetadata {
    return new AppMetadata(
      reg.type.toString(),
      reg.name,
      reg.version,
      this.appService.getApp(reg.name, reg.type),
      metadata
    );
  }

  private addOtherGroup(metamodel: Map<string, Map<string, Flo.ElementMetadata>>): void {
    const elements = new Map<string, Flo.ElementMetadata>()
      .set('tap', this.createMetadata('tap', OTHER_GROUP_TYPE, 'Tap into an existing app',
        new Map<string, Flo.PropertyMetadata>().set('name', {
            name: 'Source Destination Name',
            id: 'name',
            defaultValue: '',
            description: 'the identifier of the producer endpoint in a stream in the form <stream-name>.<app/app-name>',
            pattern: '[\\w_]+[\\w_-]*\\.[\\w_]+[\\w_-]*'
          }
        ), {
          'hide-tooltip-options': true,
        })
      )
      .set('destination', this.createMetadata('destination',
        OTHER_GROUP_TYPE,
        'A destination channel that can be used as a source or a sink',
        new Map<string, Flo.PropertyMetadata>().set('name', {
            name: 'name',
            id: 'name',
            defaultValue: '',
            description: 'the input/output destination name',
            pattern: '[\\w_]+[\\w_-]*'
          }
        ), {
          'fixed-name': true,
        })
      );
    metamodel.set(OTHER_GROUP_TYPE, elements);
  }

  protected createMetadata(name: string, group: string, description: string,
                         properties: Map<string, Flo.PropertyMetadata>, metadata?: Flo.ExtraMetadata): Flo.ElementMetadata {
    return {
      name,
      group,
      metadata,
      description: () => Promise.resolve(description),
      get: (property: string) => Promise.resolve(properties.get(property)),
      properties: () => Promise.resolve(properties)
    };

  }

  clearCachedData() {
    this.request = undefined;
  }

}
