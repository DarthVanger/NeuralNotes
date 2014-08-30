/**
 * Though Google Drive Repository.
 * Can store and get thoughts from Google Drive.
 */
function ThoughtGoogleDriveRepository(config) {
    var CLIENT_ID = '1070074939556-h5pom84t5e0vkftqsvlhoe43erauak76.apps.googleusercontent.com';
    var SCOPES = 'https://www.googleapis.com/auth/drive';
    var brainRootFolderId = config.brainRootFolderId;
    var cloudDrive = new GoogleDrive();
    
    /**
     * Persist thought to repository.
     * Creates folder with title thought.title under folder with id thought.parentId,
     * a file 'thought' containing thought.content, a file 'links' containing links info.
     *
     * @param {Thought} thought a Thought object to persist.
     */
    this.persist = function(thought) {
        console.log("persisting a thought, title = " + thought.getTitle());
        cloudDrive.createFolder({
            'title': thought.getTitle(),
            'parentId': thought.getParentId() || brainRootFolderId
        }, function(file) {
            console.log("thought folder creation success, file = " + file);
            // create thought file
            cloudDrive.insertTxtFile({
                'title': 'thought',
                'content': thought.getContent(),
                'parentId': file.id
            });     
            // create links file
            cloudDrive.insertTxtFile({
                'title': 'links',
                'content': thought.getLinks(),
                'parentId': file.id
            });     
        });
    }
}
