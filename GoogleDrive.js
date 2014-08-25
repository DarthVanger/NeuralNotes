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
      function handleAuthResult(authResult) {
        console.log("handleAuthResult(): called, typeof authResult = " + typeof authResult);
        console.log("handleAuthResult(): called, typeof callback = " + typeof callback);
        if (authResult) {
            console.log("HandleAuthResutl(): authResult.error = " + authResult.error);
        }
        if (authResult && !authResult.error) {
          console.log("handleAuthResult(): authResult OK");
          // Access token has been successfully retrieved, requests can be sent to the API.
        } else {
          // No access token could be retrieved, show the button to start the authorization flow.
          console.log("handeAuthResult(): immediate auth fail, calling not immediate");
          gapi.auth.authorize(
              {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
                handleAuthResult)
        }
      }

      this.authorize = function(callback) {
          gapi.auth.authorize(
              {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
              handleAuthResult)
      }

      /**
       * Start the file upload.
       *
       * @param {Object} evt Arguments from the file selector.
       */
      function uploadFile(evt) {
        gapi.client.load('drive', 'v2', function() {
          var file = evt.target.files[0];
          insertFile(file);
        });
      }

      /**
       * Insert new file.
       *
       * @param {File} fileData File object to read data from.
       * @param {Function} callback Function to call when the request is complete.
       */
      function insertFile(fileData, callback) {
        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";

        var reader = new FileReader();
        reader.readAsBinaryString(fileData);
        reader.onload = function(e) {
          var contentType = fileData.type || 'application/octet-stream';
          var metadata = {
            'title': fileData.name,
            'mimeType': contentType
          };

          var base64Data = btoa(reader.result);
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

    // WORKS :) creates a folder "/New Folder"
    this.createFolder = function(folderTitle) {
      data = new Object();
      data.title = folderTitle;
      //data.parents = [{"id":jQuery('#parent').val()}];
      data.mimeType = "application/vnd.google-apps.folder";
      gapi.auth.authorize(
          {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
          function() {
              gapi.client.load('drive', 'v2', function() {
                  console.log("createFoler(): typeof gapi = " + typeof gapi);
                  console.log("createFoler(): typeof gapi.client = " + typeof gapi.client);
                  console.log("createFoler(): typeof gapi.client.drive = " + typeof gapi.client.drive);
                  gapi.client.drive.files.insert({'resource': data}).execute(function(fileList){
                    console.log("gapi.client.drive.files.insert(): typeof fileList = " + typeof fileList); 
                    for (file in fileList) {
                      console.log("gapi.client.drive.files.insert(): fileList[" + file + "] = " + fileList[file]);
                    }
                  });
              });
        });
    }

    this.getFileList = function() {
      console.log("getFileList(): called");
      gapi.auth.authorize(
          {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
          function() {
              gapi.client.load('drive', 'v2', function() {
                  console.log("createFoler(): typeof gapi = " + typeof gapi);
                  console.log("createFoler(): typeof gapi.client = " + typeof gapi.client);
                  console.log("createFoler(): typeof gapi.client.drive = " + typeof gapi.client.drive);
                  //gapi.client.drive.files.list().execute(function(fileList) {
                  //  console.log("gapi.client.drive.files(): typeof fileList = " + typeof fileList); 
                  //  for (file in fileList) {
                  //    console.log("gapi.client.drive.files(): fileList[" + file + "] = " + fileList[file]);
                  //  }
                  //  for (item in fileList.items) {
                  //      for (key in item) {
                  //          document.write(key + ': ' + item[key] + '<br />');
                  //      }
                  //  }
                  //});
                  retrieveFiles(function(result) {
                      console.log('getFileList(): typeof retrieveAllFiles result = ' + typeof result);
                      for (var key in result.items) {
                         console.log('result['+key+'] = '+result.items[key]);
                         var item = result.items[key];
                         var count = 0;
                         console.log('file name = ' + item['title']);
                         //for (var key in item) {
                         //   console.log('item['+key+'] = '+item[key]);
                         //   if (count > 10) break;
                         //   count++;
                         //}
                      }
                  });
              });
        });

    }

    //this.getFile

    // function from google api docs
    function retrieveAllFiles(callback) {
      var pagesCount = 0;
      var pagesToRetrieve = 1;
      console.log("retrieveAllFiles(): called");
      var retrievePageOfFiles = function(request, result) {
        count++;
        console.log("retrievePageOfFiles(): called");
        request.execute(function(resp) {
          console.log("request.execute(): typeof resp = " + typeof resp);
          result = result.concat(resp.items);
          var nextPageToken = resp.nextPageToken;
          if (nextPageToken && pagesCount < pagesToRetrieve) {
            request = gapi.client.drive.files.list({
              'pageToken': nextPageToken
            });
            retrievePageOfFiles(request, result);
          } else {
            console.log("retrievePageOfFile(): calling back");
            callback(result);
          }
        });
      }
      var initialRequest = gapi.client.drive.files.list();
      retrievePageOfFiles(initialRequest, []);
    }

    // my attempt to write a retrieveFiles function
    function retrieveFiles(callback) {
        console.log('retrieveFiles(): called');
        var request = gapi.client.drive.files.list();
          request.execute(function(resp) {
            callback(resp);
            //console.log('Title: ' + resp.title);
            //console.log('Description: ' + resp.description);
            //console.log('MIME type: ' + resp.mimeType);
          });
    }

    /**
     * Print information about the current user along with the Drive API
     * settings.
     */
    this.printAbout = function() {
        gapi.client.load('drive', 'v2', function() {
          var request = gapi.client.drive.about.get();
          request.execute(function(resp) {
            console.log('resp.error: ' + resp.error);
            console.log('Current user name: ' + resp.name);
            console.log('Root folder ID: ' + resp.rootFolderId);
            console.log('Total quota (bytes): ' + resp.quotaBytesTotal);
            console.log('Used quota (bytes): ' + resp.quotaBytesUsed);
          });
        });
    }
}
