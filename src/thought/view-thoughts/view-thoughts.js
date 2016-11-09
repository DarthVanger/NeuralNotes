console.debug('view-htoughts.js');
define([
    //'thought/view-thoughts/thoughts-graph-view',
    'thought/view-thoughts/thoughts-mind-map-view',
    'thought/thought-storage',
    'router',
    'auth-service',
    'text!thought/view-thoughts/thought.html'
], function(
    //thoughtsGraphView,
    thoughtsMindMapView,
    thoughtStorage,
    router,
    authService,
    thoughtTemplate
) {

    return {
        init: init,
        onRender: onRender
    };

    function init() {
        if (!authService.authResult) {
            router.go('/');
            return;
        }
        
        //getFiles().then(function() {

            //console.debug('thoughtsGraphView: ', thoughtsGraphView);
            //thoughtsGraphView.set(storage.thoughts);
            //thoughtsGraphView.render();

            //listThoughts();
        //});
    }

    function onRender() {
        thoughtsMindMapView.set(thoughtStorage.getThoughts());
        thoughtsMindMapView.render();
    }

    function listThoughts() {
        //console.debug('listThoughts()');
        //console.debug('storage: ', storage);
        var files = thoughtStorage.getThoughts();
        //console.debug('storage.thoughts: ', storage.thoughts);
        //appendPre('Files:');
        if (files && files.length > 0) {
            files.forEach(function(file) {
                //console.debug('file: ', file);
                var thought = {
                    name: file.name,
                    //content: 'test content'
                };
                //console.debug('thought: ', thought);

                //console.debug('thoughtTemplate: ', thoughtTemplate);

                //console.debug('_: ', _);

                var thoughtHTML = _.template(thoughtTemplate)(thought);
                //console.debug('thoughtHTML: ', thoughtHTML);
                var $thought = $(thoughtHTML);
                //console.debug('$thought: ', $thought);

                var container = document.getElementById('output');
                //console.debug('container: ', container);
                container.appendChild($thought.get(0));
            });
        } else {
          appendPre('No files found.');
        }
    }



      /**
       * Append a pre element to the body containing the given message
       * as its text node.
       *
       * @param {string} message Text to be placed in pre element.
       */
      function appendPre(message) {
        var pre = document.getElementById('output');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
      }


});
