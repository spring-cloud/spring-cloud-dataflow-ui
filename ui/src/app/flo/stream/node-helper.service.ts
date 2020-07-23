/*
 * Copyright 2016-2020 the original author or authors.
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

import { Injectable } from '@angular/core';
import { dia } from 'jointjs';
import { Flo } from 'spring-flo';
import { Utils as SharedUtils } from '../shared/support/utils';
import { ApplicationType } from '../../shared/model/app.model';

import * as _joint from 'jointjs';
const joint: any = _joint;

export const PORT_RADIUS = 7;

const HANDLE_SHAPE_SPACING = 10;
const BETWEEN_HANDLE_SPACING = 5;


// Default icons (unicode chars) for each group member, unless they override
const GROUP_ICONS = new Map<string, string>()
  .set('app', 'assets/img/app.svg') // U+2338 (Quad equal symbol)
  .set('source', 'assets/img/source.svg')// 21D2
  .set('processor', 'assets/img/processor.svg') // 3bb  //flux capacitor? 1D21B
  .set('sink', 'assets/img/sink.svg') // 21D2
  .set('task', 'assets/img/unknown.svg') // 2609   ⚙=2699 gear (rubbish)
  .set('other', 'assets/img/tap.svg') // 2982
  .set('unresolved', 'assets/img/unknown.svg') // 2982
;

/**
 * Node Helper for Flo based Stream Definition graph editor.
 * Static utility method for creating joint model objects.
 *
 * @author Alex Boyko
 */
@Injectable()
export class NodeHelper {

  createNode(metadata: Flo.ElementMetadata): dia.Element {
    let node: dia.Element = null;
    switch (metadata.group) {

      case ApplicationType[ApplicationType.app]:
        node = new joint.shapes.flo.DataFlowApp(
          joint.util.deepSupplement({
            attrs: {
              '.box': {
                'fill': '#eef4ee',
              },
              '.shape': {
                class: 'shape app-module'
              },
              // '.type-label': {
              //   text: metadata.group.toUpperCase()
              // },
              '.type-icon': {
                'xlink:href': GROUP_ICONS.get(metadata.group),
              }
            }
          }, joint.shapes.flo.DataFlowApp.prototype.defaults)
        );
        break;
      case ApplicationType[ApplicationType.source]:
        node = new joint.shapes.flo.DataFlowApp(
          joint.util.deepSupplement({
            attrs: {
              '.box': {
                'fill': '#eef4ee'
              },
              '.shape': {
                class: 'shape source-module'
              },
              // '.type-label': {
              //   text: metadata.group.toUpperCase()
              // },
              '.type-icon': {
                'xlink:href': GROUP_ICONS.get(metadata.group),
              }
            }
          }, joint.shapes.flo.DataFlowApp.prototype.defaults)
        );
        break;
      case ApplicationType[ApplicationType.processor]:
        node = new joint.shapes.flo.DataFlowApp(
          joint.util.deepSupplement({
            attrs: {
              '.box': {
                'fill': '#eef4ee'
              },
              '.shape': {
                class: 'shape processor-module'
              },
              // '.type-label': {
              //   text: metadata.group.toUpperCase()
              // },
              '.type-icon': {
                'xlink:href': GROUP_ICONS.get(metadata.group),
              },
              '.stream-label': {
                display: 'none'
              }
            }
          }, joint.shapes.flo.DataFlowApp.prototype.defaults)
        );
        break;
      case ApplicationType[ApplicationType.sink]:
        node = new joint.shapes.flo.DataFlowApp(
          joint.util.deepSupplement({
            attrs: {
              '.box': {
                'fill': '#eef4ee'
              },
              '.shape': {
                class: 'shape sink-module'
              },
              // '.type-label': {
              //   text: metadata.group.toUpperCase()
              // },
              '.type-icon': {
                'xlink:href': GROUP_ICONS.get(metadata.group),
              },
              '.stream-label': {
                display: 'none'
              }
            }
          }, joint.shapes.flo.DataFlowApp.prototype.defaults)
        );
        break;
      case ApplicationType[ApplicationType.task]:
        node = new joint.shapes.flo.DataFlowApp(
          joint.util.deepSupplement({
            attrs: {
              '.box': {
                'fill': '#eef4ee'
              },
              '.shape': {
                class: 'shape task-module'
              },
              // '.type-label': {
              //   text: metadata.group.toUpperCase()
              // },
              '.type-icon': {
                'xlink:href': GROUP_ICONS.get(metadata.group),
              },
              '.stream-label': {
                display: 'none'
              }
            }
          }, joint.shapes.flo.DataFlowApp.prototype.defaults)
        );
        break;
      default:
        if (metadata.name === 'tap') {
          node = new joint.shapes.flo.DataFlowApp(
            joint.util.deepSupplement({
              attrs: {
                '.box': {
                  'fill': '#eeeeff',
                  'stroke': '#0000ff'
                },
                '.shape': {
                  class: 'shape other-module'
                },
                // '.type-label': {
                //   text: metadata.group.toUpperCase()
                // },
                '.type-icon': {
                  'xlink:href': GROUP_ICONS.get(metadata.group),
                }
              }
            }, joint.shapes.flo.DataFlowApp.prototype.defaults)
          );
        } else if (metadata.name === 'destination') {
          node = new joint.shapes.flo.DataFlowApp(
            joint.util.deepSupplement({
              attrs: {
                '.box': {
                  'fill': '#eeeeff',
                  'stroke': '#0000ff'
                },
                '.shape': {
                  class: 'shape other-module'
                },
                // '.type-label': {
                //   text: metadata.group.toUpperCase()
                // },
                '.type-icon': {
                  'xlink:href': GROUP_ICONS.get(metadata.group),
                }
              }
            }, joint.shapes.flo.DataFlowApp.prototype.defaults)
          );
        } else {
          node = new joint.shapes.flo.DataFlowApp();
        }
    }
    node.attr('.palette-entry-name-label/text', metadata.name);
    node.attr('.name-label/text', metadata.name);
    node.attr('.type-label/text', metadata.name.toUpperCase());

    this.createHandles(node, metadata);
    return node;
  }

