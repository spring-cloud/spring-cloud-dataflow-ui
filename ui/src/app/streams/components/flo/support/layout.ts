import { dia } from 'jointjs';
import * as dagre from 'dagre';
import { Flo } from 'spring-flo';

const NODE_SEPARATION = 60.0;
const RANK_SEPARATION = 60.0;
const EDGE_SEPARATION = 30.0;

export function layout(paper: dia.Paper) {
  const graph = paper.model;

  const g = new dagre.graphlib.Graph();
  g.setGraph({});
  g.setDefaultEdgeLabel(function () {
    return {};
  });

  graph.getElements().filter(e => !e.get('parent')).forEach(node => g.setNode(node.id, node.get('size')));

  graph.getLinks().filter(link => link.get('source').id && link.get('target').id).forEach(link => {
    g.setEdge(link.get('source').id, link.get('target').id,
      { weight: (link.get('source').port === 'output' ? 200 : 1) });
    link.set('vertices', []);
  });

  const gridSize = paper.options.gridSize;
  g.graph().rankdir = 'LR';
  g.graph().nodesep = gridSize <= 1 ? NODE_SEPARATION : Math.round(NODE_SEPARATION / gridSize) * gridSize;
  g.graph().ranksep = gridSize <= 1 ? RANK_SEPARATION : Math.round(RANK_SEPARATION / gridSize) * gridSize;
  g.graph().edgesep = gridSize <= 1 ? EDGE_SEPARATION : Math.round(EDGE_SEPARATION / gridSize) * gridSize;

  dagre.layout(g);
  g.nodes().forEach(v => {
    const node = <dia.Element> graph.getCell(v);
    if (node) {
      const bbox = node.getBBox();
      node.translate((g.node(v).x - g.node(v).width / 2) - bbox.x, (g.node(v).y - g.node(v).height / 2) - bbox.y);
    }
  });

  g.edges().forEach(o => g.edge(o));

}

export function arrangeAll(editorContext: Flo.EditorContext): Promise<void> {
  return editorContext.performLayout().then(() => {
    editorContext.fitToPage();
    const currentScale = editorContext.getPaper().scale();
    if (currentScale.sx > 1 || currentScale.sy > 1) {
      editorContext.getPaper().scale(1);
    }
  });
}
