console.debug('view-htoughts.js');
define([
    //'thought/view-thoughts/thoughts-graph-view',
    'storage',
    'router',
    'auth-service',
    'text!thought/view-thoughts/thought.html',
    'lodash'
], function(
    //thoughtsGraphView,
    storage,
    router,
    authService,
    thoughtTemplate,
    _
) {

    return {
        init: init
    };

    function init() {
        if (!authService.authResult) {
            router.go('/');
            return;
        }
        
        getFiles().then(function() {

            //console.debug('thoughtsGraphView: ', thoughtsGraphView);
            //thoughtsGraphView.set(storage.thoughts);
            //thoughtsGraphView.render();

            listThoughts();
        });
    }

    function listThoughts() {
        console.debug('listThoughts()');
        //console.debug('storage: ', storage);
        var files = storage.thoughts;
        console.debug('storage.thoughts: ', storage.thoughts);
        //appendPre('Files:');
        if (files && files.length > 0) {
            files.forEach(function(file) {
                var thought = {
                    name: file.name,
                    content: 'test content'
                };
                console.debug('thought: ', thought);

                console.debug('thoughtTemplate: ', thoughtTemplate);

                console.debug('_: ', _);

                var thoughtHTML = _.template(thoughtTemplate, thought)();
                console.debug('thoughtHTML: ', thoughtHTML);
                var $thought = $(thoughtHTML);
                console.debug('$thought: ', $thought);

                var container = document.getElementById('output');
                console.debug('container: ', container);
                container.appendChild($thought.get(0));
            });
        } else {
          appendPre('No files found.');
        }
    }


      function getFiles() {
          console.debug('getFiles()');
          var request = gapi.client.drive.files.list({
            'pageSize': 10,
            'fields': "nextPageToken, files(id, name)"
          });

          var promise = new Promise(function(resolve, reject) {
                request.execute(function(resp) {
                  console.debug('resp: ', resp);
                  var thoughts = resp.files;
                  storage.thoughts = thoughts;
                  resolve(thoughts);
                });
          });

          return promise;
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
