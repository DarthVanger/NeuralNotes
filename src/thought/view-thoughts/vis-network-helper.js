define([], function() {

    function VisNetworkHelper(visNetwork) {
        this.visNetwork = visNetwork;
    }

    VisNetworkHelper.prototype.getTargetThoughtId = function(networkEvent) {
        console.log('network click event: ', networkEvent);
        var targetNodeId = networkEvent.nodes[0];
        console.log('targetNodeId: ', targetNodeId);
        //var targetNode = nodes.get(targetNodeId);
        //console.log('targetNode: ', targetNode);
        //var targetThoughtName = targetNode.label;
        //console.log('targetThoughtName: ', targetThoughtName);
        //targetThought = { id: targetNodeId };
        //var targetThought = _.findWhere(thoughts, { name: targetThoughtName });
        //console.log('targetThought: ', targetThought);
        //return targetThought;
        return targetNodeId;
    }

    VisNetworkHelper.prototype.clickedOnThought = function(networkEvent) {
        return networkEvent.nodes.length > 0;
    }

    return VisNetworkHelper;
});
