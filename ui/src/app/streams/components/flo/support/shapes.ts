import * as _joint from 'jointjs';
const joint: any = _joint;

// Load changes into joint object
import 'spring-flo';
import '../../../../shared/flo/support/shared-shapes';

export const IMAGE_W = 150;
export const IMAGE_H = 50;
export const HORIZONTAL_PADDING = 5;

export const SELECT_SQUARE_SIZE = 4;

export const OTHER_GROUP_TYPE = 'other';

export const TYPE_INSTANCE_LABEL = 'dataflow-InstanceLabel';
export const TYPE_INSTANCE_DOT = 'dataflow-InstanceDot';
export const TYPE_INCOMING_MESSAGE_RATE = 'dataflow-incoming-rate';
export const TYPE_OUTGOING_MESSAGE_RATE = 'dataflow-outgoing-rate';

const ERROR_MARKER_SIZE = {width: 12, height: 12};
const TYPE_ICON_SIZE = {width: 24, height: 24};

export const IS_FF = window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
export const LABEL2_OFFSET_Y = IS_FF  ? '38%' : '53%';

joint.shapes.flo.DataFlowApp = joint.shapes.basic.Generic.extend({

    markup:
    '<g class="stream-module">' +
    '<g class="shape">' +
    '<rect class="box"/>' +
    '<text class="label1"/>' +
    '<text class="label2"/>' +
    '</g>' +
    '<text class="stream-label"/>' +
    '<rect class="input-port" />' +
    '<rect class="output-port"/>' +
    '</g>',

    defaults: joint.util.deepSupplement({

        type: joint.shapes.flo.NODE_TYPE,
        position: {x: 0, y: 0},
        size: { width: IMAGE_W, height: IMAGE_H },
        attrs: {
            '.': {
                magnet: false,
            },
            '.box': {
                refWidth: 1,
                refHeight: 1,
                rx: 8,
                ry: 8,
                stroke: '#6db33f',
                fill: '#eeeeee',
                'stroke-width': 2,
            },
            // '.input-port': {
            //     type: 'input',
            //     port: 'input',
            //     height: 8, width: 8,
            //     magnet: true,
            //     fill: '#eeeeee',
            //     transform: 'translate(' + -4 + ',' + ((IMAGE_H / 2) - 4) + ')',
            //     stroke: '#34302d',
            //     'stroke-width': 1,
            // },
            // '.output-port': {
            //     type: 'output',
            //     port: 'output',
            //     height: 8, width: 8,
            //     magnet: true,
            //     fill: '#eeeeee',
            //     transform: 'translate(' + (IMAGE_W - 4) + ',' + ((IMAGE_H / 2) - 4) + ')',
            //     stroke: '#34302d',
            //     'stroke-width': 1,
            // },
            '.palette-name-label': {
              'refX': 0.5, // jointjs specific: relative position to ref'd element
              'refY': 0.5,
              'y-alignment': 'middle',
              'x-alignment': 'middle',
              ref: '.box', // jointjs specific: element for ref-x, ref-y
              fill: 'black',
              'font-size': 14
            },
            '.palette-entry-name-label': {
              'refX': 0.5, // jointjs specific: relative position to ref'd element
              'refY': 0.5,
              'y-alignment': 'middle',
              'x-alignment': 'middle',
              ref: '.box', // jointjs specific: element for ref-x, ref-y
              fill: 'black',
              'font-size': 14
            },
            // '.name-label': {
            //     'refX': 0.5, // jointjs specific: relative position to ref'd element
            //     'refY': 0.5,
            //     'refY2': -2,
            //     'y-alignment': 'bottom',
            //     'x-alignment': 'middle',
            //     ref: '.box', // jointjs specific: element for ref-x, ref-y
            //     fill: 'black',
            //     'font-size': 14
            // },
            // '.type-label': {
            //   'refX': 0.5, // jointjs specific: relative position to ref'd element
            //   'refY': 0.5,
            //   'refY2': 2,
            //   'y-alignment': 'top',
            //   'x-alignment': 'middle',
            //   ref: '.box', // jointjs specific: element for ref-x, ref-y
            //   fill: 'black',
            //   'font-size': 14,
            //   text: 'UNRESOLVED'
            // },
            '.name-label': {
              'refX': 10 + TYPE_ICON_SIZE.width + 10, // jointjs specific: relative position to ref'd element
              'refY': 0.5,
              'refY2': -2,
              'y-alignment': 'bottom',
              ref: '.box', // jointjs specific: element for ref-x, ref-y
              fill: 'black',
              'font-size': 14
            },
            '.type-label': {
                'refX': 10 + TYPE_ICON_SIZE.width + 10,
                'refY': 0.5,
                'refY2': 2,
                'y-alignment': 'top',
                ref: '.box', // jointjs specific: element for ref-x, ref-y
                fill: 'black',
                'font-size': 14,
                text: 'UNRESOLVED'
            },
            '.type-label-bg': {
              ref: '.type-label',
              refX: -7,
              refY: -2,
              refWidth: 14,
              refHeight: 4
            },
            '.type-icon': {
              ref: '.box',
              width: TYPE_ICON_SIZE.width,
              heigth: TYPE_ICON_SIZE.height,
              refX: 10,
              refY: 0.5,
              refY2: -TYPE_ICON_SIZE.height/2,
              'xlink:href': 'assets/img/unknown.svg',
            },
            '.error-marker': {
              width: ERROR_MARKER_SIZE.width,
              height: ERROR_MARKER_SIZE.height,
              ref: '.box',
              refX: "100%",
              refX2: -5 - ERROR_MARKER_SIZE.width,
              refY: 5
            },
            '.stream-label': {
                'x-alignment': 'middle',
                'y-alignment': 'top',
                refX: 0.5, // jointjs specific: relative position to ref'd element
                refY: '100%', // jointjs specific: relative position to ref'd element
                refY2: 10,
                ref: '.box', // jointjs specific: element for ref-x, ref-y
            },
            '.select-outline': {
              ref: '.box',
              refWidth: 1,
              refHeight: 1,
              rx: 8,
              ry: 8,
            },
            '.select-1': {
              width: SELECT_SQUARE_SIZE,
              height: SELECT_SQUARE_SIZE,
              ref: '.box',
              refX: SELECT_SQUARE_SIZE,
              refY: -SELECT_SQUARE_SIZE/2,
            },
            '.select-2': {
              width: SELECT_SQUARE_SIZE,
              height: SELECT_SQUARE_SIZE,
              ref: '.box',
              refX: '50%',
              refX2: -SELECT_SQUARE_SIZE/2,
              refY: -SELECT_SQUARE_SIZE/2
            },
            '.select-3': {
              width: SELECT_SQUARE_SIZE,
              height: SELECT_SQUARE_SIZE,
              ref: '.box',
              refX: '100%',
              refX2: -SELECT_SQUARE_SIZE - 8,
              refY: -SELECT_SQUARE_SIZE/2
            },
            '.select-4': {
              width: SELECT_SQUARE_SIZE,
              height: SELECT_SQUARE_SIZE,
              ref: '.box',
              refX: SELECT_SQUARE_SIZE,
              refY: '100%',
              refY2: -SELECT_SQUARE_SIZE/2,
            },
            '.select-5': {
              width: SELECT_SQUARE_SIZE,
              height: SELECT_SQUARE_SIZE,
              ref: '.box',
              refX: '50%',
              refX2: -SELECT_SQUARE_SIZE/2,
              refY: '100%',
              refY2: -SELECT_SQUARE_SIZE/2,
            },
            '.select-6': {
              width: SELECT_SQUARE_SIZE,
              height: SELECT_SQUARE_SIZE,
              ref: '.box',
              refX: '100%',
              refX2: -SELECT_SQUARE_SIZE - 8,
              refY: '100%',
              refY2: -SELECT_SQUARE_SIZE/2,
            },
            '.shape': {
            }
        }
    }, joint.shapes.basic.Generic.prototype.defaults)
});

