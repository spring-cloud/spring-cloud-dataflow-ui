/*
 * Copyright 2016-2017 the original author or authors.
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

import './shapes';
import { ApplicationType } from '../../../../shared/model';
import { dia } from 'jointjs';
import { Flo, Constants } from 'spring-flo';
import * as _joint from 'jointjs';
import {AppMetadata} from "../../../../shared/flo/support/app-metadata";

const joint: any = _joint;

const HANDLE_ICON_MAP = new Map<string, string>()
  .set(Constants.REMOVE_HANDLE_TYPE, 'assets/img/delete.svg')
  .set(Constants.PROPERTIES_HANDLE_TYPE, 'assets/img/cog.svg');

const HANDLE_ICON_SIZE = new Map<string, dia.Size>()
  .set(Constants.REMOVE_HANDLE_TYPE, {width: 10, height: 10})
  .set(Constants.PROPERTIES_HANDLE_TYPE, {width: 11, height: 11});

const DECORATION_ICON_MAP = new Map<string, string>()
  .set(Constants.ERROR_DECORATION_KIND, 'assets/img/error.svg');

const PORT_RADIUS = 6;


// Default icons (unicode chars) for each group member, unless they override
const GROUP_ICONS = new Map<string, string>()
  .set('app', '⌸') // U+2338 (Quad equal symbol)
  .set('source', '⇒')// 21D2
  .set('processor', 'λ') // 3bb  //flux capacitor? 1D21B
  .set('sink', '⇒') // 21D2
  .set('task', '☉') // 2609   ⚙=2699 gear (rubbish)
  .set('destination', '⦂') // 2982
  .set('tap', '⦂') // 2982
;

/**
 * Node Helper for Flo based Stream Definition graph editor.
 * Static utility method for creating joint model objects.
 *
 * @author Alex Boyko
 */
export class NodeHelper {

  static createNode(metadata: Flo.ElementMetadata): dia.Element {
    switch (metadata.group) {

      case ApplicationType[ApplicationType.app]:
        return new joint.shapes.flo.DataFlowApp(
          joint.util.deepSupplement({
            attrs: {
              '.box': {
                'fill': '#eef4ee',
              },
              // '.input-port': {
              //   display: 'none',
              //   magnet: false
              // },
              // '.output-port': {
              //   display: 'none',
              //   magnet: false
              // },
              '.label1': {
                'text': metadata.name
              },
              '.label2': {
                'text': GROUP_ICONS.get(metadata.group)
              }
            }
          }, joint.shapes.flo.DataFlowApp.prototype.defaults)
        );

      case ApplicationType[ApplicationType.source]:
        return new joint.shapes.flo.DataFlowApp(
          joint.util.deepSupplement({
            attrs: {
              '.box': {
                'fill': '#eef4ee'
              },
              // '.input-port': {
              //   display: 'none'
              // },
              '.label1': {
                'text': metadata.name
              },
              '.label2': {
                'text': GROUP_ICONS.get(metadata.group)
              }
            }
          }, joint.shapes.flo.DataFlowApp.prototype.defaults)
        );

      case ApplicationType[ApplicationType.processor]:
        return new joint.shapes.flo.DataFlowApp(
          joint.util.deepSupplement({
            attrs: {
              '.box': {
                'fill': '#eef4ee'
              },
              '.label1': {
                'text': metadata.name
              },
              '.label2': {
                'text': GROUP_ICONS.get(metadata.group)
              },
              '.stream-label': {
                display: 'none'
              }
            }
          }, joint.shapes.flo.DataFlowApp.prototype.defaults)
        );

      case ApplicationType[ApplicationType.sink]:
        return new joint.shapes.flo.DataFlowApp(
          joint.util.deepSupplement({
            attrs: {
              '.box': {
                'fill': '#eef4ee'
              },
              // '.output-port': {
              //   display: 'none'
              // },
              '.label1': {
                'text': metadata.name
              },
              '.label2': {
                'text': GROUP_ICONS.get(metadata.group)
              },
              '.stream-label': {
                display: 'none'
              }
            }
          }, joint.shapes.flo.DataFlowApp.prototype.defaults)
        );

      case ApplicationType[ApplicationType.task]:
        return new joint.shapes.flo.DataFlowApp(
          joint.util.deepSupplement({
            attrs: {
              '.box': {
                'fill': '#eef4ee'
              },
              // '.output-port': {
              //   display: 'none'
              // },
              '.label1': {
                'text': metadata.name
              },
              '.label2': {
                'text': GROUP_ICONS.get(metadata.group)
              },
              '.stream-label': {
                display: 'none'
              }
            }
          }, joint.shapes.flo.DataFlowApp.prototype.defaults)
        );

      default:
        if (metadata.name === 'tap') {
          return new joint.shapes.flo.DataFlowApp(
            joint.util.deepSupplement({
              attrs: {
                '.box': {
                  'fill': '#eeeeff',
                  'stroke': '#0000ff'
                },
                // '.input-port': {
                //   display: 'none'
                // },
                '.label1': {
                  'text': metadata.name
                },
                '.label2': {
                  'text': GROUP_ICONS.get(metadata.name)
                }
              }
            }, joint.shapes.flo.DataFlowApp.prototype.defaults)
          );
        } else if (metadata.name === 'destination') {
          return new joint.shapes.flo.Destination(
            joint.util.deepSupplement({
              attrs: {
                '.box': {
                  'fill': '#eeeeff',
                  'stroke': '#0000ff'
                },
                '.label1': {
                  'text': metadata.name
                },
                '.label2': {
                  'text': GROUP_ICONS.get(metadata.name)
                }
              }
            }, joint.shapes.flo.Destination.prototype.defaults)
          );
        } else {
          return new joint.shapes.flo.DataFlowApp();
        }
    }
  }

