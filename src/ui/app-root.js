import thoughtsMindMapView from 'thought/view-thoughts/thoughts-mind-map-view';
import thoughtStorage from 'storage/thought-storage';
import controlsHelp from 'ui/controls-help';
import loginPage from 'ui/login/login';
import thoughtContentEditor from 'ui/thought-content-editor';
import './layout.css';

let element;

export default {render};

function render(props) {
  element = document.getElementById('app-root');
  element.style.position = 'relative';
  element.style.height = '100%';

  switch (props.page) {
    case 'login':
      renderLoginPage();
      break;
    case 'notes':
      renderNotesPage();
      break;
    default:
      throw new Error('unknown page: ', page);
  }

  function renderLoginPage() {
    element.append(loginPage.render({
      redirectToNotesPage: function () {
        loginPage.unmount();
        renderNotesPage();
      }
    }));
  }

  function renderNotesPage() {
    let selectedThoughtId = thoughtStorage.getRoot().id;
    let selectedThought = thoughtStorage.findThoughtById(selectedThoughtId);
    controlsHelp.render();

    element.append(thoughtContentEditor.render());

    element.append(thoughtsMindMapView.render({
      thoughts: thoughtStorage.getThoughts(),
      selectedThought: selectedThought,
      selectedThoughtId: selectedThoughtId
    }));
  }
}