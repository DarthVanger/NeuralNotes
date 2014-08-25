function createFolderr(authResult) {
   console.log("createFolder(): called");
   console.log("createFolder(): typeof authResult = " + typeof authResult);

   console.log("typeof gapi = " + typeof gapi);

   var API_NAME = 'drive';
   var API_VERSION = 'v2';
   
   gapi.client.load(API_NAME, API_VERSION, function() {
       console.log("drive client loaded");
       var access_token = authResult.getAccessToken();

       var request = gapi.client.request({
           'path': '/drive/v2/files/',
           'method': 'POST',
           'headers': {
               'Content-Type': 'application/json',
               'Authorization': 'Bearer ' + access_token,             
           },
           'body':{
               "title" : "Folder",
               "mimeType" : "application/vnd.google-apps.folder",
           }
       });

       request.execute(function(resp) { 
           console.log(resp); 
           document.getElementById("info").innerHTML = "Created folder: " + resp.title;
       });
   });
}
// WORKS :) creates a folder "/New Folder"
function createFolder(){
  data = new Object();
  data.title = 'New Folder';
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
