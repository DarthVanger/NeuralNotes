define([
], function(
) {
    var element;

    return {
        render: render
    };

    function render() {
        if (wasSeenByUser()) {
            console.info('Not rendering controls help as user has seen it already');
            return;
        }

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
        recordUserView()
        element.remove();
    }

    function recordUserView() {
        localStorage.setItem('controls_help:viewed', '1');
    }

    function wasSeenByUser() {
        return localStorage.getItem('controls_help:viewed');
    }
});
