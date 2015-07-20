/**
 * Dependency injenction service container 
 */
define(['Environment', 'NodeFileSystem'], function(Environment, NodeFileSystem) {
    var ServiceContainer  = function() {
        this.getFileSystem = function() {
            //console.log('ServiceCont, env = ' + Environment.get());
            //console.log('ServiceCont, nodeFileWriter = ' + NodeFileWriter);
            switch(Environment.get()) {
                case 'node':
                    return new NodeFileSystem();
                    break;
            }
        }
    }
    return new ServiceContainer(); // this is called only once by require.js, so it's a singleton
});
