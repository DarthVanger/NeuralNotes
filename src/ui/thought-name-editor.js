import _ from 'underscore';
//import headerComponent from './thought-name-editor/header';

let element;

export default {render, unmount};

function render(options) {
  let thought = options.thought;
  element = document.createElement('div');
  element.id = 'thought-name-editor';
  element.style.position = 'absolute';
  element.style.top = '0';
  element.style.height = '4em';
  element.style.width = '100%';
  element.style.paddingTop = '1.5em';
  element.style.zIndex = '2';
  element.style.backgroundColor = 'black';
  element.style.color = 'white';

  let textArea = document.createElement('textarea');
  textArea.style.width = '100%';
  textArea.style.height = '100%';
  textArea.style.padding = '0.5em';
  textArea.style.backgroundColor = 'black';

  let debouncedOnChange = _.debounce(options.onChange, 1500);

  element.addEventListener('input', debouncedOnChange);

  textArea.innerText = thought.name;

  document.body.appendChild(element);
  element.append(textArea);
  //TODO: import component below with React
  //element.append(headerComponent.render({
  //  onDeleteClick: options.onDeleteClick,
  //  onUploadFileClick: options.onUploadFileClick
  //}));
}

function unmount() {
  if (element) {
    element.remove();
  }
}