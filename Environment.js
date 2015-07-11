define([], function() {
    var Environment = function() {
        var self = this;
        var environment = 'node';
        this.set = function(environment) {
            self.environment = environment;
        };
        this.get = function() {
            return environment;
        };
        this.isNode = function() {
            return true;
        }

    }

    return new Environment();
})
