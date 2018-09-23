define([
], function(
) {

    return {
        render: render
    };

    
    function render(props) {
        var headerElement = document.createElement('div');
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

        var deleteNoteButton = document.createElement('button');
        deleteNoteButton.innerText = 'Delete';
        deleteNoteButton.className = 'btn btn-info';
        deleteNoteButton.style.float = 'right';

        deleteNoteButton.addEventListener('click', props.onDeleteClick);

        headerElement.append(deleteNoteButton);

        return headerElement;
    }

    function deleteNote(event) {
    }


});
