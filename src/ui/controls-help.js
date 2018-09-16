define([
], function(
) {
    var element;

    return {
        render: render
    };

    function render() {
        element = document.createElement('DIV');
        element.id = 'tutorial';
        element.style.position = 'absolute';
        element.style.bottom = 0;
        element.style.left = 0;
        element.style.height = '6em';
        element.style.padding = '1em';
        element.style.backgroundColor = 'yellow';

        element.innerHTML = 'Controls:' + '<br />'
            + 'Double-click: add a child note' + '<br />'
            + 'Hold: edit note\'s name' + '<br />';

        document.body.appendChild(element);

    }

    function unmount() {
        element.remove();
    }
});
