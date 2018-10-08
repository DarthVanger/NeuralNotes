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
    loginPage,
    thoughtContentEditor
) {
    let element;

    return {
        render: render
    };

    function render(props) {
        element =  document.getElementById('app-root');
        element.style.position = 'relative';
        element.style.height = '100%';

        switch(props.page) {
            case 'login':
                renderLoginPage();
                break;
            case 'notes':
                renderNotesPage();
                break;
            default:
                throw new Error('unknown page: ', page);
        }

        function renderLoginPage() {
            element.append(loginPage.render({
                redirectToNotesPage: function() {
                    loginPage.unmount();
                    renderNotesPage();
                }
            }));
        }

        function renderNotesPage() {
            var selectedThoughtId = thoughtStorage.getRoot().id;
            selectedThought = thoughtStorage.findThoughtById(selectedThoughtId);
            controlsHelp.render();

            element.append(thoughtContentEditor.render());

            element.append(thoughtsMindMapView.render({
                thoughts: thoughtStorage.getThoughts(),
                selectedThought: selectedThought,
                selectedThoughtId: selectedThoughtId
            }));
        }
    }
});
