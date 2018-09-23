define([
], function(
) {

    return {
        render: render
    };

    
    function render() {
        var headerElement = document.createElement('div');
        headerElement.style.position = 'absolute';
        headerElement.style.top = '0';
        headerElement.style.zIndex = '3';
        headerElement.style.height = '1.5em';
        headerElement.style.width = '100%';
        headerElement.style.backgroundColor = '#aac';
        headerElement.style.padding = '0.25em';
        headerElement.style.color = 'black';
        headerElement.style.textTransform = 'uppercase';
        headerElement.innerText = 'Edit note name';

        return headerElement;
    }


});
