console.debug('view-htoughts.js');
define([
    'thought/view-thoughts/thoughts-graph-view',
    'storage'
], function(
    thoughtsGraphView,
    storage
) {

    return {
        init: init
    };

    function init() {
        getFiles().then(function() {
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
        });
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

          return promise
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
