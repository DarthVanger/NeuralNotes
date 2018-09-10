define([
    'text!thought/view-thoughts/view-thoughts.html',
    'thought/view-thoughts/thoughts-mind-map-view',
    'storage/thought-storage'
], function(
    template,
    thoughtsMindMapView,
    thoughtStorage
) {
    const $element = $('.site-content');

    return {
        render: render
    };

    function render() {
        mount();
    }

    function mount() {
        $element.empty();
        $element.append(template);
        onRender();
    }

    function onRender() {
        var selectedThoughtId = thoughtStorage.getRoot().id;
        selectedThought = thoughtStorage.findThoughtById(selectedThoughtId);
        thoughtsMindMapView.set({
            thoughts: thoughtStorage.getThoughts(),
            selectedThought: selectedThought,
            selectedThoughtId: selectedThoughtId
        });
        thoughtsMindMapView.render();
    }
});
