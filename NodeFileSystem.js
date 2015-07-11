define([], function() {
    fs = require('fs');

    var NodeFileSystem = function() {
        this.writeFile = fs.writeFile;
    }

    return NodeFileSystem;
});
