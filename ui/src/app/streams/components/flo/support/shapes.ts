import * as _joint from 'jointjs';

const joint: any = _joint;

// Load changes into joint object
import 'spring-flo';
import '../../../../shared/flo/support/shared-shapes';

export const IMAGE_W = 180;
export const IMAGE_H = 64;
export const HORIZONTAL_PADDING = 5;

export const SELECT_SQUARE_SIZE = 4;

export const OTHER_GROUP_TYPE = 'other';

export const TYPE_INSTANCE_LABEL = 'dataflow-InstanceLabel';
export const TYPE_INSTANCE_DOT = 'dataflow-InstanceDot';
export const TYPE_INCOMING_MESSAGE_RATE = 'dataflow-incoming-rate';
export const TYPE_OUTGOING_MESSAGE_RATE = 'dataflow-outgoing-rate';

export const NODE_ROUNDED_CORNER = 8;
export const NODE_ROUNDED_CORNER_PALETTE = 3;

const ERROR_MARKER_SIZE = { width: 20, height: 20 };
const TYPE_ICON_SIZE = { width: 24, height: 24 };

export const TYPE_ICON_PADDING_PALETTE = 7;
export const TYPE_ICON_SIZE_PALETTE = { width: 16, height: 16 };

joint.shapes.flo.DataFlowApp = joint.shapes.basic.Generic.extend({
  defaults: joint.util.deepSupplement({

    type: joint.shapes.flo.NODE_TYPE,
    position: { x: 0, y: 0 },
    size: { width: IMAGE_W, height: IMAGE_H },
    attrs: {
      '.': {
        magnet: false,
      },
      '.box': {
        refWidth: 1,
        refHeight: 1,
        rx: NODE_ROUNDED_CORNER,
        ry: NODE_ROUNDED_CORNER,
        stroke: '#6db33f',
        fill: '#eeeeee',
        'stroke-width': 2,
      },
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
        'refX': 10 + TYPE_ICON_SIZE_PALETTE.width + TYPE_ICON_PADDING_PALETTE, // jointjs specific: relative position to ref'd element
        'refY': 0.5,
        'y-alignment': 'middle',
        ref: '.box', // jointjs specific: element for ref-x, ref-y
        fill: 'black',
        'font-size': 14
      },
      '.name-label': {
        'refX': 10 + TYPE_ICON_SIZE.width + 10, // jointjs specific: relative position to ref'd element
        'refY': 0.5,
        'refY2': -4,
        'y-alignment': 'bottom',
        ref: '.box', // jointjs specific: element for ref-x, ref-y
        fill: 'black',
        'font-size': 14
      },
      '.type-label': {
        'refX': 10 + TYPE_ICON_SIZE.width + 16,
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
        refX: -10,
        refY: -3,
        refWidth: 20,
        rx: 11,
        ry: 11,
        refHeight: 6
      },
      '.type-icon': {
        ref: '.box',
        width: TYPE_ICON_SIZE.width,
        heigth: TYPE_ICON_SIZE.height,
        refX: 10,
        refY: 0.5,
        refY2: -TYPE_ICON_SIZE.height / 2,
        'xlink:href': 'assets/img/unknown.svg',
      },
      '.error-marker': {
        width: ERROR_MARKER_SIZE.width,
        height: ERROR_MARKER_SIZE.height,
        ref: '.box',
        refX: '100%',
        refX2: -1 - ERROR_MARKER_SIZE.width,
        refY: 1
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
        rx: NODE_ROUNDED_CORNER,
        ry: NODE_ROUNDED_CORNER,
      },
      '.shape': {}
    }
  }, joint.shapes.basic.Generic.prototype.defaults)
});

joint.shapes.flo.Destination = joint.shapes.basic.Generic.extend({
  defaults: joint.util.deepSupplement({

    type: joint.shapes.flo.NODE_TYPE,
    position: { x: 0, y: 0 },
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
      '.palette-entry-name-label': {
        'refX': 0.5, // jointjs specific: relative position to ref'd element
        'refY': 0.5,
        'y-alignment': 'middle',
        'x-alignment': 'middle',
        ref: '.box', // jointjs specific: element for ref-x, ref-y
        fill: 'black',
        'font-size': 14
      },
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
        refY2: -TYPE_ICON_SIZE.height / 2,
      },
      '.error-marker': {
        width: ERROR_MARKER_SIZE.width,
        height: ERROR_MARKER_SIZE.height,
        ref: '.box',
        refX: '100%',
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
      '.shape': {}
    }
  }, joint.shapes.basic.Generic.prototype.defaults)
});

