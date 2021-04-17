import { nodeHasChildren } from './graph.js';

const nodes = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }];

describe('nodeHasChildren', () => {
  it('should return true when node has a child', () => {
    const node = nodes[0];
    const edges = [{ from: node.id, to: '1' }];
    expect(nodeHasChildren({ nodes, edges }, node)).toBe(true);
  });

  it('should return false when node has no children', () => {
    const node = nodes[0];
    const edges = [];
    expect(nodeHasChildren({ nodes, edges }, node)).toBe(false);
  });
});
