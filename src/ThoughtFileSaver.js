var ThoughtFileSaver = function() {};
ThoughtFileSaver.prototype.saveThought = function(thought) {
    createDirectory('thought.name');
    writeFile('thought.name/thought.txt', thought.content);
};
