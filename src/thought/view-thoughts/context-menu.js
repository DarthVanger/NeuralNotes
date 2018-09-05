define([
], function(
) {
    /**
     * Initialize context menu, that appears when clicking on thought.
     */
    function ContextMenu(options) {
        var container = options.container;
        var network = options.network;
        var nodes = options.nodes;

        this.init = init;

        var menu = document.createElement('div');
        menu.innerHTML = '<div><i class="fa fa-plus-circle fa-big"></i> add thought</div>';
        menu.style.fontSize = '16px';
        menu.style.border = '1px solid black';
        menu.style.cursor = 'pointer';
        menu.style.padding= '5px';
        menu.style.backgroundColor = '#fff';
        menu.style.position = 'absolute';
        menu.style.display = 'none';
        container.appendChild(menu);
        //container.addEventListener('click', showContextMenu);
        
        /**
         * Stores currently selected thought -- the one which user clicked last time.
         */
        var currentSelectedThought;

        function init() {
            menu.addEventListener('click', createThought);
            network.on('click', showContextMenuHandler);
        }

        var menuIsShown;
        function showContextMenuHandler(event) {

            handleClick();

            function handleClick() {
                var x = event.event.center.x;
                var y = event.event.center.y;
                console.log('x: ', x, 'y: ', y);
                if (menuIsShown) {
                    removeContextMenu();
                    menuIsShown = false;
                } else {
                    if (event.nodes.length > 0) {
                        currentSelectedThought = getTargetThought(event);
                        console.log('currentSelectedThought: ', JSON.stringify(currentSelectedThought));
                        showContextMenu(x, y);
                        menuIsShown = true;
                    }
                }
            }

            function showContextMenu(x, y) {
                console.log('x: ', x, 'y: ', y);
                menu.style.left = x + 'px';
                menu.style.top = y + 'px';
                menu.style.display = 'block';
                //document.addEventListener('click', removeMenu);
            }

            function removeContextMenu() {
                console.log('removing menu');
                menu.style.display = 'none';
                //menu.style.display = 'none';
                //menu.parentNode.removeChild(menu);
                //document.removeEventListener('click', removeMenu);
            }

            function getTargetThought(networkEvent) {
                console.log('network click event: ', networkEvent);
                var targetNodeId = networkEvent.nodes[0];
                console.log('targetNodeId: ', targetNodeId);
                var targetNode = nodes.get(targetNodeId);
                console.log('targetNode: ', targetNode);
                var targetThoughtName = targetNode.label;
                console.log('targetThoughtName: ', targetThoughtName);
                targetThought = { id: targetNodeId };
                //var targetThought = _.findWhere(thoughts, { name: targetThoughtName });
                console.log('targetThought: ', targetThought);
                return targetThought;
            }

        }

        function createThought() {
            console.error('Create thought redirect is not implemented. TargetThought: ', currentSelectedThought);
            //router.go('create-thought', {
            //    parentThought: currentSelectedThought
            //});
        }

    }

    return ContextMenu;


});
