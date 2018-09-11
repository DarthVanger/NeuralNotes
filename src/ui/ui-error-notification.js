define([
], function(
) {
    return {
        show: show
    };

    function show(messageText) {
        var element = document.createElement('DIV');

        element.style.position = 'absolute';
        element.style.zIndex = '100';
        element.style.bottom = '0';
        element.style.left = '0';

        element.style.backgroundColor = 'pink';
        element.style.height = '6em';
        element.style.width = '320px';
        element.style.padding = '10px';
        element.style.borderRadius = '2px';

        element.innerText = 'ERROR: ' + messageText + '.\n Reload the browser tab please.';

        mount();

        function mount() {
            document.body.appendChild(element);
        }

        function unmount() {
            element.remove();
        }
    }
});
