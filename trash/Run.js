define(['ServiceContainer'], function(ServiceContainer) {
    var Run = function() {
        this.run = function() {
            var fileSystem = ServiceContainer.getFileSystem();
            fileSystem.writeFile('testThought.txt', 'test thought2 :)');
        };
    }

    return new Run();
});
