define([
], function(
) {
    'use strict';

    var thoughtsTree = {};

    return {
        getThoughts: getThoughts,
        findThoughtById: findThoughtById,
        logTree: logTree,
        getRoot: getRoot,
        setRoot: setRoot,
        addChildrenToTree: addChildrenToTree
    };

    function logTree() {
        console.debug('==============\n Thoughts Tree\n===========');
        forEachNode(function(node, depth) {
            var msg = node.name;
            for (var i = 0; i <= depth; i++) {
                msg = '>> ' + msg;
            }
            console.debug(msg);
        });
    }

    function findThoughtById(id) {
       var depthLimit = 4;
       var nodesLimit = 50;
       var nodesCount = 0;
       var iterationLimitReached = false;
        return findInNode(thoughtsTree.root);

        function findInNode(node, currentDepth) {
            if (iterationLimitReached) return;
            nodesCount++;
            if (!currentDepth) currentDepth = 0;
            if (node.id == id) {
                console.debug('Found thought: ' + node.name);
                return node;
            } else if (currentDepth < depthLimit && nodesCount < nodesLimit) {
                    var foundNode;
                    _.each(node.children, function(childNode) {
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

    function mapTree(func) {
       var depthLimit = 4;
       var nodesLimit = 50;
       var nodesCount = 0;

       var mappedTree = {};
       executeForNode(thoughtsTree.root, func); 
       return mappedTree;

       function executeForNode(node, func,  parentNode, currentDepth) {
           nodesCount++;

           var clonedNode = _.clone(node);
           var mappedNode = func(clonedNode);

           if (!currentDepth) currentDepth = 0;
           if (!parentNode) {
               mappedTree.root = mappedNode;
           } else {
               parentNode.children.push(mappedNode);

               if (isRecursionLimitReached(currentDepth, nodesCount)) return;
           }

           if (node.children) {
               clonedNode.children = [];
               _.each(node.children, function(childNode) {
                   executeForNode(childNode, func, clonedNode, currentDepth + 1);
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
     * Execute func for each node of the thoughts tree
     */
    function forEachNode(func) {
       var depthLimit = 4;
       var nodesLimit = 50;
       var nodesCount = 0;

       executeForNode(thoughtsTree.root, func); 

       function executeForNode(node, func, currentDepth) {
           if (!currentDepth) currentDepth = 0;

           if (isRecursionLimitReached(currentDepth, nodesCount)) return;

           func(node, currentDepth);
           if (node.children) {
               _.each(node.children, function(node) {
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
        var parentThought = findThoughtById(options.parentId);
        var newChildren;
        if (parentThought.children) {
            parentThought.children = parentThought.children.concat(options.children);
        } else {
            parentThought.children = options.children;
        }

        return parentThought.children;
    }

    function getThoughts() {
        return thoughtsTree;
    }

    function getRoot() {
        return thoughtsTree.root;
    }

    function setRoot(root) {
        thoughtsTree.root = root;
    }

});
