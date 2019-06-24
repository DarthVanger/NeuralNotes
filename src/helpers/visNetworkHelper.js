export class VisNetworkHelper {
  static getTargetNoteId(networkEvent) {
    return networkEvent.nodes[0];
  }

  static clickedOnNote(networkEvent) {
    return networkEvent.nodes.length > 0;
  }
}
