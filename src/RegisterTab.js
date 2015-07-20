RegisterTab = function() {
    var self = this;
    self.thoughtFileSaver = new ThoughtFileSaver();
    self.$registerTab = $('#register-tab');
};

RegisterTab.prototype.init = function() {
    var self = this;
    var $form = self.$registerTab.find('#register-form');
    $form.submit(function(event) {
        event.preventDefault();
        self.saveThought();
    });
};

RegisterTab.prototype.saveThought = function() {
    var self = this;
    var thought = {};
    thought.name = self.$registerTab.find('#thought-name-input').val();
    thought.content = self.$registerTab.find('#thought-content-input').val();

    self.thoughtFileSaver.saveThought(thought);
};

