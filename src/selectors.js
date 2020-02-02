import * as NotesMindMapSelectors from './components/NotesMindMap/NotesMindMapSelectors';
import * as UploadsSelectors from './components/Uploads/UploadsSelectors';

/**
 * Global selectors
 *
 * Note!!!
 * Don't import it to local reducer level selectors to avoid circular dependencies
 *
 * https://cmichel.io/redux-selectors-structure
 */

export { NotesMindMapSelectors, UploadsSelectors };
