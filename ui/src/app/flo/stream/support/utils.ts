/*
 * Copyright 2015-2016 the original author or authors.
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

import { dia } from 'jointjs';
import { ApplicationType } from '../../../shared/model/app.model';

/**
 * Utilities for Flo based Stream Definition graph editor.
 *
 * @author Alex Boyko
 */
export class Utils {

  static canBeHeadOfStream(graph: dia.Graph, element: dia.Element): boolean {
    if (element.prop('metadata')) {
      if (!Utils.hasVisibleInputPorts(element)) {
        if (element.prop('metadata/group') === ApplicationType[ApplicationType.app]) {
          // For APP nodes if one has `stream-name` set then others cannot have `stream-name` property
          // Check current element. If it has `stream-name` property then it's allowed to have it
          if (element.attr('stream-name')) {
            return true;
          }
          // Otherwise check the rest of APP nodes don't have `stream-name` set
          return !graph.getElements()
            .filter(e => e.prop('metadata/group') === ApplicationType[ApplicationType.app] && e !== element)
            .find(e => e.attr('stream-name'));
        } else {
          return true;
        }
      } else {
        const incoming = graph.getConnectedLinks(element, { inbound: true });
        const tapLink = incoming.find(l => l.attr('props/isTapLink'));
        if (tapLink) {
          return true;
        }
      }
    }
    return false;
  }

  static hasVisibleInputPorts(element: dia.Element) {
    const attrs = element.attributes.attrs;
    const keys = Object.keys(element.attributes.attrs);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (attrs[key] && attrs[key].magnet && attrs[key].port) {
        // Port should have magnet and port properties
        if (attrs[key].port === 'input' && (!attrs[key].display || attrs[key].display === 'block')) {
          return true;
        }
      }
    }
    return false;
  }

  static generateStreamName(graph: dia.Graph, element: dia.Element) {
    const streamNames: Array<string> = graph.getElements()
      .filter(e => element !== e && e.attr('stream-name') && this.canBeHeadOfStream(graph, e))
      .map(e => e.attr('stream-name'));

    // Check if current element stream name is unique
    if (element && element.attr('stream-name') && streamNames.indexOf(element.attr('stream-name')) === -1) {
      return element.attr('stream-name');
    }

    const name = 'STREAM-';
    let index = 1;
    while (streamNames.indexOf(name + index) >= 0) {
      index++;
    }
    return name + index;
  }

  static findDuplicates<T>(elements: T[]): T[] {
    const duplicates: T[] = [];
    while (elements.length !== 0) {
      const e = elements.pop();
      let idx = elements.indexOf(e);
      if (idx >= 0) {
        duplicates.push(e);
      }
      while (idx >= 0) {
        elements.splice(idx, 1);
        idx = elements.indexOf(e);
      }
    }
    return duplicates;
  }

}