joint.shapes.flo.Destination = joint.shapes.basic.Generic.extend({

    markup:
    '<g class="destination">' +
    '<g class="shape">' +
    '<path d="m6,10 a12,12 0 0,0 0,20 l108,0 a12,12 0 0,0 0,-20 l0,0 z" class="box"/>' +
    // '<rect transform="translate(100, -11)" class="box"/>'+
    '<text class="label1"/>' +
    '<text class="label2"/>' +
    '</g>' +
    '<text class="stream-label"/>' +
    '<circle class="input-port" />' +
    '<circle class="output-port"/>' +
    '</g>',

    defaults: joint.util.deepSupplement({

        type: joint.shapes.flo.NODE_TYPE,
        position: {x: 0, y: 0},
        size: { width: IMAGE_W, height: IMAGE_H },
        attrs: {
            '.': {
                magnet: false,
            },
            '.box': {
                // d: 'm6,10 a12,12 0 0,0 0,20 l108,0 a12,12 0 0,0 0,-20 l0,0 z',
                refWidth: 1,
                refHeight: 0.5,
                refY: 0.25,
                rx: 2,
                ry: 2,
                // 'fill-opacity':0, // see through
                stroke: '#6db33f',
                fill: '#eeeeee',
                'stroke-width': 2,
            },
            // '.input-port': {
            //     port: 'input',
            //     r: 4, // height: 8, width: 8,
            //     magnet: true,
            //     fill: '#eeeeee',
            //     // transform: 'translate(' + -4 + ',' + ((IMAGE_H/2)-4) + ')',
            //     transform: 'translate(1,' + ((IMAGE_H / 2)) + ')',
            //     stroke: '#34302d',
            //     'stroke-width': 1,
            //     class: 'input-port flo-input-port'
            // },
            // '.output-port': {
            //     port: 'output',
            //     r: 4, // height: 8, width: 8,
            //     magnet: true,
            //     fill: '#eeeeee',
            //     transform: 'translate(' + (IMAGE_W - 1) + ',' + ((IMAGE_H / 2)) + ')',
            //     stroke: '#34302d',
            //     'stroke-width': 1,
            //   class: 'output-port flo-output-port'
            // },
            '.palette-entry-name-label': {
              'refX': 0.5, // jointjs specific: relative position to ref'd element
              'refY': 0.5,
              'y-alignment': 'middle',
              'x-alignment': 'middle',
              ref: '.box', // jointjs specific: element for ref-x, ref-y
              fill: 'black',
              'font-size': 14
            },
            // '.name-label': {
            //   'refX': 0.5, // jointjs specific: relative position to ref'd element
            //   'refY': 0.5,
            //   'refY2': -2,
            //   'y-alignment': 'bottom',
            //   'x-alignment': 'middle',
            //   ref: '.box', // jointjs specific: element for ref-x, ref-y
            //   fill: 'black',
            //   'font-size': 14
            // },
            '.name-label': {
              'refX': 10 + TYPE_ICON_SIZE.width + 10, // jointjs specific: relative position to ref'd element
              'refY': 0.5,
              'refY2': -2,
              'y-alignment': 'bottom',
              ref: '.box', // jointjs specific: element for ref-x, ref-y
              fill: 'black',
              'font-size': 14
            },
            '.type-label': {
              'refX': 0.5, // jointjs specific: relative position to ref'd element
              'refY': 0.5,
              'refY2': 2,
              'y-alignment': 'top',
              'x-alignment': 'middle',
              ref: '.box', // jointjs specific: element for ref-x, ref-y
              fill: 'black',
              'font-size': 14,
              text: 'UNRESOLVED'
            },
            '.type-label-bg': {
              ref: '.type-label',
              refX: 0,
              refY: 0,
              refWidth: 10,
              refHeight: 8
            },
            '.type-icon': {
              ref: '.box',
              width: TYPE_ICON_SIZE.width,
              heigth: TYPE_ICON_SIZE.height,
              refX: 10,
              refY: 0.5,
              refY2: -TYPE_ICON_SIZE.height/2,
            },
            '.error-marker': {
              width: ERROR_MARKER_SIZE.width,
              height: ERROR_MARKER_SIZE.height,
              ref: '.box',
              refX: "100%",
              refX2: -5 - ERROR_MARKER_SIZE.width,
              refY: 5
            },
            '.stream-label': {
                'x-alignment': 'middle',
                'y-alignment': -0.999999,
                'ref-x': 0.5, // jointjs specific: relative position to ref'd element
                'ref-y': 0, // jointjs specific: relative position to ref'd element
                ref: '.box', // jointjs specific: element for ref-x, ref-y
                fill: '#AAAAAA',
                'font-size': 15
            },
            '.shape': {
            }
        }
    }, joint.shapes.basic.Generic.prototype.defaults)
});

