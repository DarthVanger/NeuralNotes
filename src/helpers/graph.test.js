import { nodeHasChildren, getNodeChildren } from './graph.js';

const nodes = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }];

describe('graph helper', () => {
  describe('nodeHasChildren', () => {
    it('should return true when node has a child', () => {
      const node = nodes[0];
      const edges = [{ from: node.id, to: '1' }];
      expect(nodeHasChildren({ nodes, edges }, node)).toBe(true);
    });

    it('should return false when node has no children', () => {
      const node = nodes[0];
      const edges = [{ from: '1', to: '2' }];
      expect(nodeHasChildren({ nodes, edges }, node)).toBe(false);
    });
  });

  describe('getNodeChildren', () => {
    it('should return node children when the node has children', () => {
      const node = nodes[0];
      const edges = [
        { from: node.id, to: '1' },
        { from: node.id, to: '2' },
      ];
      expect(getNodeChildren({ nodes, edges }, node)).toEqual([
        nodes[1],
        nodes[2],
      ]);
    });

    it('should return empty array when the node has no children', () => {
      const node = nodes[0];
      const edges = [{ from: '1', to: '2' }];
      expect(getNodeChildren({ nodes, edges }, node)).toEqual([]);
    });
  });
});
