import _ from 'underscore';

'use strict';

let notesTree = {};

export function logTree() {
  console.debug('==============\n Notes Tree\n===========');
  forEachNode(function (node, depth) {
    let msg = node.name;
    for (let i = 0; i <= depth; i++) {
      msg = '>> ' + msg;
    }
    console.debug(msg);
  });
}

export function findNoteById(id) {
  const depthLimit = 4;
  const nodesLimit = 50;
  let nodesCount = 0;
  let iterationLimitReached = false;
  return findInNode(notesTree.root);

  function findInNode(node, currentDepth) {
    if (iterationLimitReached) return;
    nodesCount++;
    if (!currentDepth) currentDepth = 0;
    if (node.id === id) {
      console.debug('Found note: ', node);
      return node;
    } else if (currentDepth < depthLimit && nodesCount < nodesLimit) {
      let foundNode = undefined;
      _.each(node.children, function (childNode) {
        foundNode = foundNode || findInNode(childNode, currentDepth + 1);
      });
      return foundNode;

    } else {
      console.warn('Traversing tree: reached depth/nodes limit, exiting');
      console.warn('Traversing tree: currentDepth: ', currentDepth);
      console.warn('Traversing tree: nodesCount: ', nodesCount);
      iterationLimitReached = true;
    }
  }
}

/**
 * Execute func for each node of the notes tree
 */
function forEachNode(func) {
  const depthLimit = 4;
  const nodesLimit = 50;
  const nodesCount = 0;

  executeForNode(notesTree.root, func);

  function executeForNode(node, func, currentDepth) {
    if (!currentDepth) currentDepth = 0;

    if (isRecursionLimitReached(currentDepth, nodesCount)) return;

    func(node, currentDepth);
    if (node.children) {
      _.each(node.children, function (node) {
        executeForNode(node, func, currentDepth + 1);
      });
    }
  }

  function isRecursionLimitReached(currentDepth, nodesCount) {
    const limitReached = (nodesCount > nodesLimit || currentDepth > depthLimit);
    if (limitReached) {
      console.warn('Traversing tree: reached depth/nodes limit, exiting');
      console.warn('Traversing tree: currentDepth: ', currentDepth);
      console.warn('Traversing tree: nodesCount: ', nodesCount);
    }

    return limitReached;
  }
}

/**
 * @param {Object} options
 * @param {String} options.parentId
 * @param {Array} options.children
 */
export function addChildrenToTree({ parentId, children }) {
  const parentNote = findNoteById(parentId);
  let newChildren;
  newChildren = children.map((child) => {
    child.parent = parentNote;
    return child;
  });

  if (parentNote.children) {
    parentNote.children = parentNote.children.concat(newChildren);
  } else {
    parentNote.children = newChildren;
  }

  return parentNote.children;
}

export function getNotes() {
  return notesTree;
}

export function getRoot() {
  return notesTree.root;
}

export function setRoot(root) {
  notesTree.root = root;
}

export function deleteNode({ id }) {
  const noteInTree = findNoteById(id);
  console.log('noteInTree: ', noteInTree);
  const noteIndexInChildren = noteInTree.parent.children.indexOf(noteInTree);
  noteInTree.parent.children.splice(noteIndexInChildren, 1);
}
