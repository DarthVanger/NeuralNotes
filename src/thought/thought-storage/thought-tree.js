define([
    //TODO: thinking of using tree model for traversing brain tree
    //'./../../lib/TreeModel'
], function(
    //TreeModel
) {
    'use strict';

    //TODO: thinking of using tree model for traversing brain tree
    //console.debug('TreeModel: ', TreeModel);

    var BRAIN_FOLDER_NAME = 'Brain';
    var thoughtsTree = {};
    var THOUGHTS_TREE_CACHE_KEY = 'thoughtStorage.thoughtsTree';

    return {
        getThoughts: getThoughts,
        restoreFromCache: restoreFromCache,
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
        console.debug('thought-storage.findThoughtById(). id: ', id);
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
        console.debug('thought-storage.addChildrenToTree()');
        var parentThought = findThoughtById(options.parentId);
        console.debug('addChildrenToTree(): found parentThought by id: ', parentThought);
        parentThought.children = options.children;
        saveTreeToCache();
    }

    function saveTreeToCache() {
        console.debug('saveTreeToCache(): thoughtsTree: ', thoughtsTree);
        //var decycled = deleteLinksToParents(thoughtsTree.map(deleteLinkToParent);
        //window.localStorage.setItem(THOUGHTS_TREE_CACHE_KEY, JSON.stringify(thoughtsTree));
        //var decycledTree = {};
        //forEachNode(function(node) {
        //    console.debug('forEachNode(): node.name: ', node.name);
        //});
        
        var decycledTree = mapTree(function(node) {
            //console.debug('mapTree(): node.name: ', node.name);
            //console.debug('mapTree(): node.parent: ', node.parent);
            delete node.parent;
            return node;
        });

        console.debug('saveTreeToCache(): decycledTree: ', decycledTree);

        window.localStorage.setItem(THOUGHTS_TREE_CACHE_KEY, JSON.stringify(decycledTree));
    }

    function loadTreeFromCache() {
        console.debug('loadTreeFromCache()');
        var cachedTreeString = window.localStorage.getItem(THOUGHTS_TREE_CACHE_KEY);

        if (cachedTreeString) {
            console.debug('loadTreeFromCache(): cache found, cache string: ', cachedTreeString);
            return JSON.parse(cachedTreeString);
        } else {
            console.debug('loadTreeFromCache(): cache not found');
            return undefined;
        }
    }

    function restoreFromCache() {
        var cachedThoughtsTree = loadTreeFromCache();
        if (cachedThoughtsTree) {
            console.debug('restoreFromCache(): cachedThoughtsTree: ', cachedThoughtsTree);
            thoughtsTree = cachedThoughtsTree;
            return cachedThoughtsTree;
        } else {
            console.debug('restoreFromCache(): thoughts cache is empty');
            return false;
        }
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
