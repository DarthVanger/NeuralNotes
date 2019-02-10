export default {render};

function render(props) {
  let headerElement = document.createElement('div');
  headerElement.style.position = 'absolute';
  headerElement.style.top = '0';
  headerElement.style.zIndex = '3';
  headerElement.style.height = '1.5em';
  headerElement.style.width = '100%';
  headerElement.style.backgroundColor = '#aac';
  headerElement.style.padding = '0.25em';
  headerElement.style.color = 'black';
  headerElement.style.textTransform = 'uppercase';
  headerElement.innerText = 'Edit note name';

  let buttonsContainer = document.createElement('div');
  buttonsContainer.style.position = 'absolute';
  buttonsContainer.style.top = '0';
  buttonsContainer.style.right = '0';
  buttonsContainer.style.textAlign = 'right';
  buttonsContainer.className = 'btn-group';

  let deleteNoteButton = document.createElement('button');
  deleteNoteButton.innerText = 'Delete';
  deleteNoteButton.className = 'btn btn-danger';
  deleteNoteButton.addEventListener('click', props.onDeleteClick);

  let uploadFileButton = document.createElement('button');
  uploadFileButton.innerText = 'Upload files';
  uploadFileButton.className = 'btn btn-default';
  uploadFileButton.addEventListener('click', props.onUploadFileClick);

  buttonsContainer.append(uploadFileButton);
  buttonsContainer.append(deleteNoteButton);
  headerElement.append(buttonsContainer);

  return headerElement;
}
