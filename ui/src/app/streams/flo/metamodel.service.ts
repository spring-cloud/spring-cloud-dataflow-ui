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
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AppRegistration, ErrorHandler, Page } from '../../shared/model';
import { SharedAppsService } from '../../shared/services/shared-apps.service';



// import { convertGrasphToText } from './graph-to-text';

// Default icons (unicode chars) for each group member, unless they override
const groupIcons = new Map<string, string>()
    .set('source', '⤇')// 2907
    .set('processor', 'λ') // 3bb  //flux capacitor? 1D21B
    .set('sink', '⤇') // 2907
    .set('task', '☉')//2609   ⚙=2699 gear (rubbish)
    .set('destination', '⦂') // 2982
    .set('tap', '⦂') // 2982
;

/**
 * Metamodel Service for Flo based Stream Definition graph editor
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
@Injectable()
export class MetamodelService implements Flo.Metamodel {

    static DEBUG = false;

    private keepAllProperties = false; // TODO address when whitelisting properties fixed in SCDF

    private listeners : Array<Flo.MetamodelListener> = [];

    private request : Promise<Map<string, Map<string, Flo.ElementMetadata>>>;

    /**
     * Creates instance.
     * @param http handler for making calls to the data flow restful api
     * @param errorHandler used to generate the error messages.
     */
    constructor(private appsService : SharedAppsService, private http: Http, private errorHandler: ErrorHandler) {
    }

    textToGraph(flo: Flo.EditorContext, dsl: string): void {
        //TODO: Implement this
    }

    graphToText(flo: Flo.EditorContext) : Promise<string> {
        //TODO: Implement this
        return Promise.resolve('');
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
        this.appsService.getApps({page: 0, size: 1000}).subscribe(
            data => {
            },
            error => {
            }
        );
        return Promise.resolve(new Map());
    }

}