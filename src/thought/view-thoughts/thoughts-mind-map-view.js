define([
    'thought/view-thoughts/brain-vis-network',
    'thought/view-thoughts/vis-network-helper',
    'storage/thought-storage',
    'ui/spinner/site-global-loading-bar',
    'underscore',
    'ui/ui-error-notification',
    'ui/thought-name-editor'
], function(
    BrainVisNetwork,
    VisNetworkHelper,
    thoughtStorage,
    siteGlobalLoadingBar,
    _,
    uiErrorNotification,
    thoughtNameEditor
) {
    var brainVisNetwork;
    var visNetworkHelper;
    var thoughts = [];
    var currentViewedThought;
    var currentViewedThoughtId;
    var initialThought;

    var spinner = siteGlobalLoadingBar.create('mind map');

    var thoughtContentController;

    return {
        set: set,
        render: render
    };

    /**
     * Set thoughts and selectedThought.
     * @param {Array} options.thoughts - Array of thoughts to render.
     * @param {String} options.selectedThoughtId - Id of thought that should be in focus (center).
     */
    function set(options) {
        console.debug('thoughtsMindMapView.set(), options: ', options);
        thoughts = options.thoughts;
        console.debug('options.selectedThoughtId: ', options.selectedThoughtId);
        initialThought = options.selectedThought || thoughts.root;
        currentViewedThought = initialThought;
        currentViewedThoughtId = initialThought.id;
        console.debug('currentViewedThoughtId: ', currentViewedThoughtId);
    }
    
    /**
     * Create new vis network for thoughts.
     * (Erases the old one).
     */
    function render() {
        console.debug('thoughtsMindMapView.render()');
        console.debug('thoughts: ', thoughts);

        console.debug('thoughtsMindMapView: initializing brainVisNetwork');
        var visNetworkContainer = document.getElementById('thoughts-container');

        
        brainVisNetwork = new BrainVisNetwork({
            containerDomElement: visNetworkContainer
        });
        console.debug('thoughtsMindMapView: brainVisNetwork instance: ', brainVisNetwork);
        brainVisNetwork.renderInitialThought(initialThought);
        changeThought(initialThought);
        //var visNetwork = renderVisNetworkForOneThought(currentViewedThought);
        visNetworkHelper = new VisNetworkHelper(brainVisNetwork.visNetwork);

        brainVisNetwork.visNetwork.on('click', visNetworkClickHandler);
        brainVisNetwork.visNetwork.on('doubleClick', visNetworkDoubleClickHandler);
        brainVisNetwork.visNetwork.on('hold', visNetworkHoldHandler);

        // init thought content controller
        thoughtContentController = new ThoughtContentController();
        thoughtContentController.loadThought(initialThought);

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

        thoughtContentController.loadThought(targetThought);
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


    /**
     * Controller for the panel showing thought contents
     */
    function ThoughtContentController() {
        var selectedThoughtContentContainer = document.querySelector('.selected-thought-content');

        var textarea = selectedThoughtContentContainer.querySelector('textarea');
        var linkToGoogleDrive = document.createElement('a');

        linkToGoogleDrive.className = 'btn btn-primary btn-lg';
        linkToGoogleDrive.innerText = 'Open in Google Drive';
        linkToGoogleDrive.target = '_blank';
        selectedThoughtContentContainer.append(linkToGoogleDrive);

        initRealtimeSaving();

        this.loadThought = function(thought) {
            if (thought.isNote) {
                hideLinkToGoogleDrive();
                showTextArea();
                setThoughtContent('loading thought contents...');
                
                console.debug('ThoughtContentController.loadThought(), passed thought: ', thought);

                thoughtStorage.getThoughtContent(thought)
                    .then(function(thoughtContent) {
                       console.debug('ThoughtContentController.loadThought(), loaded thought content: ', thoughtContent);
                       setThoughtContent(thoughtContent);
                    });
            } else {
               hideTextArea();
               showLinkToGoogleDrive(thought.parent);
            }

        }

        function hideTextArea() {
            textarea.style.display = 'none';
        }

        function showTextArea() {
            textarea.style.display = 'block';
        }

        function setThoughtContent(text){
            textarea.value = text;
        }

        function showLinkToGoogleDrive(thought) {
            linkToGoogleDrive.href = thoughtStorage.getLinkToThought(thought);
            linkToGoogleDrive.style.display = 'block';
        }

        function hideLinkToGoogleDrive() {
            linkToGoogleDrive.style.display = 'none';
        }


        function initRealtimeSaving() {
            var REAL_TIME_SAVING_INTERVAL_MS = 1000;
            console.debug('ThoughtContentController.initRealtimeSaving()');
            var debouncedUpdate = _.debounce(updateThoughtContent, REAL_TIME_SAVING_INTERVAL_MS);

            textarea.addEventListener('input', function(event) {
                debouncedUpdate(event);
            });
        }

        function updateThoughtContent() {
            console.debug('ThoughtContentController.updateThoughtContent()');
            var savingThoughtContentSpinner = spinner.create('saving thought');
            savingThoughtContentSpinner.show();

            currentViewedThought.content = textarea.value;

            console.debug('RealtimeSaving: Save thought content: currentViewedThought: ', currentViewedThought);

            return thoughtStorage.update(currentViewedThought)
                .catch(function(error) {
                    uiErrorNotification.show('Failed to save thought content');
                    console.error(error);
                })
                .finally(function() {
                    savingThoughtContentSpinner.hide();
                });
        }
    }

});
