define([
    'api/google-drive-api',
    'ui/spinner/site-global-loading-bar',
    'storage/thought-storage-api',
    'storage/thought-tree'
], function(
    googleDriveApi,
    siteGlobalLoadingBar,
    thoughtStorageApi,
    thoughtStorageTree
) {
    'use strict';

    var appRootFolder = thoughtStorageApi.appRootFolder;
    var thoughtsTree = {};

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
        console.debug('thoughtStorage.scanDrive()');
        return thoughtStorageApi.scanDrive()
            .then(function() {
                thoughtStorageTree.setRoot(thoughtStorageApi.appRootFolder);
                console.info('Thought tree root set to the App root folder on Google Drive');
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
