console.debug('view-htoughts.js');
define([
    'thought/view-thoughts/thoughts-graph-view',
    'https://apis.google.com/js/client.js?onload=checkAuth"',
    'storage'
], function(
    thoughtsGraphView,
    gapi_GLOBAL_VARIABLE_MODULE,
    storage
) {

    return {
        init: init
    };

    function init() {
        console.debug('thoughtsGraphView: ', thoughtsGraphView);
        console.debug('storage: ', storage);
        thoughtsGraphView.set(storage.thoughts);
        thoughtsGraphView.render();

        appendPre('Files:');
        var files = storage.thoughts;
        if (files && files.length > 0) {
          for (var i = 0; i < files.length; i++) {
            var file = files[i];
            appendPre(file.name + ' (' + file.id + ')');
          }
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
