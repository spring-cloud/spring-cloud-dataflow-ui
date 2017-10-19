import { dia } from 'jointjs';
import { IMAGE_H, START_NODE_TYPE, END_NODE_TYPE, CONTROL_GROUP_TYPE } from './shapes';
import * as dagre from 'dagre';

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
  g.graph().marginx = gridSize;
  g.graph().marginy = gridSize;
  g.graph().nodesep = 2 * gridSize;
  g.graph().ranksep = 2 * gridSize;
  g.graph().edgesep = gridSize;

  if (empty && start && end) {
    // Only start and end node are present
    // In this case ensure that start is located above the end. Fake a link between start and end nodes
    g.setEdge(start.get('id'), end.get('id'), {
      minlen: 7
    });

    g.graph().marginx = 5 * gridSize;
  }

  dagre.layout(g);
  g.nodes().forEach(v => {
    const node = <dia.Element> graph.getCell(v);
    if (node) {
      const bbox = node.getBBox();
      node.translate((g.node(v).x - g.node(v).width / 2) - bbox.x, (g.node(v).y - g.node(v).height / 2) - bbox.y);
    }
  });

}
