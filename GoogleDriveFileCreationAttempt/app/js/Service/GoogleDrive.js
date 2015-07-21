function GoogleDrive() {
      var CLIENT_ID = '1070074939556-h5pom84t5e0vkftqsvlhoe43erauak76.apps.googleusercontent.com';
      var SCOPES = 'https://www.googleapis.com/auth/drive';

      /**
       * Called when the client library is loaded to start the auth flow.
       */
      function handleClientLoad() {
        window.setTimeout(checkAuth, 1);
      }

      /**
       * Check if the current user has authorized the application.
       */
      this.checkAuth = function() {
        console.log("checkAuth called");
        gapi.auth.authorize(
            {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
            handleAuthResult);
      }

      /**
       * Called when authorization server replies.
       *
       * @param {Object} authResult Authorization result.
       */
      function handleAuthResult(authResult, callback) {
        console.log("handleAuthResult(): called, typeof authResult = " + typeof authResult);
        console.log("handleAuthResult(): called, typeof callback = " + typeof callback);
        if (authResult) {
            console.log("HandleAuthResutl(): authResult.error = " + authResult.error);
        }
        if (authResult && !authResult.error) {
          console.log("handleAuthResult(): authResult OK");
          // Access token has been successfully retrieved, requests can be sent to the API.
          gapi.client.load('drive', 'v2', function() {
             callback();
          });
        } else {
          // No access token could be retrieved, show the button to start the authorization flow.
          console.log("handeAuthResult(): immediate auth fail, calling not immediate");
          gapi.auth.authorize(
              {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
                function(authResult) {
                    handleAuthResult(authResult, callback);  
                });
        }
      }

      this.authorize = function(callback) {
          gapi.auth.authorize(
              {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
              function(authResult) {
                  handleAuthResult(authResult, callback);  
              });
      }


    // WORKS :) creates a folder "/New Folder"
    this.createFolder = function(config, callback) {
      data = new Object();
      data.title = config.title;
      data.parents = [{"id": config.parentId}]; 
      //data.parents = [{"id":jQuery('#parent').val()}];
      data.mimeType = "application/vnd.google-apps.folder";
      gapi.client.drive.files.insert({'resource': data}).execute(function(file) {
        //console.log("gapi.client.drive.files.insert(): typeof file = " + typeof file); 
        callback(file);
      });
    }

    /**
     * Print information about the current user along with the Drive API
     * settings.
     */
    this.printAbout = function() {
        var request = gapi.client.drive.about.get();
        request.execute(function(resp) {
          console.log('resp.error: ' + resp.error);
          console.log('Current user name: ' + resp.name);
          console.log('Root folder ID: ' + resp.rootFolderId);
          console.log('Total quota (bytes): ' + resp.quotaBytesTotal);
          console.log('Used quota (bytes): ' + resp.quotaBytesUsed);
        });
    }

    /**
     * Print a file's metadata.
     *
     * @param {String} fileId ID of the file to print metadata for.
     */
    this.printFile = function(fileId) {
      var request = gapi.client.drive.files.get({
        'fileId': fileId
      });
      request.execute(function(resp) {
        console.log('Title: ' + resp.title);
        console.log('Description: ' + resp.description);
        console.log('MIME type: ' + resp.mimeType);
      });
    }

    /**
     * 
     */
    this.retrieveRootDirectoryContents = function() {
      var request = gapi.client.drive.about.get();
      request.execute(function(resp) {
        console.log('resp.error: ' + resp.error);
        console.log('Current user name: ' + resp.name);
        console.log('Root folder ID: ' + resp.rootFolderId);
        console.log('Total quota (bytes): ' + resp.quotaBytesTotal);
        console.log('Used quota (bytes): ' + resp.quotaBytesUsed);
        rootFolderId = resp.rootFolderId;

      });
    }

    /**
     * Retrieve a list of files belonging to a folder.
     *
     * @param {String} folderId ID of the folder to retrieve files from.
     * @param {Function} callback Function to call when the request is complete.
     *
     */      
    this.retrieveAllFilesInFolder = function(folderId, callback) {
      var retrievePageOfChildren = function(request, result) {
        request.execute(function(resp) {
          result = result.concat(resp.items);
          var nextPageToken = resp.nextPageToken;
          if (nextPageToken) {
            request = gapi.client.drive.children.list({
              'folderId' : folderId,
              'pageToken': nextPageToken,
              'q' : 'trashed = false'
            });
            retrievePageOfChildren(request, result);
          } else {
            callback(result);
          }
        });
      }
      var initialRequest = gapi.client.drive.children.list({
          'folderId' : folderId,
          'q' : 'trashed = false'
        });
      retrievePageOfChildren(initialRequest, []);
    }

    /**
     * Find folder
     *
     * @param {String} config.title with title of folder to find.
     * @param {String} config.folderId id of folder to look in.
     * @param {Function} callback function to call when reqeust is complete.
     * @return (as callback parameter) found item or null.
     */
    this.findFolder = function(config, callback) {
        var title = config.title;
        var folderId = config.folderId || 'root';

        request = gapi.client.drive.children.list({
            'folderId' : folderId,
            'q' : 'title = "' + title + '"'
            + ' and trashed = false'
            + ' and mimeType = "application/vnd.google-apps.folder"'
        });

        request.execute(function(resp) {
           if (resp.items) {
               callback(resp.items);
           } else {
               callback(null);
           }

        });
    }

    /**
     * Insert new txt file.
     *
     * @param {String} config.title Title of the file.
     * @param {String} config.content Of the txt file.
     * @param {String} config.parentId Id of parent folder, where the file should be inserted.
     * @param {Function} callback Function to call when the request is complete.
     */
    this.insertTxtFile = function(config, callback) {
      const boundary = '-------314159265358979323846';
      const delimiter = "\r\n--" + boundary + "\r\n";
      const close_delim = "\r\n--" + boundary + "--";

        var contentType = 'application/octet-stream';
        var parentId = config.parentId || 'root';
        var metadata = {
          'title': config.title + '.txt',
          'mimeType': contentType,
          'parents': [{'id' : parentId}]
        };

        var base64Data = btoa(config.content);
        var multipartRequestBody =
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: ' + contentType + '\r\n' +
            'Content-Transfer-Encoding: base64\r\n' +
            '\r\n' +
            base64Data +
            close_delim;

        var request = gapi.client.request({
            'path': '/upload/drive/v2/files',
            'method': 'POST',
            'params': {'uploadType': 'multipart'},
            'headers': {
              'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
            },
            'body': multipartRequestBody});
        if (!callback) {
          callback = function(file) {
            console.log(file)
          };
        }
        request.execute(callback);
    }
}