  static createPorts(node: dia.Element, metadata: Flo.ElementMetadata) {
    if (metadata instanceof AppMetadata) {
      const appData = <AppMetadata> metadata;
      if (Array.isArray(appData.inputChannels) && appData.inputChannels.length > 0) {

        if (2*(PORT_RADIUS+0.5) * appData.inputChannels.length >= node.size().height) {
          node.size(node.size().width, 2*(PORT_RADIUS+0.5) * (appData.inputChannels.length + 3));
        }

        // if (2*(PORT_RADIUS+0.5) * appData.inputChannels.length < node.size().height) {
        const separatingSpace = 1 / (appData.inputChannels.length + 1);
        appData.inputChannels.forEach((channel, i) => {
          node.attr(`.input-port-${channel}`, {
            port: 'input',
            channel: channel,
            magnet: true,
          });
          node.attr(`.port-outer-circle-${channel}`, {
            ref: '.box',
            refCx: 0,
            refCy: (i + 1) * separatingSpace,
            r: PORT_RADIUS,
            class: `port-outer-circle-${channel} flo-port`
          });
          node.attr(`.port-inner-circle-${channel}`, {
            ref: `.box`,
            refCx: 0,
            refCy: (i + 1) * separatingSpace,
            r: PORT_RADIUS - 3,
            class: `port-inner-circle-${channel} flo-port-inner-circle`
          });
          node.attr(`.${channel}-label`, {
            ref: `.input-port-${channel}`,
            'ref-x': 15,
            'ref-y': 0,
            'text-anchor': 'start',
            text: channel,
            class: `${channel}-label flo-port-label`
          });
          node.attr(`.${channel}-label-bg`, {
            ref: `.${channel}-label`,
            refWidth: 1,
            refHeight: 1,
            refX: 0,
            refY: 0,
            class: `.${channel}-label-bg flo-port-label-bg`
          });
        });
        // } else {
        //   node.attr(`.input-port`, {
        //     port: 'input',
        //     ref: '.box',
        //     refCx: 0,
        //     refCy: 0.5,
        //     r: PORT_RADIUS + 2,
        //     magnet: true,
        //     class: 'input-port flo-input-multiport'
        //   });
        // }
      }

      if (Array.isArray(appData.outputChannels) && appData.outputChannels.length > 0) {

        if (2*(PORT_RADIUS+1) * (appData.outputChannels.length + 3) >= node.size().height) {
          node.size(node.size().width, 2*(PORT_RADIUS+0.5) * (appData.outputChannels.length + 3));
        }

        // if (2*(PORT_RADIUS+0.5) * appData.outputChannels.length < node.size().height) {
        const separatingSpace = 1 / (appData.outputChannels.length + 1);
        appData.outputChannels.forEach((channel, i) => {
          node.attr(`.output-port-${channel}`, {
            port: 'output',
            channel: channel,
            magnet: true,
          });
          node.attr(`.port-outer-circle-${channel}`, {
            ref: '.box',
            refCx: 1,
            refCy: (i + 1) * separatingSpace,
            r: PORT_RADIUS,
            class: `port-outer-circle-${channel} flo-port`
          });
          node.attr(`.port-inner-circle-${channel}`, {
            ref: '.box',
            refCx: 1,
            refCy: (i + 1) * separatingSpace,
            r: PORT_RADIUS - 3,
            class: `port-inner-circle-${channel} flo-port-inner-circle`
          });
          node.attr(`.${channel}-label`, {
            ref: `.output-port-${channel}`,
            'ref-x': -15,
            'ref-y': 0,
            'text-anchor': 'end',
            text: channel,
            class: `${channel}-label flo-port-label`
          });
          node.attr(`.${channel}-label-bg`, {
            ref: `.${channel}-label`,
            refWidth: 1,
            refHeight: 1,
            refX: 0,
            refY: 0,
            class: `.${channel}-label-bg flo-port-label-bg`
          });
        });
        // } else {
        //   node.attr(`.output-port`, {
        //     port: 'output',
        //     ref: '.box',
        //     refCx: 1,
        //     refCy: 0.5,
        //     r: PORT_RADIUS + 2,
        //     magnet: true,
        //     class: 'output-port flo-output-multiport'
        //   });
        // }
      }
      if ((!appData.inputChannels || !appData.inputChannels.length) && (!appData.outputChannels || !appData.outputChannels.length)) {
        NodeHelper.createCommonPorts(node, metadata);
      }
    } else {
      NodeHelper.createCommonPorts(node, metadata);
    }
  }

