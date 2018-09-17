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
        element.style.height = '5em';
        element.style.padding = '.5em';
        element.style.backgroundColor = 'yellow';

        var closeIcon = document.createElement('SPAN');
        closeIcon.innerText = 'X';
        closeIcon.style.float = 'right';


        element.addEventListener('click', unmount);

        element.innerHTML = 'Controls:' + '<br />'
            + 'Double-click: add a child note' + '<br />'
            + 'Hold: edit note\'s name';

        document.body.appendChild(element);

        element.prepend(closeIcon);

    }

    function unmount() {
        element.remove();
    }
});
