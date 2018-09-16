define([], function() {

    function VisNetworkHelper(visNetwork) {
        this.visNetwork = visNetwork;
    }

    VisNetworkHelper.prototype.getTargetThoughtId = function(networkEvent) {
        var targetNodeId = networkEvent.nodes[0];
        return targetNodeId;
    }

    VisNetworkHelper.prototype.clickedOnThought = function(networkEvent) {
        return networkEvent.nodes.length > 0;
    }

    return VisNetworkHelper;
});