  // static createNodeWithMultiPorts(metadata: Flo.ElementMetadata) {
  //   const node = NodeHelper.createNode(metadata);
  //
  //   return node;
  // }

  static createCommonPorts(node: dia.Element, metadata: Flo.ElementMetadata) {
    switch (metadata.group) {
      case ApplicationType[ApplicationType.source]:
        NodeHelper.createCommonOutputPort(node);
        break;
      case ApplicationType[ApplicationType.processor]:
        NodeHelper.createCommonOutputPort(node);
        NodeHelper.createCommonInputPort(node);
        break;
      case ApplicationType[ApplicationType.sink]:
        NodeHelper.createCommonInputPort(node);
        break;
      case 'other':
        switch (metadata.name) {
          case 'tap':
            NodeHelper.createCommonInputPort(node);
            break;
        }
        break;
    }
  }

  static createCommonOutputPort(node: dia.Element) {
    node.attr('.output-port', {
      port: 'output',
      magnet: true,
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
      r: PORT_RADIUS - 3,
      class: 'port-inner-circle-output flo-port-inner-circle'
    });
  }

  static createCommonInputPort(node: dia.Element) {
    node.attr('.input-port', {
      port: 'input',
      magnet: true,
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
      r: PORT_RADIUS - 3,
      class: 'port-inner-circle-input flo-port-inner-circle'
    });
  }

  static createHandle(kind: string) {
    switch (kind) {
      case Constants.REMOVE_HANDLE_TYPE:
        const deleteHandle = new joint.shapes.flo.DataFlowLabelHandle();
        deleteHandle.attr('.handle-label', {
          'y-alignment': 'bottom',
          'text': 'Delete'
        });
        return deleteHandle;
      case Constants.PROPERTIES_HANDLE_TYPE:
        const optionsHandle = new joint.shapes.flo.DataFlowLabelHandle();
        optionsHandle.attr('.handle-label', {
          'y-alignment': 'bottom',
          'text-anchor': 'end',
          'text': 'Options'
        });
        return optionsHandle;
      case 'separator':
        const separatorHandle = new joint.shapes.flo.DataFlowLabelHandle();
        separatorHandle.attr('.handle-label', {
          'y-alignment': 'bottom',
          'x-alignment': 'middle',
          'text': '|'
        });
        return separatorHandle;
      default:
        return new joint.shapes.flo.ErrorDecoration({
          size: HANDLE_ICON_SIZE.get(kind),
          attrs: {
            'image': {
              'xlink:href': HANDLE_ICON_MAP.get(kind)
            }
          }
        });
    }
  }

  static createDecoration(kind: string) {
    return new joint.shapes.flo.ErrorDecoration({
      size: {width: 16, height: 16},
      attrs: {
        'image': {
          'xlink:href': DECORATION_ICON_MAP.get(kind),
          'display': 'none'
        }
      }
    });
  }

}
