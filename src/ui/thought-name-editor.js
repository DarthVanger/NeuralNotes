define([
    'underscore',
    './thought-name-editor/header',
], function(
    _,
    headerComponent
) {
    var element;

    return {
        render: render,
        unmount: unmount
    };

    function render(options) {
        var thought = options.thought;
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

        var textArea = document.createElement('textarea');
        textArea.style.width = '100%';
        textArea.style.height = '100%';
        textArea.style.padding = '0.5em';
        textArea.style.backgroundColor = 'black';

        var debouncedOnChange = _.debounce(options.onChange, 1500);

        element.addEventListener('input', debouncedOnChange);

        textArea.innerText = thought.name;

        document.body.appendChild(element);
        element.append(textArea);
        element.append(headerComponent.render({
            onDeleteClick: options.onDeleteClick,
            onUploadFileClick: options.onUploadFileClick
        }));
    }

    function unmount() {
        if (element) {
            element.remove();
        }
    }
});
