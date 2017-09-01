/*
 * Copyright 2015-2016 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Flo } from 'spring-flo';
import { Injectable } from '@angular/core';
import { SharedAppsService } from '../../shared/services/shared-apps.service';
import { ApplicationType } from '../../shared/model/application-type';
import { DetailedAppRegistration, ConfigurationMetadataProperty } from '../../shared/model/detailed-app-registration.model';
import { convertGraphToText } from './graph-to-text';
import { convertTextToGraph } from './text-to-graph';
import { OTHER_GROUP_TYPE } from './shapes';
import { Observable}  from "rxjs";


/**
 * Metamodel Service for Flo based Stream Definition graph editor
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
@Injectable()
export class MetamodelService implements Flo.Metamodel {

    static DEBUG = false;

    static keepAllProperties = false; // TODO address when whitelisting properties fixed in SCDF

    private listeners : Array<Flo.MetamodelListener> = [];

    private request : Promise<Map<string, Map<string, Flo.ElementMetadata>>>;

    /**
     * Creates instance.
     * @param http handler for making calls to the data flow restful api
     * @param errorHandler used to generate the error messages.
     */
    constructor(
      private appsService : SharedAppsService,
    ) {}

    textToGraph(flo: Flo.EditorContext, dsl: string): void {
        console.log("> textToGraph "+dsl);
        this.load().then((metamodel) => { convertTextToGraph(dsl, flo, metamodel)});
    }

    graphToText(flo: Flo.EditorContext) : Promise<string> {
        return Promise.resolve(convertGraphToText(flo.getGraph()));
    }

    subscribe(listener: Flo.MetamodelListener) {
        this.listeners.push(listener);
    }

    unsubscribe?(listener: Flo.MetamodelListener) {
        let index = this.listeners.indexOf(listener);
        if (index >= 0) {
            this.listeners.splice(index);
        }
    }

    encodeTextToDSL(text: string): string {
        var retval = '\"' + text.replace(/(?:\r\n|\r|\n)/g, '\\n').replace(/"/g, '""') + '\"';
        return retval;
    }

    decodeTextFromDSL(dsl: string): string {
        if (dsl.charAt(0) === '\"' && dsl.charAt(dsl.length - 1) === '\"') {
            dsl = dsl.substr(1, dsl.length - 2);
        }
        var retval = dsl.replace(/\\n/g, '\n').replace(/\"\"/g, '"');
        return retval;
    }


    groups(): Array<string> {
        return ['source', 'processor', 'sink', 'other'];
    }

    load(): Promise<Map<string, Map<string, Flo.ElementMetadata>>> {
        return this.request ? this.request : this.refresh();
    }

    refresh(): Promise<Map<string, Map<string, Flo.ElementMetadata>>> {
        let metamodel = new Map<string, Map<string, Flo.ElementMetadata>>();
        this.addOtherGroup(metamodel);
        return new Promise(resolve => {
            this.appsService.getApps({page: 0, size: 1000}).subscribe(
                data => {
                    data.items.filter(item => {
                        return item.type.toString() === ApplicationType[ApplicationType.source]
                        || item.type.toString() === ApplicationType[ApplicationType.processor]
                        || item.type.toString() === ApplicationType[ApplicationType.sink];
                    }).forEach(item => {

                        if (!metamodel.has(item.type.toString())) {
                            metamodel.set(item.type.toString(), new Map<string, Flo.ElementMetadata>());
                        }
                        let group : Map<string, Flo.ElementMetadata> = metamodel.get(item.type.toString());
                        if (group.has(item.name)) {
                            console.error(`Group '${item.type}' has duplicate element '${item.name}'`);
                        } else {
                            group.set(item.name, this.createEntry(item.type, item.name));
                        }
                    });
                    resolve(metamodel);
                },
                error => {
                    console.error(error);
                    resolve(metamodel);
                }
            );
        });
    }

    private createEntry(type : ApplicationType, name, metadata? : Flo.ExtraMetadata) : Flo.ElementMetadata {
      return new StreamAppMetadata(
        type.toString(),
        name,
        this.appsService.getAppInfo(type, name),
        metadata
      );
    }

    private addOtherGroup(metamodel : Map<string, Map<string, Flo.ElementMetadata>>) : void {
        let elements = new Map<string, Flo.ElementMetadata>()
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
            .set('destination', this.createMetadata('destination', OTHER_GROUP_TYPE, 'A destination channel that can be used as a source or a sink',
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

    private createMetadata(name : string, group : string, description : string,
                           properties : Map<string, Flo.PropertyMetadata>, metadata? : Flo.ExtraMetadata) : Flo.ElementMetadata {
        return {
            name: name,
            group: group,
            metadata: metadata,
            description: () => Promise.resolve(description),
            get: (property : string) => Promise.resolve(properties.get(property)),
            properties: () => Promise.resolve(properties)
        };

    }

}

class StreamAppMetadata implements Flo.ElementMetadata {

  private _dataPromise : Promise<DetailedAppRegistration>;

  private _propertiesPromise : Promise<Map<string, Flo.PropertyMetadata>>;

  constructor(
    private _group : string,
    private _name : string,
    private _dataObs : Observable<DetailedAppRegistration>,
    private _metadata? : Flo.ExtraMetadata
  ) {}

  get dataPromise() : Promise<DetailedAppRegistration> {
    if (!this._dataPromise) {
      this._dataPromise = new Promise(resolve => this._dataObs.subscribe(data => resolve(data), () => resolve(null)));
    }
    return this._dataPromise;
  }

  get propertiesPromise() : Promise<Map<string, Flo.PropertyMetadata>> {
    if (!this._propertiesPromise) {
      this._propertiesPromise = new Promise(resolve => this.dataPromise.then((data : DetailedAppRegistration) => {
        let properties = new Map<string, Flo.PropertyMetadata>();
        if (data) {
          data.options.map((o: ConfigurationMetadataProperty) => {
            let propertyMetadata : Flo.PropertyMetadata = {
              id: o.id,
              name: o.name,
              description: o.description,
              defaultValue: o.defaultValue,
              type: o.type
            };
            if (o.type) {
              switch (o.type) {
                case 'java.util.concurrent.TimeUnit':
                  propertyMetadata.options = [
                    'NANOSECONDS',
                    'MICROSECONDS',
                    'MILLISECONDS',
                    'SECONDS',
                    'MINUTES',
                    'HOURS',
                    'DAYS'
                  ];
              }
            }
            properties.set(o.id, propertyMetadata);
          });
        }
        resolve(properties);
      }));
    }
    return this._propertiesPromise;
  }

  get name() : string {
    return this._name;
  }

  get group() : string {
    return this._group;
  }

  description() : Promise<string> {
    return Promise.resolve(this._name);
  }

  get(property: string) : Promise<Flo.PropertyMetadata> {
    return this.propertiesPromise.then(properties => properties.get(property));
  }

  properties() : Promise<Map<string, Flo.PropertyMetadata>> {
    return this.propertiesPromise;
  }

  get metadata() : Flo.ExtraMetadata {
    return this._metadata;
  }

}

