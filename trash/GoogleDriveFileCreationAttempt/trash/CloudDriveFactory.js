/**
 *  Creates cloud drive classes
 */
CloudDriveFactory = function() {
    this.create = function(cloudDriveName) {
        switch(cloudDriveName) {
        case 'google':
            return new GoogleDrive();
        break;     
        default:
            console.log('ERROR', 'CloudDriveFactory(): cloudDriveName "' + cloudDriveName + '" is illegal');
       }
    }
}
