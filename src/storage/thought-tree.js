define([
], function(
) {
    'use strict';

    var BRAIN_FOLDER_NAME = 'Brain';
    var thoughtsTree = {};
    var THOUGHTS_TREE_CACHE_KEY = 'thoughtStorage.thoughtsTree';

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
        console.debug('thought-storage-api.findThoughtById(). id: ', id);
        console.debug('thoughtsTree: ', thoughtsTree);
       var depthLimit = 4;
       var nodesLimit = 50;
       var nodesCount = 0;
       var iterationLimitReached = false;

        console.debug('thoughstTree.root: ', thoughtsTree.root);

        return findInNode(thoughtsTree.root);

        function findInNode(node, currentDepth) {
            if (iterationLimitReached) return;
            //console.debug('findInNode() called. Node: ', node);
            nodesCount++;
            if (!currentDepth) currentDepth = 0;
            //console.debug('findInNode(): currentDepth: ', currentDepth);
            if (node.id == id) {
                console.debug('findInNode(): found the node! :', node);
                return node;
            } else if (currentDepth < depthLimit && nodesCount < nodesLimit) {
                //console.debug('Traversing tree, currentDepth: ', currentDepth);
                    var foundNode;
                    _.each(node.children, function(childNode) {
                        foundNode = foundNode || findInNode(childNode, currentDepth + 1);
                    });
                    //console.debug('foundNode: ', foundNode);
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
       console.debug('mapTree() called! func: ', func.toString());
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
               //console.debug('mapTree.executeForNode() called. CurrentDepth: ', currentDepth, 'nodesCount: ', nodesCount);
               //console.debug('mapTree.executeForNode(): node: ', node);

               if (isRecursionLimitReached(currentDepth, nodesCount)) return;
           }

           if (node.children) {
               clonedNode.children = [];
               _.each(node.children, function(childNode) {
                   executeForNode(childNode, func, clonedNode, currentDepth + 1);
               });
           } else {
               //console.debug('mapTree(): reached leaf node: ', node);
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
       console.debug('forEachNode() called!');
       var depthLimit = 4;
       var nodesLimit = 50;
       var nodesCount = 0;

       executeForNode(thoughtsTree.root, func); 

       function executeForNode(node, func, currentDepth) {
           //console.debug('executeForNode() called. CurrentDepth: ', currentDepth, 'nodesCount: ', nodesCount);
           if (!currentDepth) currentDepth = 0;
           //console.debug('executeForNode(): node: ', node);

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
        console.debug('addChildrenToTree() called, options: ', options);
        console.debug('thought-tree.addChildrenToTree()');
        var parentThought = findThoughtById(options.parentId);
        console.debug('addChildrenToTree(): found parentThought by id: ', parentThought);
        parentThought.children = options.children;
    }

    function getThoughts() {
        console.debug('thoughtStorage.getThoughts(). Returning thoughts: ', thoughtsTree);
        return thoughtsTree;
    }

    function getRoot() {
        return thoughtsTree.root;
    }

    function setRoot(root) {
        thoughtsTree.root = root;
    }

});
