import { useSelector } from 'react-redux';
import { graphSelector } from 'components/NotesMindMap/NotesMindMapSelectors';

const useGraph = () => {
  const graph = useSelector(graphSelector);

  return graph;
};

export default useGraph;
