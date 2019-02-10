import _ from 'underscore';
import siteGlobalLoadingBar from 'ui/spinner/site-global-loading-bar';
import thoughtStorage from 'storage/thought-storage';

let element;
let textarea;
let linkToGoogleDrive;
let currentViewedThought;

let spinner = siteGlobalLoadingBar.create('note text editor');

export default {
  render: render,
  loadThought: loadThought
};

function render() {
  element = document.createElement('div');
  element.className = 'selected-thought-content';
  textarea = document.createElement('textarea');
  textarea.className = 'thought-content__textarea';
  textarea.placeholder = 'Your note...';
  linkToGoogleDrive = document.createElement('a');

  linkToGoogleDrive.className = 'btn btn-primary btn-lg';
  linkToGoogleDrive.innerText = 'Open in Google Drive';
  linkToGoogleDrive.target = '_blank';
  hideLinkToGoogleDrive();

  element.append(textarea);
  element.append(linkToGoogleDrive);

  initRealtimeSaving();

  return element;
}

function loadThought(thought) {
  console.log('Load thought');
  currentViewedThought = thought;
  if (thought.isNote) {
    hideLinkToGoogleDrive();
    showTextArea();
    setThoughtContent('loading thought contents...');

    console.debug('ThoughtContentController.loadThought(), passed thought: ', thought);

    thoughtStorage.getThoughtContent(thought)
      .then(function (thoughtContent) {
        console.debug('ThoughtContentController.loadThought(), loaded thought content: ', thoughtContent);
        setThoughtContent(thoughtContent);
      });
  } else {
    hideTextArea();
    showLinkToGoogleDrive(thought);
  }

}

function hideTextArea() {
  textarea.style.display = 'none';
}

function showTextArea() {
  textarea.style.display = 'block';
}

function setThoughtContent(text) {
  textarea.value = text;
}

function showLinkToGoogleDrive(thought) {
  linkToGoogleDrive.href = thoughtStorage.getLinkToThought(thought);
  linkToGoogleDrive.style.display = 'block';
}

function hideLinkToGoogleDrive() {
  linkToGoogleDrive.style.display = 'none';
}


function initRealtimeSaving() {
  let REAL_TIME_SAVING_INTERVAL_MS = 1000;
  console.debug('ThoughtContentController.initRealtimeSaving()');
  let debouncedUpdate = _.debounce(updateThoughtContent, REAL_TIME_SAVING_INTERVAL_MS);

  textarea.addEventListener('input', function (event) {
    debouncedUpdate(event);
  });
}

function updateThoughtContent() {
  console.debug('ThoughtContentController.updateThoughtContent()');
  let savingThoughtContentSpinner = spinner.create('saving thought');
  savingThoughtContentSpinner.show();

  currentViewedThought.content = textarea.value;

  console.debug('RealtimeSaving: Save thought content: currentViewedThought: ', currentViewedThought);

  return thoughtStorage.update(currentViewedThought)
    .catch(function (error) {
      uiErrorNotification.show('Failed to save thought content');
      console.error(error);
    })
    .finally(function () {
      savingThoughtContentSpinner.hide();
    });
}