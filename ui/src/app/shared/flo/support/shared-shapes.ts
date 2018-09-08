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

export function shiftGraphHorizontallyOnPaper(paper: dia.Paper, offset: number) {
  const currentTranslate = paper.translate();
  const box = /*V(paper.viewport).getBBox()*/paper.getContentBBox();
  const tx = offset > 0 && offset <= 1 ? (paper.$el.innerWidth() - box.width) * offset : offset;
  paper.translate(tx, currentTranslate.ty);
}


