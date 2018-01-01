define([
    'google-drive-api',
    'spinner/site-global-loading-bar',
    'thought/thought-storage/thought-storage-api',
    'thought/thought-storage/thought-tree',
    //TODO: thinking of using tree model for traversing brain tree
    //'./../../lib/TreeModel',
], function(
    googleDriveApi,
    siteGlobalLoadingBar,
    thoughtStorageApi,
    thoughtStorageTree,
    //TreeModel,
) {
    'use strict';

    //TODO: thinking of using tree model for traversing brain tree
    //console.debug('TreeModel: ', TreeModel);

    var BRAIN_FOLDER_NAME = 'Brain';
    var brainFolder = thoughtStorageApi.brainFolder;
    var thoughtsTree = {};
    var THOUGHTS_TREE_CACHE_KEY = 'thoughtStorage.thoughtsTree';

    var spinner = siteGlobalLoadingBar.create('thought-storage');

    return {
        restoreFromCache: restoreFromCache,
        scanDrive: scanDrive,

        // thoughts tree
        findThoughtById: thoughtStorageTree.findThoughtById,
        getThoughts: thoughtStorageTree.getThoughts,
        logTree: thoughtStorageTree.logTree,
        getRoot: thoughtStorageTree.getRoot,

        // api:
        fetchParentThought: fetchParentThought,
        fetchChildThoughts: fetchChildThoughts,
        getThoughtContent: thoughtStorageApi.getThoughtContent,
        create: create,
        update: thoughtStorageApi.update,
    };

    function fetchChildThoughts(thoughtId) {
        return thoughtStorageApi.fetchChildThoughts(thoughtId)
            .then(function(children) {
                thoughtStorageTree.addChildrenToTree({
                    parentId: thoughtId,
                    children: children
                });

                return children;
            });
    }

    function fetchParentThought(thoughtId) {
        return thoughtStorageApi.fetchParentThought(thoughtId)
            .then(function(parentThought) {
                var thought = thoughtStorageTree.findThoughtById(thoughtId);
                if (thought) { // root folder has no parent
                    thought.parent = parentThought;
                }
                return thought;
            });
    }

    function scanDrive() {
        return thoughtStorageApi.scanDrive()
            .then(function() {
                thoughtStorageTree.setRoot(thoughtStorageApi.brainFolder);
                console.debug('thoughtStorage.scanDrive(), stored thoughtsTree: ', thoughtsTree);
            });
    }

    function restoreFromCache() {
        return thoughtStorageTree.restoreFromCache();
    }

    function create(thought, parentThought) {
        return thoughtStorageApi.create(thought, parentThought).then(function(createdThought) {
            var parentThoughtInTree = thoughtStorageTree.findThoughtById(parentThought.id);
            if (!parentThoughtInTree.children) {
                parentThoughtInTree.children = [];
            }
            parentThoughtInTree.children.push(createdThought);
            console.debug('thoughtStore.create(): thoughtsTree after creating thought: ', thoughtsTree);  
            return createdThought;
        });

    }



});
