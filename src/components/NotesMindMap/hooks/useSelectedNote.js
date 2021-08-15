import { useSelector } from 'react-redux';
import { getSelectedNote } from 'components/NotesMindMap/NotesMindMapSelectors';

const useSelectedNote = () => {
  const selectedNote = useSelector(getSelectedNote);

  return selectedNote;
};

export default useSelectedNote;
