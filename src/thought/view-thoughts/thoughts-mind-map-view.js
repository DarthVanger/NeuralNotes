console.debug('thoughts-mind-map-view.js');
define([
    'thought/view-thoughts/brain-vis-network',
    'thought/view-thoughts/vis-network-helper',
    'storage/thought-storage',
    'ui/spinner/site-global-loading-bar',
    'underscore',
    'utils/ui-error-notification'
], function(
    BrainVisNetwork,
    VisNetworkHelper,
    thoughtStorage,
    siteGlobalLoadingBar,
    _,
    uiErrorNotification
) {
    var brainVisNetwork;
    var visNetworkHelper;
    var thoughts = [];
    var currentViewedThought;
    var currentViewedThoughtId;
    var initialThought;

    var spinner = siteGlobalLoadingBar.create('thoughts-view');

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

        // init thought content controller
        thoughtContentController = new ThoughtContentController();
        thoughtContentController.loadThought(initialThought);
    }

    function visNetworkClickHandler(event) {
        if (visNetworkHelper.clickedOnThought(event)) {
            console.debug('change thought!');
            console.debug('event: ', event);
            var targetThoughtId = visNetworkHelper.getTargetThoughtId(event);

            thoughtClickHandler(targetThoughtId);
        }
    }

    function thoughtClickHandler(targetThoughtId) {
        // if clicking on the current thought, do nothing.
        if (targetThoughtId === currentViewedThoughtId) {
            return;
        }

        console.debug('brainVisNetwork.visNodes.getIds(): ', brainVisNetwork.visNodes.getIds());

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
            fetchChildThoughts(targetThought.id)
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

        function fetchChildThoughts() {
            var fetchingThoughtsSpinner = spinner.create('loading child thoughts');
            fetchingThoughtsSpinner.show();
            return thoughtStorage.fetchChildThoughts(targetThought.id)
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

        console.debug('thoughtsMindMapView: selectedThoughtContentContainer: ', selectedThoughtContentContainer);

        var textarea = selectedThoughtContentContainer.querySelector('textarea');

        initRealtimeSaving();

        console.debug('thoughtsMindMapView: textarea: ', textarea);


        this.loadThought = function(thought) {
            setThoughtContent('loading thought contents...');
            
            console.debug('ThoughtContentController.loadThought(), passed thought: ', thought);
            thoughtStorage.getThoughtContent(thought)
                .then(function(thoughtContent) {
                   console.debug('ThoughtContentController.loadThought(), loaded thought content: ', thoughtContent);
                   setThoughtContent(thoughtContent);
                });

        }

        function setThoughtContent(text){
            textarea.value = text;
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
                .catch(function() {
                  uiErrorNotification.show('Failed to save thought content');

                })
                .finally(function() {
                    savingThoughtContentSpinner.hide();
                });
        }
    }

});
