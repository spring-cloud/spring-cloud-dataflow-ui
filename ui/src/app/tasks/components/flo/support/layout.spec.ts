import * as dagre from 'dagre';
import { centerAlignRanks, verticalLinksOverlapping } from './layout';
import * as _ from 'lodash';

describe('tasks layout', () => {

  it('no overlapping links', () => {
    const g = new dagre.graphlib.Graph();
    g.setGraph({});

    g.setDefaultEdgeLabel(function () {
      return {};
    });
    const gridSize = 20;
    g.graph().rankdir = 'TB';
    g.graph().nodesep = 2 * gridSize;
    g.graph().ranksep = 2 * gridSize;
    g.graph().edgesep = gridSize;

    g.setNode('START', { width: 40, height: 40 });
    g.setNode('Import', { width: 120, height: 40 });
    g.setNode('Uppercase', { width: 120, height: 40 });
    g.setNode('END', { width: 40, height: 40 });

    g.setEdge('START', 'Import');
    g.setEdge('Import', 'Uppercase');
    g.setEdge('Uppercase', 'END');

    dagre.layout(g);

    expect(verticalLinksOverlapping(g, 2)).toEqual(0);
  });


  it('1 overlapping link', () => {
    const g = new dagre.graphlib.Graph();
    g.setGraph({});

    g.setDefaultEdgeLabel(function () {
      return {};
    });
    const gridSize = 20;
    g.graph().rankdir = 'TB';
    g.graph().nodesep = 2 * gridSize;
    g.graph().ranksep = 2 * gridSize;
    g.graph().edgesep = gridSize;

    g.setNode('START', { width: 40, height: 40 });
    g.setNode('Import', { width: 120, height: 40 });
    g.setNode('Uppercase', { width: 120, height: 40 });
    g.setNode('Backwards', { width: 120, height: 40 });
    g.setNode('Lowercase', { width: 120, height: 40 });
    g.setNode('END', { width: 40, height: 40 });

    g.setEdge('START', 'Import');
    g.setEdge('Import', 'Uppercase');
    g.setEdge('Uppercase', 'Backwards');
    g.setEdge('Uppercase', 'Lowercase');
    g.setEdge('Uppercase', 'END');
    g.setEdge('Backwards', 'END');
    g.setEdge('Lowercase', 'END');

    dagre.layout(g);

    expect(verticalLinksOverlapping(g, 2)).toEqual(1);
  });

  it('center align ranks', () => {
    const g = new dagre.graphlib.Graph();
    g.setGraph({});

    g.setDefaultEdgeLabel(function () {
      return {};
    });
    const gridSize = 20;
    g.graph().rankdir = 'TB';
    g.graph().nodesep = 2 * gridSize;
    g.graph().ranksep = 2 * gridSize;
    g.graph().edgesep = gridSize;

    g.setNode('START', { width: 40, height: 40 });
    g.setNode('Import', { width: 120, height: 40 });
    g.setNode('Uppercase', { width: 120, height: 40 });
    g.setNode('Backwards', { width: 120, height: 40 });
    g.setNode('Lowercase', { width: 120, height: 40 });
    g.setNode('END', { width: 40, height: 40 });

    g.setEdge('START', 'Import');
    g.setEdge('Import', 'Uppercase');
    g.setEdge('Uppercase', 'Backwards');
    g.setEdge('Uppercase', 'Lowercase');
    g.setEdge('Uppercase', 'END');
    g.setEdge('Backwards', 'END');
    g.setEdge('Lowercase', 'END');

    dagre.layout(g);

    const ranksOffset = centerAlignRanks(g);

    const expectedRanksOffset = {
      20: 80,
      100: 80,
      180: 80,
      260: 0,
      340: 80
    };

    expect(_.isEqual(ranksOffset, expectedRanksOffset)).toBeTruthy();
  });

});
