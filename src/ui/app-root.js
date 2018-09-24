define([
    'thought/view-thoughts/thoughts-mind-map-view',
    'storage/thought-storage',
    'ui/controls-help',
    'ui/login/login',
    'ui/thought-content-editor'
], function(
    thoughtsMindMapView,
    thoughtStorage,
    controlsHelp,
    loginScreen,
    thoughtContentEditor
) {
    let element;

    return {
        render: render
    };

    function render() {
        element =  document.getElementById('app-root');
        element.style.position = 'relative';
        element.style.height = '100%';

        var selectedThoughtId = thoughtStorage.getRoot().id;
        selectedThought = thoughtStorage.findThoughtById(selectedThoughtId);
        controlsHelp.render();

        element.append(thoughtContentEditor.render());

        //element.append(loginScreen.render());
        element.append(thoughtsMindMapView.render({
            thoughts: thoughtStorage.getThoughts(),
            selectedThought: selectedThought,
            selectedThoughtId: selectedThoughtId
        }));

        return element;
    }
});
