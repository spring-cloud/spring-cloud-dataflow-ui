import { dia } from 'jointjs';
import { IMAGE_H, START_NODE_TYPE, END_NODE_TYPE, CONTROL_GROUP_TYPE } from './shapes';
import * as dagre from 'dagre';
import { shiftGraphHorizontallyOnPaper } from '../../../../shared/flo/support/shared-shapes';
import { Flo } from 'spring-flo';

export function layout(paper: dia.Paper) {
  let start, end, empty = true;
  const graph = paper.model;

  let gridSize = paper.options.gridSize;
  if (gridSize <= 1) {
    gridSize = IMAGE_H / 2;
  }

  const g = new dagre.graphlib.Graph();
  g.setGraph({});

  g.setDefaultEdgeLabel(function () {
    return {};
  });

  graph.getElements().forEach(node => {
    // ignore embedded cells
    if (!node.get('parent')) {
      g.setNode(node.id, node.get('size'));

      // Determine start and end node
      if (node.attr('metadata/name') === START_NODE_TYPE && node.attr('metadata/group') === CONTROL_GROUP_TYPE) {
        start = node;
      } else if (node.attr('metadata/name') === END_NODE_TYPE && node.attr('metadata/group') === CONTROL_GROUP_TYPE) {
        end = node;
      } else {
        empty = false;
      }
    }
  });

  graph.getLinks().filter(l => l.get('source').id && l.get('target').id).forEach(link => {
    g.setEdge(link.get('source').id, link.get('target').id);
    link.set('vertices', []);
  });

  g.graph().rankdir = 'TB';
  g.graph().nodesep = 2 * gridSize;
  g.graph().ranksep = 2 * gridSize;
  g.graph().edgesep = gridSize;

  if (empty && start && end) {
    // Only start and end node are present
    // In this case ensure that start is located above the end. Fake a link between start and end nodes
    g.setEdge(start.get('id'), end.get('id'), {
      minlen: 7
    });
  }

  dagre.layout(g);

  let rankOffset: any = null;

  if (!(empty && start && end)) {
    const dagreOverlappingLinks = verticalLinksOverlapping(g, 2);
    if (dagreOverlappingLinks > 0) {
      rankOffset = centerAlignRanks(g);
      // Check the number of overlapping vertical links for rank centered version
      const rankCenteredOverlaps = verticalLinksOverlapping(g, 2, rankOffset);
      if (rankCenteredOverlaps >= dagreOverlappingLinks) {
        // If after ranks centering number of overlaps remains the same void rank offsets
        rankOffset = null;
      }
    }
  }

  g.nodes().forEach(v => {
    const node = <dia.Element> graph.getCell(v);
    if (node) {
      const graphNode = g.node(v);
      const bbox = node.getBBox();
      const offset = rankOffset && rankOffset[graphNode.y] ? rankOffset[graphNode.y] : 0;
      node.translate((graphNode.x + offset - graphNode.width / 2) - bbox.x, (graphNode.y - graphNode.height / 2) - bbox.y);
    }
  });

}

export function arrangeAll(editorContext: Flo.EditorContext): Promise<void> {
  return editorContext.performLayout().then(() => {
    editorContext.fitToPage();
    shiftGraphHorizontallyOnPaper(editorContext.getPaper(), 1 / 5);
  });
}

export function verticalLinksOverlapping(g: dagre.graphlib.Graph, tolerance: number, ranksOffset?: any): number {
  let numberOfOverlaps = 0;

  // Find all nearly vertical links within the tolerance value
  const verticalLinks = g.edges().filter(e => {
    const source = g.node(e.v);
    const target = g.node(e.w);
    const offsetSource = ranksOffset && ranksOffset[source.y] ? ranksOffset[source.y] : 0;
    const offsetTarget = ranksOffset && ranksOffset[target.y] ? ranksOffset[target.y] : 0;
    if (Math.abs((source.x + offsetSource) - (target.x + offsetTarget)) < 2 * tolerance) {
      return true;
    } else {
      return false;
    }
  });

  // Check if any parts of these links overlap
  for (let i = 0; i < verticalLinks.length - 1; i++) {
    const link = verticalLinks[i];
    const source = g.node(link.v);
    const target = g.node(link.w);
    const offsetSourceB = ranksOffset && ranksOffset[source.y] ? ranksOffset[source.y] : 0;
    const offsetTargetB = ranksOffset && ranksOffset[target.y] ? ranksOffset[target.y] : 0;
    const minX = Math.min(source.x + offsetSourceB, target.x + offsetTargetB) - tolerance;
    const maxX = Math.max(source.x + offsetSourceB, target.x + offsetTargetB) + tolerance;
    const minY = Math.min(source.y, target.y);
    const maxY = Math.max(source.y, target.y);
    for (let j = i + 1; j < verticalLinks.length; j++) {
      const otherLink = verticalLinks[j];
      const otherSource = g.node(otherLink.v);
      const otherTarget = g.node(otherLink.w);
      const offsetSourceC = ranksOffset && ranksOffset[otherSource.y] ? ranksOffset[otherSource.y] : 0;
      const offsetTargetC = ranksOffset && ranksOffset[otherTarget.y] ? ranksOffset[otherTarget.y] : 0;
      if ((minX < otherSource.x + offsetSourceC && otherSource.x + offsetSourceC < maxX && minY < otherSource.y && otherSource.y < maxY)
        || (minX < otherTarget.x + offsetTargetC && otherTarget.x + offsetTargetC < maxX && minY < otherTarget.y && otherTarget.y < maxY)) {
        numberOfOverlaps++;
      }
    }
  }
  return numberOfOverlaps;
}

export function centerAlignRanks(g: dagre.graphlib.Graph): any {
  let minX = Number.POSITIVE_INFINITY, maxX = Number.NEGATIVE_INFINITY, minY = Number.POSITIVE_INFINITY,
    maxY = Number.NEGATIVE_INFINITY;
  const ranks: any = {};
  g.nodes().forEach(v => {
    const graphNode = g.node(v);
    let rank = ranks[graphNode.y];
    if (!rank) {
      rank = [];
      ranks[graphNode.y] = rank;
    }
    rank.push(graphNode);
    minX = Math.min(minX, graphNode.x - graphNode.width / 2);
    minY = Math.min(minY, graphNode.y - graphNode.height / 2);
    maxX = Math.max(maxX, graphNode.x + graphNode.width / 2);
    maxY = Math.max(maxY, graphNode.y + graphNode.height / 2);
  });

  const graphWidth = maxX - minX;

  const rankOffset = {};
  Object.keys(ranks).forEach(key => {
    const rank = ranks[key];
    if (Array.isArray(rank) && rank.length) {
      let rankMinX = Number.POSITIVE_INFINITY, rankMaxX = Number.NEGATIVE_INFINITY;
      rank.forEach(n => {
        rankMinX = Math.min(rankMinX, n.x - n.width / 2);
        rankMaxX = Math.max(rankMaxX, n.x + n.width / 2);
      });
      rankOffset[key] = minX + (graphWidth - (rankMaxX - rankMinX)) / 2 - rankMinX;
    }
  });

  return rankOffset;
}