joint.shapes.flo.LinkDataflow = joint.shapes.flo.Link.extend({

  toolMarkup: [
    '<g class="link-tool create-stream">',
    // '<rect class="link-tools-container" width="28" height="28"/>',
    // '<g class="tool-remove" event="remove" transform="translate(8, 4)">',
    '<rect class="link-tools-container" width="28" height="28" transform="translate(-20 -20)"/>',
    '<g class="tool-remove" event="remove">',
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
    // '<g class="tool-options" event="link:options" transform="translate(-17, -4)">',
    // '<path fill="white" transform="scale(.50)" d="M31.229,17.736c0.064-0.571,0.104-1.148,0.104-' +
    // '1.736s-0.04-1.166-0.104-1.737l-4.377-1.557c-0.218-0.716-0.504-1.401-0.851-2.05l1.993-4.192c-0.725-0.91-' +
    // '1.549-1.734-2.458-2.459l-4.193,1.994c-0.647-0.347-1.334-0.632-2.049-0.849l-1.558-4.378C17.165,0.708,16.588,' +
    // '0.667,16,0.667s-1.166,0.041-1.737,0.105L12.707,5.15c-0.716,0.217-1.401,0.502-2.05,0.849L6.464,4.005C5.554,' +
    // '4.73,4.73,5.554,4.005,6.464l1.994,4.192c-0.347,0.648-0.632,1.334-0.849,2.05l-4.378,1.557C0.708,14.834,0.667,' +
    // '15.412,0.667,16s0.041,1.165,0.105,1.736l4.378,1.558c0.217,0.715,0.502,1.401,0.849,2.049l-1.994,4.193c0.725,' +
    // '0.909,1.549,1.733,2.459,2.458l4.192-1.993c0.648,0.347,1.334,0.633,2.05,0.851l1.557,4.377c0.571,0.064,1.148,' +
    // '0.104,1.737,0.104c0.588,0,1.165-0.04,1.736-0.104l1.558-4.377c0.715-0.218,1.399-0.504,2.049-0.851l4.193,' +
    // '1.993c0.909-0.725,1.733-1.549,2.458-2.458l-1.993-4.193c0.347-0.647,0.633-1.334,0.851-2.049L31.229,17.736zM16,' +
    // '20.871c-2.69,0-4.872-2.182-4.872-4.871c0-2.69,2.182-4.872,4.872-4.872c2.689,0,4.871,2.182,4.871,4.872C20.871,' +
    // '18.689,18.689,20.871,16,20.871z"/>',
    // '<title>Properties</title>',
    // '</g>',
    '</g>'
  ].join(''),

  arrowheadMarkup: [
    '<g class="marker-arrowhead-group marker-arrowhead-group-<%= end %>">',
    '<path class="marker-arrowhead" end="<%= end %>" d="M 10 0 L 0 5 L 10 10 z" />',
    '</g>'
  ].join(''),


  defaults: joint.util.deepSupplement({
    type: joint.shapes.flo.LINK_TYPE,
    // connector: {
    //   name: 'smoothHorizontal'
    // },
//      router: { name: 'metro' },
    attrs: {
      '.connection': { stroke: '#f1f1f1', 'stroke-width': 3, 'class': 'connection' },
      '.connection-wrap': { display: 'none' },
      '.marker-arrowheads': { display: 'none' },
      '.tool-options': { display: 'block' },
      targetMarker: {
        'type': 'path',
        'd': 'M 10 -5 0 0 10 5 z'
      }
    },
  }, joint.shapes.flo.Link.prototype.defaults)
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

const InstanceDotSize = 12;

joint.shapes.flo.InstanceDot = joint.shapes.basic.Generic.extend({

  markup: '<g class="root"><rect class="instance-dot"/></g>',

  defaults: joint.util.deepSupplement({
    type: TYPE_INSTANCE_DOT,
    size: { width: InstanceDotSize, height: InstanceDotSize },
    attrs: {
      '.': { magnet: false },
      '.root': {
        refWidth: 1,
        refHeight: 1,
      },
      '.instance-dot': {
        strokeWidth: 3,
        rx: 3,
        ry: 3,
        width: InstanceDotSize,
        height: InstanceDotSize,
        ref: '.root'
      }
    }
  }, joint.shapes.basic.Generic.prototype.defaults)
});

joint.shapes.flo.DataFlowLabelHandle = joint.shapes.basic.Generic.extend({

  markup: '<g><text class="handle-label"/></g>'

});









