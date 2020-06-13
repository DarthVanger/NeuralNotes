import {
  nodeHasChildren,
  getNodeChildren,
  getNeighbours,
  doesNeighbourHaveChildren,
} from './graph.js';

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

  describe('getNeighbours', () => {
    it('should return neighbour nodes when they exist', () => {
      const node = nodes[2];
      const edges = [
        { from: '0', to: '1' },
        { from: '0', to: '2' },
        { from: '0', to: '3' },
      ];

      expect(getNeighbours({ nodes, edges }, node)).toEqual({
        leftNeighbour: nodes[1],
        rightNeighbour: nodes[3],
      });
    });

    it("should return { leftNeighbour: undefined, rightNeighbour: undefined } when neighbours don't exist", () => {
      const node = nodes[2];
      const edges = [{ from: '0', to: '2' }];

      expect(getNeighbours({ nodes, edges }, node)).toEqual({
        leftNeighbour: undefined,
        rightNeighbour: undefined,
      });
    });
  });

  describe('doesNeighbourHaveChildren', () => {
    it('should return false when the node has no neighbours', () => {
      const node = nodes[2];
      const edges = [{ from: '0', to: '2' }];

      expect(doesNeighbourHaveChildren({ nodes, edges }, node)).toBe(false);
    });

    it('should return false when the node has a left neighbour, but without children', () => {
      const node = nodes[2];
      const edges = [
        { from: '0', to: '1' },
        { from: '0', to: '2' },
      ];

      expect(doesNeighbourHaveChildren({ nodes, edges }, node)).toBe(false);
    });

    it('should return true when the node has a left neighbour with children', () => {
      const node = nodes[2];
      const edges = [
        { from: '0', to: '1' },
        { from: '0', to: '2' },
        { from: '1', to: '3' },
      ];

      expect(doesNeighbourHaveChildren({ nodes, edges }, node)).toBe(true);
    });

    it('should return true when the node has a right neighbour with children', () => {
      const node = nodes[2];
      const edges = [
        { from: '0', to: '2' },
        { from: '0', to: '3' },
        { from: '3', to: '4' },
      ];

      expect(doesNeighbourHaveChildren({ nodes, edges }, node)).toBe(true);
    });

    it('should return true when the node has both left and right neighbours with children', () => {
      const node = nodes[2];
      const edges = [
        { from: '0', to: '1' },
        { from: '0', to: '2' },
        { from: '0', to: '3' },
        { from: '1', to: '4' },
        { from: '3', to: '5' },
      ];

      expect(doesNeighbourHaveChildren({ nodes, edges }, node)).toBe(true);
    });
  });
});
