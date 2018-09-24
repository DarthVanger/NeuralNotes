define([
    'thought/view-thoughts/brain-vis-network',
    'thought/view-thoughts/vis-network-helper',
    'storage/thought-storage',
    'ui/spinner/site-global-loading-bar',
    'underscore',
    'ui/ui-error-notification',
    'ui/thought-name-editor',
    'ui/thought-content-editor'
], function(
    BrainVisNetwork,
    VisNetworkHelper,
    thoughtStorage,
    siteGlobalLoadingBar,
    _,
    uiErrorNotification,
    thoughtNameEditor,
    thoughtContentEditor
) {
    var brainVisNetwork;
    var visNetworkHelper;
    var thoughts = [];
    var currentViewedThought;
    var currentViewedThoughtId;
    var initialThought;

    var spinner = siteGlobalLoadingBar.create('mind map');

    return {
        render: render
    };

    /**
     * Set thoughts and selectedThought.
     * @param {Array} options.thoughts - Array of thoughts to render.
     * @param {String} options.selectedThoughtId - Id of thought that should be in focus (center).
     */
    function setOptions(options) {
        console.debug('thoughtsMindMapView.setOptions(), options: ', options);
        thoughts = options.thoughts;
        console.debug('options.selectedThoughtId: ', options.selectedThoughtId);
        initialThought = options.selectedThought;
        currentViewedThought = initialThought;
        currentViewedThoughtId = initialThought.id;
        console.debug('currentViewedThoughtId: ', currentViewedThoughtId);
    }
    
    function render(options) {
        setOptions(options);

        var element = document.createElement('div');
        element.id = 'thoughts-container';
        
        brainVisNetwork = new BrainVisNetwork({
            containerDomElement: element
        });

        brainVisNetwork.renderInitialThought(initialThought);
        changeThought(initialThought);
        visNetworkHelper = new VisNetworkHelper(brainVisNetwork.visNetwork);

        brainVisNetwork.visNetwork.on('click', visNetworkClickHandler);
        brainVisNetwork.visNetwork.on('doubleClick', visNetworkDoubleClickHandler);
        brainVisNetwork.visNetwork.on('hold', visNetworkHoldHandler);

        return element;
    }

    function visNetworkClickHandler(event) {
        closeThoughtNameEditor();
        if (visNetworkHelper.clickedOnThought(event)) {
            console.debug('change thought!');
            console.debug('event: ', event);
            var targetThoughtId = visNetworkHelper.getTargetThoughtId(event);

            thoughtClickHandler(targetThoughtId);
        }
    }

    function visNetworkDoubleClickHandler(event) {
        if (visNetworkHelper.clickedOnThought(event)) {
            var targetThoughtId = visNetworkHelper.getTargetThoughtId(event);
            console.info('=== Event === Node double click');
            createEmptyChild(targetThoughtId);
        }
    }

    function visNetworkHoldHandler(event) {
        if (visNetworkHelper.clickedOnThought(event)) {
            var targetThoughtId = visNetworkHelper.getTargetThoughtId(event);
            console.info('=== Event === Node hold');
            editThought(targetThoughtId);
        }
    }

    function editThought(targetThoughtId) {
        thought = thoughtStorage.findThoughtById(targetThoughtId);

        currentViewedThought = thought;
        brainVisNetwork.selectNote(targetThoughtId);

        thoughtNameEditor.render({
            thought: thought,
            onChange: onChange,
            onDeleteClick: onDeleteClick,
            onUploadFileClick: onUploadFileClick
        });

        function onChange(event) {
            var name = event.target.value;

            thoughtStorage.updateThoughtName({
                id: targetThoughtId,
                name: name
            })
                .then(function() {
                    brainVisNetwork.updateNode({
                        id: targetThoughtId,
                        label: name
                    });
                });

        }
    }

    function onDeleteClick(event) {
        var note = currentViewedThought;
        console.info('Deleting ' + note.name + '...');
        thoughtStorage.remove(note)
            .then(function() {
                console.info('Deleted ' + note.name);
                brainVisNetwork.deleteSelectedNode();
            });
    }

    function onUploadFileClick(event) {
        var note = currentViewedThought;
        console.info('[Event] Upload file click');

        window.open(thoughtStorage.getLinkToThought(currentViewedThought));
    }

    function closeThoughtNameEditor() {
        thoughtNameEditor.unmount();
    }

    function createEmptyChild(parentId) {
        var thought = {
            name: 'new',
            content: '' 
        };

        var parent = thoughtStorage.findThoughtById(parentId);

        return thoughtStorage.create(thought, parent)
            .then(function(newThought) {
               thought.id = newThought.id;

               var children = [thought];

               thoughtStorage.addChildrenToTree({
                   parentId: parentId,
                   children: children
               });

               brainVisNetwork.addChildThoughts({
                   children: children,
                   parentThoughtId: parentId
               });

               editThought(thought.id);

               return thought;
            });
    }

    function thoughtClickHandler(targetThoughtId) {
        // if clicking on the current thought, do nothing.
        if (targetThoughtId === currentViewedThoughtId) {
            console.info('Click was on the selected note, doing nothing')
            return;
        }

        var currentViewedThoughtId_temp = _.find(brainVisNetwork.visNodes.getIds(),
            function(nodeId) {
                return nodeId == targetThoughtId;
            }
        );

        console.debug('currentViewedThoughtId from visNodes: ', currentViewedThoughtId_temp);

        var node = brainVisNetwork.visNodes.get(currentViewedThoughtId_temp);
        console.debug('node from visNodes: ', node);

        currentViewedThought = {
            id: node.id,
            name: node.label
        };

        console.debug('currentViewedThought from visNodes: ', currentViewedThought);

        console.debug('targetThoughtId: ', targetThoughtId);
        console.debug('brainVisNetwork.visNodes: ', brainVisNetwork.visNodes);

        console.debug('brainVisNetwork.visNodes: ', brainVisNetwork.visNodes);

        currentViewedThoughtId = targetThoughtId;
        thoughtStorage.logTree();
        var targetThought = thoughtStorage.findThoughtById(targetThoughtId);

        if (!targetThought) {
            throw new Error('changeThought(): couldn\'t find targetThought in thoughtStorage by id: ', targetThoughtId);
        }
        console.debug('thoughts-mind-map-view.thoughtClickHandler(): targetThought: ', targetThought);

        changeThought(targetThought);
    }

    /**
     * Load child thoughts for clicked thought, 
     * and redraw the network for new thoughts.
     */
    function changeThought(targetThought) {
        console.info('===Event=== Change thought ===Event===');
        console.debug('thoughts-mind-map-view.changeThought()');

        console.debug('thoughts-mind-map-view.changeThought(): targetThought.children: ', targetThought.children);
        if (!_.isEmpty(targetThought.children)) {
            console.debug('thoughts-mind-map-view.changeThought(): targetThought has children in cache, rendering them: ', targetThought.children);
            renderChildren(targetThought.children);
        } else {
            console.info('[Get] child thoughts for "' + targetThought.name + '"...');
            fetchChildThoughts(targetThought)
                .then(renderChildren);
        }

        thoughtContentEditor.loadThought(targetThought);

        if (targetThought.parent) {
            if (!_.isEmpty(targetThought.parent.name)) {
                console.info('thoughts-mind-map-view.changeThought(): thought has a parent in cache, going to render it');
                renderParent();
            } else {
                console.info('[Get] parent for "' + targetThought.name + '"...');
                fetchParentThought(targetThought.id)
                    .then(function(thought) {
                        targetThought.parent = thought;
                        console.info('[Loaded] parent "' + thought.name + '"' + ' for thought "' + targetThought.name + '"');
                        renderParent();

                    });
            }
        }

        function fetchChildThoughts(thought) {
            var fetchingThoughtsSpinner = spinner.create('loading child thoughts');
            fetchingThoughtsSpinner.show();
            return thoughtStorage.fetchChildThoughts(thought)
                .finally(function() {
                    fetchingThoughtsSpinner.hide();
                });
        }

        function fetchParentThought(thoughtId) {
            var fetchingParentThought = spinner.create('loading parent thought');
            return thoughtStorage.fetchParentThought(thoughtId)
                .finally(function() {
                    fetchingParentThought.hide();
                });
        }

       function renderChildren(children) {
           $('[data-text="currentViewedThought"]').html(currentViewedThought.name);
           console.debug('thoughts-mind-map-view: adding child thoughts to brainVisNetwork');
           brainVisNetwork.addChildThoughts({
               children: children,
               parentThoughtId: targetThought.id
           });
       }

       function renderParent() {
           brainVisNetwork.renderParentThought(targetThought);
       }
    }


});