joint.shapes.flo.LinkDataflow = joint.dia.Link.extend({

    toolMarkup: [
        '<g class="link-tool create-stream">',
        '<rect class="link-tools-container" width="28" height="28"/>',
        '<g class="tool-remove" event="remove" transform="translate(8, 4)">',
        '<circle r="11" transform="scale(.7)"/>',
        '<path transform="scale(.6) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585' +
          ' 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"/>',
        '<title>Remove link.</title>',
        '</g>',
        '<g class="tool-insert-channel" event="insert-channel">',
        '<circle r="11" transform="scale(0.7) translate(-12,-18)" style="stroke:rgb(0,0,0);fill:#ffffff;"/>',
        '<path stroke-linecap="round" transform="scale(0.7) translate(-12,-18)" d="M0,-8 L0,0 M-4,-4 L0,0 M4,-4 L0,0"' +
          ' style="stroke:rgb(0,0,0);stroke-width:2"/>',
        '<rect width="8" height="4" transform="translate(-12,-12)" style="stroke:rgb(0,0,0);fill:#ffffff;stroke-width:1"/>',
        '<title>Insert destination</title>',
        '</g>',
        '<g class="tool-switch" event="switch">',
        '<circle r="11" transform="scale(0.7) translate(12, -18)" style="stroke:rgb(0,0,0);fill:#ffffff;"/>',
        '<line stroke-linecap="round" transform="scale(0.7) translate(5, -22)" x1="4" y1="11" x2="15" y2="0"' +
          ' style="stroke:rgb(0,0,0);stroke-width:2" stroke-dasharray="3, 4"/>',
        '<path stroke-linecap="round" transform="scale(0.7) translate(3,-26)" d="M0,8 L8,8 M4,12 L8,8 M4,4 L8,8"' +
          ' style="stroke:rgb(0,0,0);stroke-width:2"/>',
        '<title>Switch to/from tap</title>',
        '</g>',
        '<g class="tool-options" event="link:options" transform="translate(-17, -4)">',
        // '<circle r="11" transform="scale(.7)"/>',
        '<path fill="white" transform="scale(.50)" d="M31.229,17.736c0.064-0.571,0.104-1.148,0.104-' +
        '1.736s-0.04-1.166-0.104-1.737l-4.377-1.557c-0.218-0.716-0.504-1.401-0.851-2.05l1.993-4.192c-0.725-0.91-' +
        '1.549-1.734-2.458-2.459l-4.193,1.994c-0.647-0.347-1.334-0.632-2.049-0.849l-1.558-4.378C17.165,0.708,16.588,' +
        '0.667,16,0.667s-1.166,0.041-1.737,0.105L12.707,5.15c-0.716,0.217-1.401,0.502-2.05,0.849L6.464,4.005C5.554,' +
        '4.73,4.73,5.554,4.005,6.464l1.994,4.192c-0.347,0.648-0.632,1.334-0.849,2.05l-4.378,1.557C0.708,14.834,0.667,' +
        '15.412,0.667,16s0.041,1.165,0.105,1.736l4.378,1.558c0.217,0.715,0.502,1.401,0.849,2.049l-1.994,4.193c0.725,' +
        '0.909,1.549,1.733,2.459,2.458l4.192-1.993c0.648,0.347,1.334,0.633,2.05,0.851l1.557,4.377c0.571,0.064,1.148,' +
        '0.104,1.737,0.104c0.588,0,1.165-0.04,1.736-0.104l1.558-4.377c0.715-0.218,1.399-0.504,2.049-0.851l4.193,' +
        '1.993c0.909-0.725,1.733-1.549,2.458-2.458l-1.993-4.193c0.347-0.647,0.633-1.334,0.851-2.049L31.229,17.736zM16,' +
        '20.871c-2.69,0-4.872-2.182-4.872-4.871c0-2.69,2.182-4.872,4.872-4.872c2.689,0,4.871,2.182,4.871,4.872C20.871,' +
        '18.689,18.689,20.871,16,20.871z"/>',
        '<title>Properties</title>',
        '</g>',
        '</g>'
    ].join(''),

    arrowheadMarkup: [
      '<g class="marker-arrowhead-group marker-arrowhead-group-<%= end %>">',
      '<path class="marker-arrowhead" end="<%= end %>" d="M 10 0 L 0 5 L 10 10 z" />',
      '</g>'
    ].join(''),


    defaults: joint.util.deepSupplement({
        type: joint.shapes.flo.LINK_TYPE,
        options: {
            linkToolsOffset: 1000,
        },
        // connector: {
        //   name: 'smoothHorizontal'
        // },
//      router: { name: 'metro' },
        attrs: {
            '.connection': { stroke: '#f1f1f1', 'stroke-width': 2, 'class': 'connection' },
            '.connection-wrap': { display: 'none' },
            // '.marker-arrowheads': { display: 'none' },
            '.tool-options': { display: 'block' },
            targetMarker: {
              'type': 'path',
              'd': 'M 10 -5 0 0 10 5 z'
            }
        },
    }, joint.dia.Link.prototype.defaults)
});

