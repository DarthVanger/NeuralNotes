function handleClientLoad() {
    console.log("handleClientLoad(): called");
    var cloudDriveFactory = new CloudDriveFactory();
    var cloudDrive = cloudDriveFactory.create('google');
    console.log('debug', 'main: typeof cloudDrive = ' + typeof cloudDrive);
    cloudDrive.authorize(function() {
        // check if the user is new or existing
        cloudDrive.findFolder({
            'title': 'CloudBrain',
            'folderId': 'root'
        }, function(foundFolders) {
            if (foundFolders === null) {
                // new user
                console.log('new user, creating CloudBrain folder');
                cloudDrive.createFolder({'title': 'CloudBrain'}, function(file) {
                    console.log('Newly created CloudBrain folder id = ' + file.id);
                    // init interface for new user
                });
            } else {
                // existing user
                // check if user doesn't have two brain folders mistakenly
                if (foundFolders.length > 1) {
                    // user has more than 1 cloud brain folder!
                    throw "User has more than 1 CloudBrain folder!";
                } else {
                    // user has one cloud brain folder
                    cloudBrainFolder = foundFolders[0];
                    //cloudDrive.printFile(cloudBrainFolder.id); 
                    console.log('Found CloudBrain folder, its id = ' + cloudBrainFolder.id);
                    repository = new ThoughtGoogleDriveRepository({
                        'brainRootFolderId': cloudBrainFolder.id
                    });
                    
                    // testing creation of a new thought
                    var thought = new Thought();
                    thought.setTitle('testThought 4');
                    thought.setContent('test thought content :)');
                    thought.setLinks('projects: 1, stuff: 2');
                    repository.persist(thought);

                    // brainEngine.parseBrainFolder(cloudBrainFolder);
                    // init interface for existing user
                }
            }
        });

       //cloudDrive.createFolder('CloudBrain');

       //cloudDrive.insertTxtFile({
       //    'title': 'test',
       //    'content': 'test content',
       //    'parentId': 'root'
       //}, function(file) {
       //    console.log(file);
       //});
    });
}
