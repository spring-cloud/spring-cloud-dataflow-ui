import * as _joint from 'jointjs';
const joint: any = _joint;

// Load changes into joint object
import 'spring-flo';

export const IMAGE_W = 120;
export const IMAGE_H = 40;
export const HORIZONTAL_PADDING = 5;

export const OTHER_GROUP_TYPE = 'other';

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
                width: IMAGE_W,
                height: IMAGE_H,
                rx: 2,
                ry: 2,
                // 'fill-opacity':0, // see through
                stroke: '#6db33f',
                fill: '#eeeeee',
                'stroke-width': 2,
            },
            '.input-port': {
                type: 'input',
                port: 'input',
                height: 8, width: 8,
                magnet: true,
                fill: '#eeeeee',
                transform: 'translate(' + -4 + ',' + ((IMAGE_H / 2) - 4) + ')',
                stroke: '#34302d',
                'stroke-width': 1,
            },
            '.output-port': {
                type: 'output',
                port: 'output',
                height: 8, width: 8,
                magnet: true,
                fill: '#eeeeee',
                transform: 'translate(' + (IMAGE_W - 4) + ',' + ((IMAGE_H / 2) - 4) + ')',
                stroke: '#34302d',
                'stroke-width': 1,
            },
            '.label1': {
                'ref-x': 0.5, // jointjs specific: relative position to ref'd element
                'ref-y': 0.525,
                'y-alignment': 'middle',
                'x-alignment': 'middle',
                ref: '.box', // jointjs specific: element for ref-x, ref-y
                fill: 'black',
                'font-size': 14
            },
            '.label2': {
                'y-alignment': 'middle',
                'ref-x': HORIZONTAL_PADDING + 2, // jointjs specific: relative position to ref'd element
                'ref-y': 0.55, // jointjs specific: relative position to ref'd element
                ref: '.box', // jointjs specific: element for ref-x, ref-y
                fill: 'black',
                'font-size': 20
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
                width: IMAGE_W,
                height: IMAGE_H / 2,
                rx: 2,
                ry: 2,
                // 'fill-opacity':0, // see through
                stroke: '#6db33f',
                fill: '#eeeeee',
                'stroke-width': 2,
            },
            '.input-port': {
                type: 'input',
                port: 'input',
                r: 4, // height: 8, width: 8,
                magnet: true,
                fill: '#eeeeee',
                // transform: 'translate(' + -4 + ',' + ((IMAGE_H/2)-4) + ')',
                transform: 'translate(1,' + ((IMAGE_H / 2)) + ')',
                stroke: '#34302d',
                'stroke-width': 1,
            },
            '.output-port': {
                type: 'output',
                port: 'output',
                r: 4, // height: 8, width: 8,
                magnet: true,
                fill: '#eeeeee',
                transform: 'translate(' + (IMAGE_W - 1) + ',' + ((IMAGE_H / 2)) + ')',
                stroke: '#34302d',
                'stroke-width': 1,
            },
            '.label1': {
                'ref-x': 0.5, // jointjs specific: relative position to ref'd element
                'ref-y': 0.525,
                'y-alignment': 'middle',
                'x-alignment': 'middle',
                ref: '.box', // jointjs specific: element for ref-x, ref-y
                fill: 'black',
                'font-size': 14
            },
            '.label2': {
                'y-alignment': 'middle',
                'ref-x': HORIZONTAL_PADDING + 2, // jointjs specific: relative position to ref'd element
                'ref-y': 0.55, // jointjs specific: relative position to ref'd element
                ref: '.box', // jointjs specific: element for ref-x, ref-y
                fill: 'black',
                'font-size': 20
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
        '<rect class="link-tools-container" width="22" height="47" transform="translate(-11 -11)"/>',
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
        '</g>'
    ].join(''),

    defaults: joint.util.deepSupplement({
        type: joint.shapes.flo.LINK_TYPE,
        options: {
            linkToolsOffset: 1000,
        },
        smooth: true,
//             router: { name: 'metro' },
        attrs: {
            '.connection': { stroke: '#34302d', 'stroke-width': 2 },
            '.connection-wrap': { display: 'none' },
            '.marker-arrowheads': { display: 'none' },
            '.tool-options': { display: 'none' }
        },
    }, joint.dia.Link.prototype.defaults)
});