  createHandles(node: dia.Element, metadata: Flo.ElementMetadata) {
    if (!metadata || SharedUtils.isUnresolvedMetadata(metadata)) {
      node.attr('.delete-handle', {
        text: 'Delete',
        ref: '.box',
        refX: '50%',
        refY: -HANDLE_SHAPE_SPACING,
        yAlignment: 'bottom',
        xAlignment: 'middle'
      });
    } else {
      node.attr('.options-handle', {
        text: 'Options',
        ref: '.box',
        refX: '50%',
        refX2: -BETWEEN_HANDLE_SPACING,
        refY: -HANDLE_SHAPE_SPACING,
        yAlignment: 'bottom',
        textAnchor: 'end'
      });
      node.attr('.handle-separator', {
        text: '|',
        ref: '.box',
        refX: '50%',
        refY: -HANDLE_SHAPE_SPACING,
        yAlignment: 'bottom',
        xAlignment: 'middle'
      });
      node.attr('.delete-handle', {
        text: 'Delete',
        ref: '.box',
        refX: '50%',
        refX2: BETWEEN_HANDLE_SPACING,
        refY: -HANDLE_SHAPE_SPACING,
        yAlignment: 'bottom',
      });
    }
  }

  createPorts(node: dia.Element, metadata: Flo.ElementMetadata) {
    switch (metadata.group) {
      case ApplicationType[ApplicationType.source]:
        this.createCommonOutputPort(node);
        break;
      case ApplicationType[ApplicationType.processor]:
        this.createCommonOutputPort(node);
        this.createCommonInputPort(node);
        break;
      case ApplicationType[ApplicationType.sink]:
        this.createCommonInputPort(node);
        break;
      case 'other':
        switch (metadata.name) {
          case 'tap':
            this.createCommonOutputPort(node);
            break;
          case 'destination':
            this.createCommonOutputPort(node);
            this.createCommonInputPort(node);
            break;
        }
        break;
    }
  }

  protected createCommonOutputPort(node: dia.Element) {
    node.attr('.output-port', {
      port: 'output',
      magnet: true,
      'joint-selector': '.output-port'
    });
    node.attr('.port-outer-circle-output', {
      ref: '.box',
      refCx: 1,
      refCy: 0.5,
      r: PORT_RADIUS,
      class: 'port-outer-circle-output flo-port'
    });
    node.attr('.port-inner-circle-output', {
      ref: '.box',
      refCx: 1,
      refCy: 0.5,
      r: PORT_RADIUS - 4,
      class: 'port-inner-circle-output flo-port-inner-circle'
    });
  }

  protected createCommonInputPort(node: dia.Element) {
    node.attr('.input-port', {
      port: 'input',
      magnet: true,
      'joint-selector': '.input-port'
    });
    node.attr('.port-outer-circle-input', {
      ref: '.box',
      refCx: 0,
      refCy: 0.5,
      r: PORT_RADIUS,
      class: 'port-outer-circle-input flo-port'
    });
    node.attr('.port-inner-circle-input', {
      ref: '.box',
      refCx: 0,
      refCy: 0.5,
      r: PORT_RADIUS - 4,
      class: 'port-inner-circle-input flo-port-inner-circle'
    });
  }

}
