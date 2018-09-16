define([
], function(
) {
    var element;

    return {
        begin: begin
    };

    function begin() {
        render();
        createNoteTutorial();
    }

    function createNoteTutorial() {
        hint('Double-click "NeuralNotes" circle to create a note');
    }

    function hint(msg) {
       element.innerText = 'Hint: ' + msg; 
    }

    function render() {
        element = document.createElement('DIV');
        element.id = 'tutorial';
        element.style.position = 'absolute';
        element.style.bottom = 0;
        element.style.left = 0;
        element.style.height = '3em';
        element.style.padding = '1em';
        element.style.backgroundColor = 'yellow';

        document.body.appendChild(element);
    }
});
