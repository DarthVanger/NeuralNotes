function handleClientLoad() {
    console.log("handleClientLoad(): called");
    var cloudDriveFactory = new CloudDriveFactory();
    var cloudDrive = cloudDriveFactory.create('google');
    console.log('debug', 'main: typeof cloudDrive = ' + typeof cloudDrive);
    cloudDrive.authorize(function() {
        cloudDrive.printAbout();
        //cloudDrive.createFolder('CloudBrain');
        //cloudDrive.getFileList();
    });
}