joint.shapes.flo.InstanceLabel = joint.shapes.basic.Generic.extend({

  markup: '<text class="label"/>',

  defaults: joint.util.deepSupplement({

    type: TYPE_INSTANCE_LABEL,
    attrs: {
      '.': { magnet: false },
      '.label': {
        'text-anchor': 'middle',
        fill: 'black',
        'font-size': 8
      }
    }
  }, joint.shapes.basic.Generic.prototype.defaults)
});

joint.shapes.flo.InstanceDot = joint.shapes.basic.Generic.extend({

  markup: '<g class="rotatable"><g class="scalable"><circle class="instance-dot"/></g></g>',

  defaults: joint.util.deepSupplement({
    type: TYPE_INSTANCE_DOT,
    size: { width: 6, height: 6 },
    attrs: {
      'circle': { r: 3, transform: 'translate(3, 3)' }
    }
  }, joint.shapes.basic.Generic.prototype.defaults)
});

joint.shapes.flo.DataFlowLabelHandle = joint.shapes.basic.Generic.extend({

  markup: '<g><text class="handle-label"/></g>'

});

joint.shapes.flo.StreamModuleGroupHeader = joint.shapes.basic.Generic.extend({
  // The path is the open/close arrow, defaults to vertical (open)
  markup: '<g><rect class="outer"/><rect class="group-label-bg"/><text class="group-label"/><image class="collapse-handle"/><polyline class="group-line"/></g>',
  defaults: joint.util.deepSupplement({
    type: 'palette.groupheader',
    size: {width: 170, height: 40},
    position: {x: 0, y: 0},
    attrs: {
      '.outer': {
        refWidth: 1,
        refHeight: 1,
        refX: 0,
        refY: 0,
      },
      '.group-label-bg': {
        ref: '.group-label',
        refWidth: 14,
        refHeight: 4,
        refX: -7,
        refY: -2,
        'follow-scale': true,
      },
      '.group-label': {
        ref: '.outer',
        refX: 15,
        refY: 0.5,
        'y-alignment': 'middle'
      },
      '.collapse-handle': {
        width: 10,
        height: 10,
        ref: '.outer',
        refX: '100%',
        refX2: '-15 - 10',
        refY: '50%',
        refY2: -5
      },
      '.group-line': {
        ref: '.outer',
        refPointsKeepOffset: '1,39 169,39'
      }
    },
    // custom properties
    isOpen: true
  }, joint.shapes.basic.Generic.prototype.defaults)
});










