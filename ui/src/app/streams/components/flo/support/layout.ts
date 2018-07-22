import { dia } from 'jointjs';
import { IMAGE_H } from './shapes';
import * as dagre from 'dagre';

export function layout(paper: dia.Paper) {
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

    graph.getElements().filter(e => !e.get('parent')).forEach(node => g.setNode(node.id, node.get('size')));

    graph.getLinks().filter(link => link.get('source').id && link.get('target').id).forEach(link => {
        g.setEdge(link.get('source').id, link.get('target').id,
            {weight: (link.get('source').port === 'output' ? 200 : 1)});
        link.set('vertices', []);
    });

    g.graph().rankdir = 'LR';
    g.graph().nodesep = 2 * gridSize;
    g.graph().ranksep = 2 * gridSize;
    g.graph().edgesep = gridSize;

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
