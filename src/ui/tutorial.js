define([
    'storage/thought-storage'
], function(
    thoughtStorage
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
        watch(function() {
            if (!treeHasOnlyOneNode()) {
                setTimeout(editNoteTutorial, 2000);
                return false;
            }
            return true;
        });

        hint('Double-click "NeuralNotes" circle to create a note');
    }

    function editNoteTutorial() {
        hint('Hold a note, to edit it\'s name');
    }

    function watch(test) {
        if (test()) {
            setTimeout(function() {
                watch(test);
            }, 2000);
        }
    }

    function hint(msg) {
       element.innerText = 'Hint: ' + msg; 
    }

    function treeHasOnlyOneNode() {
        return !Boolean(thoughtStorage.getRoot().children && thoughtStorage.getRoot().children.length);
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

    function unmount() {
        element.remove();
    }
});
