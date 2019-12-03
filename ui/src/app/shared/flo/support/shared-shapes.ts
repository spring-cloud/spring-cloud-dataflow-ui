import { dia } from 'jointjs';
import * as _joint from 'jointjs';

const joint: any = _joint;
const g = joint.g;
const V = joint.V;

joint.connectors.smoothHorizontal = function (sourcePoint, targetPoint, route, opt) {

  const raw = opt && opt.raw;
  let path;

  if (route && route.length !== 0) {

    const points = [sourcePoint].concat(route).concat([targetPoint]);
    const curves = g.Curve.throughPoints(points);

    path = new g.Path(curves);

  } else {
    // if we have no route, use a default cubic bezier curve
    // cubic bezier requires two control points
    // the control points have `x` midway between source and target
    // this produces an S-like curve

    path = new g.Path();

    let segment;

    segment = g.Path.createSegment('M', sourcePoint);
    path.appendSegment(segment);

    const controlPointX = (sourcePoint.x + targetPoint.x) / 2;

    segment = g.Path.createSegment('C', controlPointX, sourcePoint.y, controlPointX, targetPoint.y, targetPoint.x, targetPoint.y);
    path.appendSegment(segment);
  }

  return (raw) ? path : path.serialize();
};

joint.connectors.smoothVertical = function (sourcePoint, targetPoint, route, opt) {

  const raw = opt && opt.raw;
  let path;

  if (route && route.length !== 0) {

    const points = [sourcePoint].concat(route).concat([targetPoint]);
    const curves = g.Curve.throughPoints(points);

    path = new g.Path(curves);

  } else {
    // if we have no route, use a default cubic bezier curve
    // cubic bezier requires two control points
    // the control points have `x` midway between source and target
    // this produces an S-like curve

    path = new g.Path();

    let segment;

    segment = g.Path.createSegment('M', sourcePoint);
    path.appendSegment(segment);

    const controlPointY = (sourcePoint.y + targetPoint.y) / 2;

    segment = g.Path.createSegment('C', sourcePoint.x, controlPointY, targetPoint.x, controlPointY, targetPoint.x, targetPoint.y);
    path.appendSegment(segment);
  }

  return (raw) ? path : path.serialize();
};

joint.shapes.flo.DataflowPaletteGroupHeader = joint.shapes.basic.Generic.extend({
  // The path is the open/close arrow, defaults to vertical (open)
  markup: '<g><rect class="outer"/><rect class="group-label-bg"/><text class="group-label"/><image class="collapse-handle"/><polyline class="group-line"/></g>',
  defaults: joint.util.deepSupplement({
    type: 'palette.groupheader',
    size: {width: 170, height: 40},
    position: {x: 0, y: 0},
    attrs: {
      '.outer': {
        refWidth: 1,
        refHeight: 8,
        refX: 0,
        refY: 0,
      },
      '.group-label-bg': {
        ref: '.group-label',
        refWidth: 20,
        refHeight: 6,
        refX: -10,
        refY: -3,
        rx: 10,
        ry: 10,
        'follow-scale': true,
      },
      '.group-label': {
        ref: '.outer',
        refX: 10,
        refY: 0.5,
        'y-alignment': 'middle'
      },
      '.collapse-handle': {
        width: 30,
        height: 14,
        ref: '.outer',
        refX: '100%',
        refX2: '-30 - 20',
        refY: '50%',
        refY2: -5
      },
      '.group-line': {
        ref: '.outer',
        refPointsKeepOffset: '1,42 169,42'
      }
    },
    // custom properties
    isOpen: true
  }, joint.shapes.basic.Generic.prototype.defaults)
});

export function createPaletteGroupHeader(title: string, isOpen: boolean) {
  const group = new joint.shapes.flo.DataflowPaletteGroupHeader();
  group.attr('.group-label/text', title.toUpperCase());
  // Add CSS class to rectangle 'group-label-bg'. If class is not set then it is 'group-label-bg'
  group.attr('.group-label-bg/class', `${group.attr('.group-label-bg/class') || 'group-label-bg'} ${title.replace(' ', '-')}`);
  group.attr('.collapse-handle/xlink:href', isOpen ? 'assets/img/chevron-down.svg' : 'assets/img/chevron-left.svg');
  group.on('change:isOpen', (cell, newValue) => {
    group.attr('.collapse-handle/xlink:href', newValue ? 'assets/img/chevron-down.svg' : 'assets/img/chevron-left.svg');
  });
  return group;
}


export function shiftGraphHorizontallyOnPaper(paper: dia.Paper, offset: number) {
  const currentTranslate = paper.translate();
  const box = /*V(paper.viewport).getBBox()*/paper.getContentBBox();
  const tx = offset > 0 && offset <= 1 ? (paper.$el.innerWidth() - box.width) * offset : offset;
  paper.translate(tx, currentTranslate.ty);
}


