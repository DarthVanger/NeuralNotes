function VisNetworkHelper(visNetwork) {
  this.visNetwork = visNetwork;
}

VisNetworkHelper.prototype.getTargetNoteId = function (networkEvent) {
  var targetNodeId = networkEvent.nodes[0];
  return targetNodeId;
};

VisNetworkHelper.prototype.clickedOnNote = function (networkEvent) {
  return networkEvent.nodes.length > 0;
};

export default VisNetworkHelper;
