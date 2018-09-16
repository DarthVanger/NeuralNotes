define([
], function(
) {
    var element;

    return {
        render: render
    };

    function render(options) {
        var thought = options.thought;
        element = document.createElement('textarea');
        element.id = 'thought-name-editor';
        element.style.position = 'absolute';
        element.style.top = '4em';
        element.style.backgroundColor = 'pink';

        element.addEventListener('input', options.onChange);

        element.innerText = thought.name;

        document.body.appendChild(element);
    }
});
