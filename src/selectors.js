import * as NotesMindMapSelectors from './components/NotesMindMap/NotesMindMapSelectors';
import * as UploadsSelectors from './components/Uploads/UploadsSelectors';

/**
 * Global selectors
 *
 * Note!!!
 * Don't import it to local reducer level selectors to avoid circular dependencies
 *
 * Import them when you want to use them in the components where you want to use selectors from different modules
 * https://cmichel.io/redux-selectors-structure
 */

export { NotesMindMapSelectors, UploadsSelectors };
