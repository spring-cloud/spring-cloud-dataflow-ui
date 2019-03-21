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

const joint: any = _joint;

const HANDLE_ICON_MAP = new Map<string, string>()
  .set(Constants.REMOVE_HANDLE_TYPE, 'assets/img/delete.svg')
  .set(Constants.PROPERTIES_HANDLE_TYPE, 'assets/img/cog.svg');

const HANDLE_ICON_SIZE = new Map<string, dia.Size>()
  .set(Constants.REMOVE_HANDLE_TYPE, {width: 10, height: 10})
  .set(Constants.PROPERTIES_HANDLE_TYPE, {width: 11, height: 11});

const DECORATION_ICON_MAP = new Map<string, string>()
  .set(Constants.ERROR_DECORATION_KIND, 'assets/img/error.svg');


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
              '.input-port': {
                display: 'none',
                magnet: false
              },
              '.output-port': {
                display: 'none',
                magnet: false
              },
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
              '.input-port': {
                display: 'none'
              },
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
              '.output-port': {
                display: 'none'
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

      case ApplicationType[ApplicationType.task]:
        return new joint.shapes.flo.DataFlowApp(
          joint.util.deepSupplement({
            attrs: {
              '.box': {
                'fill': '#eef4ee'
              },
              '.output-port': {
                display: 'none'
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

      default:
        if (metadata.name === 'tap') {
          return new joint.shapes.flo.DataFlowApp(
            joint.util.deepSupplement({
              attrs: {
                '.box': {
                  'fill': '#eeeeff',
                  'stroke': '#0000ff'
                },
                '.input-port': {
                  display: 'none'
                },
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

  static createHandle(kind: string) {
    return new joint.shapes.flo.ErrorDecoration({
      size: HANDLE_ICON_SIZE.get(kind),
      attrs: {
        'image': {
          'xlink:href': HANDLE_ICON_MAP.get(kind)
        }
      }
    });
  }

  static createDecoration(kind: string) {
    return new joint.shapes.flo.ErrorDecoration({
      size: {width: 16, height: 16},
      attrs: {
        'image': {
          'xlink:href': DECORATION_ICON_MAP.get(kind)
        }
      }
    });
  }

}
