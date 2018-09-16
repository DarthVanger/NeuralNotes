define([
    'underscore',
], function(
    _
) {
    var element;

    return {
        render: render,
        unmount: unmount
    };

    function render(options) {
        var thought = options.thought;
        element = document.createElement('textarea');
        element.id = 'thought-name-editor';
        element.style.position = 'absolute';
        element.style.top = '4em';
        element.style.backgroundColor = 'pink';

        var debouncedOnChange = _.debounce(options.onChange, 1500);

        element.addEventListener('input', debouncedOnChange);

        element.innerText = thought.name;

        document.body.appendChild(element);
    }

    function debounce(func, timeout) {
        setTimeout(func, timeout);
    }

    function unmount() {
        if (element) {
            element.remove();
        }
    }
});
