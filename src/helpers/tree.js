export default function tree(root) {
  function find(predicate) {
    let foundNode;

    if (predicate(root)) {
      return root;
    }

    findInChildren(root);

    return foundNode;

    function findInChildren(node) {
      if (!node.children) {
        return;
      }

      node.children.forEach(childNode => {
        if (predicate(childNode)) {
          foundNode = childNode;
        } else {
          !foundNode && findInChildren(childNode);
        }
      });
    }
  }

  return {
    find,
  };
}
