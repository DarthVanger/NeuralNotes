import _ from 'underscore';

'use strict';

let notesTree = {};

export default {
  getNotes,
  findNoteById,
  logTree,
  getRoot,
  setRoot,
  addChildrenToTree,
  deleteNode
};

function logTree() {
  console.debug('==============\n Notes Tree\n===========');
  forEachNode(function (node, depth) {
    let msg = node.name;
    for (let i = 0; i <= depth; i++) {
      msg = '>> ' + msg;
    }
    console.debug(msg);
  });
}

function findNoteById(id) {
  var depthLimit = 4;
  var nodesLimit = 50;
  var nodesCount = 0;
  var iterationLimitReached = false;
  return findInNode(notesTree.root);

  function findInNode(node, currentDepth) {
    if (iterationLimitReached) return;
    nodesCount++;
    if (!currentDepth) currentDepth = 0;
    if (node.id == id) {
      console.debug('Found note: ', node);
      return node;
    } else if (currentDepth < depthLimit && nodesCount < nodesLimit) {
      var foundNode;
      _.each(node.children, function (childNode) {
        foundNode = foundNode || findInNode(childNode, currentDepth + 1);
      });
      return foundNode;

    } else {
      console.warn('Traversing tree: reached depth/nodes limit, exiting');
      console.warn('Traversing tree: currentDepth: ', currentDepth);
      console.warn('Traversing tree: nodesCount: ', nodesCount);
      iterationLimitReached = true;
      return;
    }
  }
}

// function mapTree(func) {
//   var depthLimit = 4;
//   var nodesLimit = 50;
//   var nodesCount = 0;
//
//   var mappedTree = {};
//   executeForNode(notesTree.root, func);
//   return mappedTree;
//
//   function executeForNode(node, func, parentNode, currentDepth) {
//     nodesCount++;
//
//     var clonedNode = _.clone(node);
//     var mappedNode = func(clonedNode);
//
//     if (!currentDepth) currentDepth = 0;
//     if (!parentNode) {
//       mappedTree.root = mappedNode;
//     } else {
//       parentNode.children.push(mappedNode);
//
//       if (isRecursionLimitReached(currentDepth, nodesCount)) return;
//     }
//
//     if (node.children) {
//       clonedNode.children = [];
//       _.each(node.children, function (childNode) {
//         executeForNode(childNode, func, clonedNode, currentDepth + 1);
//       });
//     }
//   }
//
//   function isRecursionLimitReached(currentDepth, nodesCount) {
//     var limitReached = (nodesCount > nodesLimit || currentDepth > depthLimit);
//     if (limitReached) {
//       console.warn('Traversing tree: reached depth/nodes limit, exiting');
//       console.warn('Traversing tree: currentDepth: ', currentDepth);
//       console.warn('Traversing tree: nodesCount: ', nodesCount);
//     }
//
//     return limitReached;
//   }
// }

/**
 * Execute func for each node of the notes tree
 */
function forEachNode(func) {
  var depthLimit = 4;
  var nodesLimit = 50;
  var nodesCount = 0;

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
    var limitReached = (nodesCount > nodesLimit || currentDepth > depthLimit);
    if (limitReached) {
      console.warn('Traversing tree: reached depth/nodes limit, exiting');
      console.warn('Traversing tree: currentDepth: ', currentDepth);
      console.warn('Traversing tree: nodesCount: ', nodesCount);
    }

    return limitReached;
  }
}

/**
 * @param {String} options.parentId
 * @param {Array} options.children
 */
function addChildrenToTree(options) {
  var parentNote = findNoteById(options.parentId);
  var newChildren;
  newChildren = options.children.map((child) => {
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

function getNotes() {
  return notesTree;
}

function getRoot() {
  return notesTree.root;
}

function setRoot(root) {
  notesTree.root = root;
}

function deleteNode(note) {
  var noteInTree = findNoteById(note.id);
  console.log('noteInTree: ', noteInTree);
  var noteIndexInChildren = noteInTree.parent.children.indexOf(noteInTree);
  noteInTree.parent.children.splice(noteIndexInChildren, 1);
}
