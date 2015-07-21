var ThoughtFileSaver = function() {
    var self = this;
    self.fs = require('fs');
};

ThoughtFileSaver.prototype.saveThought = function(thought) {
    var self = this;
    console.log('saving thought:');
    console.log(thought);
    var thoughtDirPath = 'thoughts/'+ thought.name;
    self.fs.mkdir(thoughtDirPath);
    self.fs.writeFile(thoughtDirPath + '/thought.txt', thought.content);
};


module.exports = ThoughtFileSaver;
